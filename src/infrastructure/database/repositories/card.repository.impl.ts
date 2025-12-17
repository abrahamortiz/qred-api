import { injectable } from "inversify";
import { ICardRepository } from "@domain/repositories/card.repository";
import { ICard, CardStatus } from "@domain/entities/card.entity.interface";
import { Repository } from "typeorm";
import { BaseRepositoryImpl } from "./base.repository.impl";
import { AppDataSource } from "../data-source";
import { Card } from "../entities/card.entity";

@injectable()
export class CardRepository
  extends BaseRepositoryImpl<ICard, string>
  implements ICardRepository
{
  constructor() {
    super(AppDataSource.getRepository(Card) as Repository<ICard>);
  }

  async findByCompanyId(companyId: string): Promise<ICard[]> {
    return this.repository.find({ where: { companyId } });
  }

  async findByStatus(status: CardStatus): Promise<ICard[]> {
    return this.repository.find({ where: { status } });
  }
}
