import { FastifyReply, FastifyRequest } from "fastify";
import { TYPES } from "@infrastructure/di/types";
import { GetCardDashboardUseCase } from "@application/use-cases/get-card-dashboard.use-case";
import { container } from "@infrastructure/di/container";

interface CardDashboardParams {
  companyId: string;
}

export class CardDashboardController {
  async getCardDashboard(
    request: FastifyRequest<{ Params: CardDashboardParams }>,
    reply: FastifyReply,
  ): Promise<void> {
    const { companyId } = request.params;

    const useCase = container.get<GetCardDashboardUseCase>(
      TYPES.GetCardDashboardUseCase,
    );

    const result = await useCase.execute({ companyId });

    reply.status(200).send(result);
  }
}
