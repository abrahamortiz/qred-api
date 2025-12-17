import { IBaseEntity } from "./base.entity.interface";
import { ICard } from "./card.entity.interface";

export interface ITransaction extends IBaseEntity {
  cardId: string;
  amount: number;
  currency: string;
  transactionDate: Date;
  card: ICard;
}
