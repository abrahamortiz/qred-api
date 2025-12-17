import { IBaseEntity } from "./base.entity.interface";
import { ICompany } from "./company.entity.interface";

export enum CardStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  BLOCKED = "blocked",
}

export interface ICard extends IBaseEntity {
  companyId: string;
  status: CardStatus;
  spendingLimit: number;
  currency: string;
  imageUrl: string;
  company: ICompany;
}
