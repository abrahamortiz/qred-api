import { FastifyInstance } from "fastify";
import { CardDashboardController } from "@presentation/controllers/card-dashboard.controller";

const cardDashboardController = new CardDashboardController();

export async function companyRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get(
    "/companies/:companyId/card/dashboard",
    cardDashboardController.getCardDashboard.bind(cardDashboardController)
  );
}
