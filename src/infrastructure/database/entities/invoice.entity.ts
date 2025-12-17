import {
  IInvoice,
  InvoiceStatus,
} from "@domain/entities/invoice.entity.interface";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Company } from "./company.entity";

@Entity({ name: "invoices" })
export class Invoice implements IInvoice {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid", name: "company_id" })
  companyId!: string;

  @Column({ type: "decimal" })
  amount!: number;

  @Column({ type: "varchar", length: 3 })
  currency!: string;

  @Column({ type: "enum", enum: InvoiceStatus })
  status!: InvoiceStatus;

  @Column({ type: "date", name: "due_date" })
  dueDate!: Date;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt!: Date | null;

  @ManyToOne(() => Company, (company) => company.invoices)
  @Index()
  company!: Company;
}
