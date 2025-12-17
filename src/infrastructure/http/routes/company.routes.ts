import { FastifyInstance } from "fastify";
import { CardDashboardController } from "@presentation/controllers/card-dashboard.controller";

const cardDashboardController = new CardDashboardController();

export async function companyRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get(
    "/companies/:companyId/card/dashboard",
    {
      schema: {
        description: "Get card dashboard data for a company",
        tags: ["Companies"],
        summary: "Get Card Dashboard",
        params: {
          type: "object",
          properties: {
            companyId: { type: "string" },
          },
        },
        response: {
          200: {
            description: "Successful response",
            type: "object",
            properties: {
              company: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  name: { type: "string" },
                  logoUrl: { type: "string" },
                },
              },
              card: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  status: { type: "string" },
                  imageUrl: { type: "string" },
                  spending: {
                    type: "object",
                    properties: {
                      limit: { type: "number" },
                      used: { type: "number" },
                      remaining: { type: "number" },
                      currency: { type: "string" },
                    },
                  },
                },
              },
              invoice: {
                type: "object",
                properties: {
                  hasInvoiceDue: { type: "boolean" },
                  dueAmount: { type: "number" },
                  currency: { type: "string" },
                  dueDate: { type: "string", nullable: true },
                },
              },
              transactions: {
                type: "object",
                properties: {
                  totalCount: { type: "number" },
                  items: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        amount: { type: "number" },
                        currency: { type: "string" },
                        date: { type: "string" },
                        merchant: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    cardDashboardController.getCardDashboard.bind(cardDashboardController),
  );
}
