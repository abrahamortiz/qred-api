import { inject, injectable } from "inversify";
import { UseCase } from "@shared/types/use-case.interface";
import { NotFoundError } from "@shared/errors";
import type { ICardRepository } from "@domain/repositories/card.repository";
import type { ITransactionRepository } from "@domain/repositories/transaction.repository";
import type { ICompanyRepository } from "@domain/repositories/company.repository";
import type { IInvoiceRepository } from "@domain/repositories/invoice.repository";
import { SpendingService } from "@domain/services/spending.service";
import { InvoiceService } from "@domain/services/invoice.service";
import {
  CardDashboardResponseDto,
  CardDto,
  CompanyDto,
  InvoiceDto,
  TransactionItemDto,
  TransactionsDto,
} from "@application/dtos/card-dashboard.dto";
import { TYPES } from "@infrastructure/di/types";

export interface GetCardDashboardInput {
  companyId: string;
}

@injectable()
export class GetCardDashboardUseCase
  implements UseCase<GetCardDashboardInput, CardDashboardResponseDto>
{
  constructor(
    @inject(TYPES.CompanyRepository)
    private readonly companyRepository: ICompanyRepository,
    @inject(TYPES.CardRepository)
    private readonly cardRepository: ICardRepository,
    @inject(TYPES.InvoiceRepository)
    private readonly invoiceRepository: IInvoiceRepository,
    @inject(TYPES.TransactionRepository)
    private readonly transactionRepository: ITransactionRepository,
    @inject(TYPES.SpendingService)
    private readonly spendingService: SpendingService,
    @inject(TYPES.InvoiceService)
    private readonly invoiceService: InvoiceService,
  ) {}

  async execute(
    input: GetCardDashboardInput,
  ): Promise<CardDashboardResponseDto> {
    const { companyId } = input;

    // Fetch company
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundError(`Company with id ${companyId} not found`);
    }

    // Find the card for the company
    const card = await this.cardRepository.findOne({ where: { companyId } });

    if (!card) {
      throw new NotFoundError(`Card with companyId ${companyId} not found`);
    }

    // Get recent transactions for this card
    const recentTransactions = await this.transactionRepository.findMany({
      where: { cardId: card.id },
      limit: 3,
      orderBy: { field: "transactionDate", direction: "desc" },
    });

    // Get transactions without invoice
    const transactions = await this.transactionRepository.findMany({
      where: { cardId: card.id, invoiceId: null },
    });

    // Calculate spending using service
    const spending = this.spendingService.calculateSpending(card, transactions);

    // Get invoices for the company
    const invoices = await this.invoiceRepository.findByCompanyId(companyId);

    // Find due invoice using service
    const { hasInvoiceDue, dueInvoice } =
      this.invoiceService.findDueInvoice(invoices);

    // Map to DTOs
    const companyDto: CompanyDto = {
      id: company.id,
      name: company.name,
      logoUrl: company.logoUrl,
    };

    const cardDto: CardDto = {
      id: card.id,
      status: card.status,
      imageUrl: card.imageUrl,
      spending,
    };

    const invoiceDto: InvoiceDto = {
      hasInvoiceDue,
      dueAmount: hasInvoiceDue && dueInvoice ? Number(dueInvoice.amount) : 0,
      currency:
        hasInvoiceDue && dueInvoice ? dueInvoice.currency : card.currency,
      dueDate:
        hasInvoiceDue && dueInvoice
          ? new Date(dueInvoice.dueDate).toISOString().split("T")[0]
          : null,
    };

    const transactionItems: TransactionItemDto[] = recentTransactions.map(
      (transaction) => ({
        id: transaction.id,
        amount: -Math.abs(Number(transaction.amount)),
        currency: transaction.currency,
        date: new Date(transaction.transactionDate).toISOString().split("T")[0],
        merchant: transaction.merchant,
      }),
    );

    const transactionsDto: TransactionsDto = {
      items: transactionItems,
      totalCount: recentTransactions.length,
    };

    return {
      company: companyDto,
      card: cardDto,
      invoice: invoiceDto,
      transactions: transactionsDto,
    };
  }
}
