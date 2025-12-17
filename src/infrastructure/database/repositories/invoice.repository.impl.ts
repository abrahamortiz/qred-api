import { injectable } from "inversify";
import { IInvoiceRepository } from "@domain/repositories/invoice.repository";
import {
  IInvoice,
  InvoiceStatus,
} from "@domain/entities/invoice.entity.interface";
import { BaseRepositoryImpl } from "./base.repository.impl";
import { Repository } from "typeorm";
import { Invoice } from "../entities/invoice.entity";
import { AppDataSource } from "../data-source";

@injectable()
export class InvoiceRepository
  extends BaseRepositoryImpl<IInvoice, string>
  implements IInvoiceRepository
{
  constructor() {
    super(AppDataSource.getRepository(Invoice) as Repository<IInvoice>);
  }

  async findByCompanyId(companyId: string): Promise<IInvoice[]> {
    return this.repository.find({ where: { companyId } });
  }

  async findByStatus(status: InvoiceStatus): Promise<IInvoice[]> {
    return this.repository.find({ where: { status } });
  }
}
