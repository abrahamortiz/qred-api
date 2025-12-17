import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { GetCardDashboardUseCase } from "../get-card-dashboard.use-case";
import { ICompanyRepository } from "@domain/repositories/company.repository";
import { ICardRepository } from "@domain/repositories/card.repository";
import { IInvoiceRepository } from "@domain/repositories/invoice.repository";
import { ITransactionRepository } from "@domain/repositories/transaction.repository";
import { SpendingService } from "@domain/services/spending.service";
import { InvoiceService } from "@domain/services/invoice.service";
import { NotFoundError } from "@shared/errors";
import { ICompany } from "@domain/entities/company.entity.interface";
import { ICard, CardStatus } from "@domain/entities/card.entity.interface";
import {
  IInvoice,
  InvoiceStatus,
} from "@domain/entities/invoice.entity.interface";
import { ITransaction } from "@domain/entities/transaction.entity.interface";

describe("GetCardDashboardUseCase", () => {
  let useCase: GetCardDashboardUseCase;
  let companyRepository: jest.Mocked<ICompanyRepository>;
  let cardRepository: jest.Mocked<ICardRepository>;
  let invoiceRepository: jest.Mocked<IInvoiceRepository>;
  let transactionRepository: jest.Mocked<ITransactionRepository>;
  let spendingService: SpendingService;
  let invoiceService: InvoiceService;

  const mockCompany: ICompany = {
    id: "company-1",
    name: "Test Company AB",
    logoUrl: "https://example.com/logo.png",
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    invoices: [],
  };

  const mockCard: ICard = {
    id: "card-1",
    companyId: "company-1",
    status: CardStatus.ACTIVE,
    spendingLimit: 100000,
    currency: "SEK",
    imageUrl: "https://example.com/card.png",
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    company: mockCompany,
  };

  const mockInvoice: IInvoice = {
    id: "invoice-1",
    companyId: "company-1",
    amount: 25000,
    currency: "SEK",
    status: InvoiceStatus.DUE,
    dueDate: new Date("2025-01-31"),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    company: mockCompany,
  };

  const mockTransactions: ITransaction[] = [
    {
      id: "tx-1",
      cardId: "card-1",
      invoiceId: "invoice-1",
      merchant: "Amazon",
      amount: 1500,
      currency: "SEK",
      transactionDate: new Date("2025-12-17"),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      card: mockCard,
      invoice: mockInvoice,
    },
    {
      id: "tx-2",
      cardId: "card-1",
      invoiceId: "invoice-1",
      merchant: "Uber",
      amount: 3200,
      currency: "SEK",
      transactionDate: new Date("2025-12-16"),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      card: mockCard,
      invoice: mockInvoice,
    },
  ];

  beforeEach(() => {
    // Create mocked repositories
    companyRepository = {
      findOne: jest.fn(),
      findMany: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      findByName: jest.fn(),
    } as jest.Mocked<ICompanyRepository>;

    cardRepository = {
      findOne: jest.fn(),
      findMany: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      findByCompanyId: jest.fn(),
      findByStatus: jest.fn(),
    } as jest.Mocked<ICardRepository>;

    invoiceRepository = {
      findOne: jest.fn(),
      findMany: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      findByCompanyId: jest.fn(),
      findByStatus: jest.fn(),
    } as jest.Mocked<IInvoiceRepository>;

    transactionRepository = {
      findOne: jest.fn(),
      findMany: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      findByCardId: jest.fn(),
      findByDateRange: jest.fn(),
    } as jest.Mocked<ITransactionRepository>;

    // Create real service instances
    spendingService = new SpendingService();
    invoiceService = new InvoiceService();

    // Create use case instance
    useCase = new GetCardDashboardUseCase(
      companyRepository,
      cardRepository,
      invoiceRepository,
      transactionRepository,
      spendingService,
      invoiceService,
    );
  });

  describe("execute", () => {
    it("should return card dashboard data successfully", async () => {
      // Arrange
      companyRepository.findOne.mockResolvedValue(mockCompany);
      cardRepository.findOne.mockResolvedValue(mockCard);
      invoiceRepository.findByCompanyId.mockResolvedValue([mockInvoice]);

      // Mock findMany to return recent transactions first, then transactions without invoice
      transactionRepository.findMany
        .mockResolvedValueOnce(mockTransactions) // First call: recent transactions
        .mockResolvedValueOnce(mockTransactions); // Second call: transactions for spending

      // Act
      const result = await useCase.execute({ companyId: "company-1" });

      // Assert
      expect(result).toBeDefined();
      expect(result.company).toEqual({
        id: "company-1",
        name: "Test Company AB",
        logoUrl: "https://example.com/logo.png",
      });
      expect(result.card).toEqual({
        id: "card-1",
        status: CardStatus.ACTIVE,
        imageUrl: "https://example.com/card.png",
        spending: {
          limit: 100000,
          used: 4700,
          remaining: 95300,
          currency: "SEK",
        },
      });
      expect(result.invoice).toEqual({
        hasInvoiceDue: true,
        dueAmount: 25000,
        currency: "SEK",
        dueDate: "2025-01-31",
      });
      expect(result.transactions.items).toHaveLength(2);
      expect(result.transactions.totalCount).toBe(2);
      expect(result.transactions.items[0].merchant).toBe("Amazon");
      expect(result.transactions.items[0].amount).toBe(-1500);

      // Verify repository calls
      expect(companyRepository.findOne).toHaveBeenCalledWith({
        where: { id: "company-1" },
      });
      expect(cardRepository.findOne).toHaveBeenCalledWith({
        where: { companyId: "company-1" },
      });
      expect(invoiceRepository.findByCompanyId).toHaveBeenCalledWith(
        "company-1",
      );
      expect(transactionRepository.findMany).toHaveBeenCalledTimes(2);
    });

    it("should throw NotFoundError when company does not exist", async () => {
      // Arrange
      companyRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(
        useCase.execute({ companyId: "non-existent" }),
      ).rejects.toThrow(NotFoundError);
      await expect(
        useCase.execute({ companyId: "non-existent" }),
      ).rejects.toThrow("Company with id non-existent not found");

      expect(companyRepository.findOne).toHaveBeenCalledWith({
        where: { id: "non-existent" },
      });
      expect(cardRepository.findOne).not.toHaveBeenCalled();
    });

    it("should throw NotFoundError when card does not exist", async () => {
      // Arrange
      companyRepository.findOne.mockResolvedValue(mockCompany);
      cardRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute({ companyId: "company-1" })).rejects.toThrow(
        NotFoundError,
      );
      await expect(useCase.execute({ companyId: "company-1" })).rejects.toThrow(
        "No card found for company with id company-1",
      );
    });

    it("should handle company with no invoices", async () => {
      // Arrange
      companyRepository.findOne.mockResolvedValue(mockCompany);
      cardRepository.findOne.mockResolvedValue(mockCard);
      invoiceRepository.findByCompanyId.mockResolvedValue([]);
      transactionRepository.findMany
        .mockResolvedValueOnce(mockTransactions)
        .mockResolvedValueOnce(mockTransactions);

      // Act
      const result = await useCase.execute({ companyId: "company-1" });

      // Assert
      expect(result.invoice).toEqual({
        hasInvoiceDue: false,
        dueAmount: 0,
        currency: "SEK",
        dueDate: null,
      });
    });

    it("should handle company with only paid invoices", async () => {
      // Arrange
      const paidInvoice: IInvoice = {
        ...mockInvoice,
        status: InvoiceStatus.PAID,
      };
      companyRepository.findOne.mockResolvedValue(mockCompany);
      cardRepository.findOne.mockResolvedValue(mockCard);
      invoiceRepository.findByCompanyId.mockResolvedValue([paidInvoice]);
      transactionRepository.findMany
        .mockResolvedValueOnce(mockTransactions)
        .mockResolvedValueOnce(mockTransactions);

      // Act
      const result = await useCase.execute({ companyId: "company-1" });

      // Assert
      expect(result.invoice).toEqual({
        hasInvoiceDue: false,
        dueAmount: 0,
        currency: "SEK",
        dueDate: null,
      });
    });

    it("should handle card with no transactions", async () => {
      // Arrange
      companyRepository.findOne.mockResolvedValue(mockCompany);
      cardRepository.findOne.mockResolvedValue(mockCard);
      invoiceRepository.findByCompanyId.mockResolvedValue([mockInvoice]);
      transactionRepository.findMany
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      // Act
      const result = await useCase.execute({ companyId: "company-1" });

      // Assert
      expect(result.card.spending).toEqual({
        limit: 100000,
        used: 0,
        remaining: 100000,
        currency: "SEK",
      });
      expect(result.transactions.items).toHaveLength(0);
      expect(result.transactions.totalCount).toBe(0);
    });

    it("should return only the 10 most recent transactions", async () => {
      // Arrange
      const manyTransactions: ITransaction[] = Array.from(
        { length: 15 },
        (_, i) => ({
          id: `tx-${i}`,
          cardId: "card-1",
          invoiceId: null,
          merchant: `Merchant ${i}`,
          amount: 1000,
          currency: "SEK",
          transactionDate: new Date(2025, 11, 17 - i), // Descending dates
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          card: mockCard,
          invoice: null,
        }),
      );

      companyRepository.findOne.mockResolvedValue(mockCompany);
      cardRepository.findOne.mockResolvedValue(mockCard);
      invoiceRepository.findByCompanyId.mockResolvedValue([mockInvoice]);
      // Mock findMany to return first 3 for recent transactions, then all 15 for spending calculation
      transactionRepository.findMany
        .mockResolvedValueOnce(manyTransactions.slice(0, 3))
        .mockResolvedValueOnce(manyTransactions);

      // Act
      const result = await useCase.execute({ companyId: "company-1" });

      // Assert
      expect(result.transactions.items).toHaveLength(3);
      expect(result.transactions.totalCount).toBe(3);
      // Verify spending calculation used all 15 transactions
      expect(result.card.spending.used).toBe(15000);
    });

    it("should calculate spending correctly with multiple transactions", async () => {
      // Arrange
      const transactions: ITransaction[] = [
        { ...mockTransactions[0], invoiceId: null, amount: 5000 },
        { ...mockTransactions[1], invoiceId: null, amount: 3000 },
        { ...mockTransactions[0], id: "tx-3", invoiceId: null, amount: 2000 },
      ];

      companyRepository.findOne.mockResolvedValue(mockCompany);
      cardRepository.findOne.mockResolvedValue(mockCard);
      invoiceRepository.findByCompanyId.mockResolvedValue([mockInvoice]);
      // Mock findMany for recent transactions and spending calculation
      transactionRepository.findMany
        .mockResolvedValueOnce(transactions)
        .mockResolvedValueOnce(transactions);

      // Act
      const result = await useCase.execute({ companyId: "company-1" });

      // Assert
      expect(result.card.spending).toEqual({
        limit: 100000,
        used: 10000,
        remaining: 90000,
        currency: "SEK",
      });
    });

    it("should handle overdue invoices", async () => {
      // Arrange
      const overdueInvoice: IInvoice = {
        ...mockInvoice,
        status: InvoiceStatus.OVERDUE,
      };
      const transactionsWithoutInvoice = mockTransactions.map((t) => ({
        ...t,
        invoiceId: null,
      }));
      companyRepository.findOne.mockResolvedValue(mockCompany);
      cardRepository.findOne.mockResolvedValue(mockCard);
      invoiceRepository.findByCompanyId.mockResolvedValue([overdueInvoice]);
      transactionRepository.findMany
        .mockResolvedValueOnce(mockTransactions)
        .mockResolvedValueOnce(transactionsWithoutInvoice);

      // Act
      const result = await useCase.execute({ companyId: "company-1" });

      // Assert
      expect(result.invoice.hasInvoiceDue).toBe(true);
      expect(result.invoice.dueAmount).toBe(25000);
    });

    it("should format transaction amounts as negative numbers", async () => {
      // Arrange
      const transactionsWithoutInvoice = mockTransactions.map((t) => ({
        ...t,
        invoiceId: null,
      }));
      companyRepository.findOne.mockResolvedValue(mockCompany);
      cardRepository.findOne.mockResolvedValue(mockCard);
      invoiceRepository.findByCompanyId.mockResolvedValue([mockInvoice]);
      transactionRepository.findMany
        .mockResolvedValueOnce(mockTransactions)
        .mockResolvedValueOnce(transactionsWithoutInvoice);

      // Act
      const result = await useCase.execute({ companyId: "company-1" });

      // Assert
      result.transactions.items.forEach((item) => {
        expect(item.amount).toBeLessThan(0);
      });
    });

    it("should format dates correctly", async () => {
      // Arrange
      const transactionsWithoutInvoice = mockTransactions.map((t) => ({
        ...t,
        invoiceId: null,
      }));
      companyRepository.findOne.mockResolvedValue(mockCompany);
      cardRepository.findOne.mockResolvedValue(mockCard);
      invoiceRepository.findByCompanyId.mockResolvedValue([mockInvoice]);
      transactionRepository.findMany
        .mockResolvedValueOnce(mockTransactions)
        .mockResolvedValueOnce(transactionsWithoutInvoice);

      // Act
      const result = await useCase.execute({ companyId: "company-1" });

      // Assert
      expect(result.invoice.dueDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      result.transactions.items.forEach((item) => {
        expect(item.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });
    });
  });
});
