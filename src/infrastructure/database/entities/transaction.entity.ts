import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ITransaction } from "@domain/entities/transaction.entity.interface";
import { Card } from "./card.entity";
import { Invoice } from "./invoice.entity";

@Entity({ name: "transactions" })
export class Transaction implements ITransaction {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid", name: "card_id" })
  cardId!: string;

  @Column({ type: "uuid", name: "invoice_id", nullable: true })
  invoiceId!: string | null;

  @Column({ type: "varchar" })
  merchant!: string;

  @Column({ type: "decimal" })
  amount!: number;

  @Column({ type: "varchar", length: 3 })
  currency!: string;

  @Column({ type: "date" })
  transactionDate!: Date;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt!: Date | null;

  @ManyToOne(() => Card, { onUpdate: "CASCADE", onDelete: "RESTRICT" })
  @JoinColumn({ name: "card_id" })
  @Index()
  card!: Card;

  @ManyToOne(() => Invoice, { onUpdate: "CASCADE", onDelete: "SET NULL" })
  @JoinColumn({ name: "invoice_id" })
  @Index()
  invoice!: Invoice | null;
}
