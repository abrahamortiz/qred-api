import { injectable } from "inversify";
import { IInvoice, InvoiceStatus } from "@domain/entities/invoice.entity.interface";

export interface InvoiceDueResult {
  hasInvoiceDue: boolean;
  dueInvoice: IInvoice | null;
}

@injectable()
export class InvoiceService {
  findDueInvoice(invoices: IInvoice[]): InvoiceDueResult {
    const dueInvoices = invoices.filter(
      (invoice) =>
        invoice.status === InvoiceStatus.DUE ||
        invoice.status === InvoiceStatus.OVERDUE
    );

    return {
      hasInvoiceDue: dueInvoices.length > 0,
      dueInvoice: dueInvoices.length > 0 ? dueInvoices[0] : null,
    };
  }

  isDueOrOverdue(invoice: IInvoice): boolean {
    return (
      invoice.status === InvoiceStatus.DUE ||
      invoice.status === InvoiceStatus.OVERDUE
    );
  }
}
