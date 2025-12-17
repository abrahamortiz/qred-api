# Qred - Card Dashboard API (Case Study)

## Overview

This project is a backend implementation for the "NodeJs Backend Developer - Case study". It provides a RESTful API to support a mobile view for Qred's card dashboard. The main goal is to improve collaboration between frontend and backend teams by providing a well-structured, easy-to-consume API that aggregates data from multiple sources (companies, cards, transactions, invoices) into a unified dashboard response.

The solution addresses the challenge of late API availability by implementing a backend-for-frontend (BFF) style endpoint that matches the specific needs of the mobile UI.

## Scope & Tradeoffs

### Scope

- **Single Aggregate Endpoint**: The primary focus is `GET /api/companies/:companyId/card/dashboard`, which returns everything needed for the mobile view in one request.
- **Domain Modeling**: Core entities (Company, Card, Invoice, Transaction) are modeled to support the business logic.
- **Business Logic**: Spending calculations, invoice due status checks, and transaction formatting are handled in the backend to keep the frontend "dumb".

### Tradeoffs

- **On-the-fly Calculation vs Persistence**: Spending limits and used amounts are calculated on the fly from transactions.
  - _Pro_: Always accurate, no synchronization issues.
  - _Con_: Can be slow if transaction history is huge (mitigated by indexing and potential future caching).
- **Monolithic Service**: Implemented as a single service rather than microservices.
  - _Pro_: Simpler to develop, test, and deploy for this scope.
  - _Con_: Less scalable if specific domains (e.g., Invoicing) need independent scaling.
- **Dependency Injection (InversifyJS)**:
  - _Pro_: loosely coupled components, easy testing (mocking).
  - _Con_: Added boilerplate and complexity for a small project.
- **No Authentication Layer**: Skipped for the scope of this demo (assumed to be handled by an API Gateway or middleware in a real setup).

## API Design

The API is designed to be "Frontend-First", providing data exactly as the UI needs it.

### Endpoint
`GET /api/companies/:companyId/card/dashboard`

### Documentation
The API documentation is available at `http://localhost:3000/documentation` when the server is running.

### Response Structure

```json
{
  "company": {
    "id": "uuid",
    "name": "Company Name",
    "logoUrl": "https://..."
  },
  "card": {
    "id": "uuid",
    "status": "active",
    "imageUrl": "https://...",
    "spending": {
      "limit": 100000,
      "used": 4500,
      "remaining": 95500,
      "currency": "SEK"
    }
  },
  "invoice": {
    "hasInvoiceDue": true,
    "dueAmount": 25000,
    "currency": "SEK",
    "dueDate": "2025-01-31" // Formatted for UI
  },
  "transactions": {
    "totalCount": 45,
    "items": [
      {
        "id": "uuid",
        "date": "2025-12-17",
        "merchant": "Amazon",
        "amount": -1500, // Negative for expenses
        "currency": "SEK"
      }
      // Limited to recent items
    ]
  }
}
```

## Database Design

The database uses PostgreSQL with TypeORM for ORM.

### Entities

1. **Company**: Root entity.
   - `id` (PK), `name`, `logoUrl`
2. **Card**: Linked to Company.
   - `id` (PK), `companyId` (FK), `spendingLimit`, `status`
3. **Invoice**: Linked to Company.
   - `id` (PK), `companyId` (FK), `amount`, `status` (PAID, DUE, OVERDUE), `dueDate`
4. **Transaction**: Linked to Card and optionally Invoice.
   - `id` (PK), `cardId` (FK), `invoiceId` (FK - nullable), `amount`, `merchant`, `date`

### Relationships

- Company 1:1 Card
- Company 1:N Invoices
- Card 1:N Transactions
- Invoice 1:N Transactions (Transactions belong to an invoice period)

## Architecture

The project follows **Clean Architecture** principles to ensure separation of concerns and testability.

```
src/
├── application/       # Application business rules
│   ├── use-cases/     # Orchestration logic (GetCardDashboardUseCase)
│   └── dtos/          # Data Transfer Objects
├── domain/            # Enterprise business rules
│   ├── entities/      # Core data structures
│   ├── repositories/  # Interfaces for data access
│   └── services/      # Domain logic (SpendingService, InvoiceService)
├── infrastructure/    # Frameworks & Drivers
│   ├── database/      # TypeORM implementation
│   ├── http/          # Fastify server & routes
│   └── di/            # Dependency Injection container
└── presentation/      # Interface Adapters
    └── controllers/   # HTTP Controllers
```

## How To Run

### Prerequisites

- Node.js (v20+ recommended)
- pnpm (or npm)
- PostgreSQL (local or Docker)

### Installation

```bash
pnpm install
```

### Configuration

Copy `.env.example` to `.env` and update the database credentials:

```bash
cp .env.example .env
```

### Running Locally

1. **Start Database** (ensure Postgres is running)
2. **Create Database**:

   ```bash
   pnpm db:create
   ```

3. **Seed Database** (Optional, creates sample data):

   ```bash
   pnpm db:seed
   ```

4. **Start Dev Server**:

   ```bash
   pnpm dev
   ```

   The API will be available at `http://localhost:3000`.

### Running Tests

Unit tests use Jest and run against the in-memory architecture (mocked repositories).

```bash
pnpm test
```

### Example Request

```bash
curl http://localhost:3000/api/companies/company-1/card/dashboard
```

## Future Improvements

If given more time, the following improvements would be prioritized:

1. **Authentication & Authorization**: Implement JWT-based auth middleware to ensure users can only access their own company's data.
2. **Caching**: Add Redis caching for the dashboard endpoint (TTL ~1-5 min) to reduce DB load, invalidated on new transactions.
3. **Pagination**: Add cursor-based pagination for the transactions list in the API (currently limits to top 10).
4. **Currency Conversion**: Integrate a real-time exchange rate service if supporting multi-currency cards.
5. **CI/CD**: Set up GitHub Actions for automated testing and linting.
6. **Error Handling**: Enhance error responses with standardized error codes and problem details.
