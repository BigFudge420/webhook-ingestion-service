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

## Environment Variables

The following environment variables are required:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
WEBHOOK_SECRET=your_shared_hmac_secret
```
---

## Running Locally

1. Install dependencies

```
npm install
```

2. Configure environment variables

```
export DATABASE_URL=postgresql://user:password@localhost:5432/dbname
export WEBHOOK_SECRET=your_shared_hmac_secret
```

3. Run database migrations

```
npx prisma migrate dev
```

4. Start the server

```
npm run dev
```

The service will start on the configured port (default: 3000).
