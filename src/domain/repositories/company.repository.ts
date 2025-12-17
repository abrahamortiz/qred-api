import { ICompany } from "@domain/entities/company.entity.interface";
import { BaseRepository } from "./base.repository";

export interface ICompanyRepository extends BaseRepository<ICompany, string> {
  findByName(name: string): Promise<ICompany | null>;
}
