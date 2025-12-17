import { ICard, CardStatus } from "@domain/entities/card.entity.interface";
import { BaseRepository } from "./base.repository";

export interface ICardRepository extends BaseRepository<ICard, string> {
  findByCompanyId(companyId: string): Promise<ICard[]>;
  findByStatus(status: CardStatus): Promise<ICard[]>;
}
