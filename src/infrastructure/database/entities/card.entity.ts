import { CardStatus, ICard } from "@domain/entities/card.entity.interface";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Company } from "./company.entity";

@Entity({ name: "cards" })
export class Card implements ICard {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "company_id", type: "uuid" })
  companyId!: string;

  @Column({ type: "enum", enum: CardStatus })
  status!: CardStatus;

  @Column({ type: "decimal" })
  spendingLimit!: number;

  @Column({ type: "varchar", length: 3 })
  currency!: string;

  @Column({ type: "varchar" })
  imageUrl!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt!: Date | null;

  @OneToOne(() => Company, {
    onUpdate: "CASCADE",
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "company_id" })
  @Index()
  company!: Company;
}
