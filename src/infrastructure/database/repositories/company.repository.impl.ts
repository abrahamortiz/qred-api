import { injectable } from "inversify";
import { ICompanyRepository } from "@domain/repositories/company.repository";
import { ICompany } from "@domain/entities/company.entity.interface";
import { BaseRepositoryImpl } from "./base.repository.impl";
import { Repository } from "typeorm";
import { Company } from "../entities/company.entity";
import { AppDataSource } from "../data-source";

@injectable()
export class CompanyRepository
  extends BaseRepositoryImpl<ICompany, string>
  implements ICompanyRepository
{
  constructor() {
    super(AppDataSource.getRepository(Company) as Repository<ICompany>);
  }

  async findByName(name: string): Promise<ICompany | null> {
    return this.repository.findOne({ where: { name } });
  }
}
