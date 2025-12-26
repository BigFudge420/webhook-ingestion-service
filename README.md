# Webhook Ingestion Service

A lightweight backend service that receives order status webhook events from a fulfillment provider, verifies their authenticity using HMAC signatures, stores them in PostgreSQL with safe deduplication, and exposes a polling API for internal consumers.

This service is intentionally simple and focuses on **correctness, security, and reliability**, leaving all business logic to downstream systems.

---

## Overview

External fulfillment providers (e.g. ShipStation-style systems) send order status updates via webhooks. These providers may retry the same event multiple times and require request signature verification.

This service acts as a **secure event inbox**:

- accepts webhook events  
- verifies request authenticity (HMAC)  
- deduplicates events safely  
- persists events  
- exposes a read-only API for polling recent events  

---

## What this service does

- Receives webhook events via HTTP POST  
- Verifies HMAC signatures on incoming requests  
- Validates request payloads  
- Deduplicates events using database constraints  
- Stores events in PostgreSQL  
- Exposes a polling endpoint to retrieve recent events  

## What this service does NOT do

- Apply business logic  
- Trigger downstream workflows  
- Authenticate GET requests  
- Push events to other systems  

---

## Tech Stack

- Node.js  
- Express  
- TypeScript  
- PostgreSQL  
- Prisma ORM  
- Zod (runtime payload validation)  

---

### Signature Format

The `X-Signature` header **must** include the hashing algorithm prefix.

Expected format:

```
X-Signature: sha256=<hex-encoded-hmac>
```

Where:

- `sha256` is the hashing algorithm used to compute the HMAC
- `<hex-encoded-hmac>` is the HMAC SHA-256 digest of the **raw request body**, encoded as a hexadecimal string

Requests that:
- omit the `X-Signature` header
- omit the `sha256=` prefix
- use a different hashing algorithm
- provide a malformed or invalid signature

will be rejected with **HTTP 401 Unauthorized**.

---

## Environment Variables

The following environment variables are required:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
WEBHOOK_SECRET=your_shared_hmac_secret
```
---

## Build & Run Instructions

### Prerequisites

- Node.js **18+**
- PostgreSQL **14+**
- npm
- A PostgreSQL database available locally or remotely

---

### 1. Clone the repository

```bash
git clone https://github.com/BigFudge420/webhook-ingestion-service.git
cd webhook-ingestion-service
```

### 2. Installing dependecies

```
npm install
```

### 3. Configure environment variables

Create a .env file in the project root:

```
DATABASE_URL=postgresql://user:password@localhost:5432/webhooks
WEBHOOK_SECRET=your_shared_hmac_secret
PORT=3000
```

DATABASE_URL – PostgreSQL connection string

WEBHOOK_SECRET – shared secret used to verify webhook HMAC signatures

PORT – optional (defaults to 3000)

### 4. Generate Prisma client

```
npx prisma generate
```

### 5. Run database migrations

```
npx prisma migrate dev
```

This creates the required tables and indexes.

### 6. Run in development mode

```
npm run dev
```

Uses ts-node-dev

Auto-restarts on file changes

Intended for local development only


### 7. Build for production

```
npm run build
```

This compiles TypeScript into the dist/ directory.

### 8. Run the production build

```
npm start
```

This runs the compiled JavaScript from dist/server.js.