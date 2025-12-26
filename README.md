<div align="center">

# WEBHOOK-INGESTION-SERVICE

*Secure, Reliable Webhook Ingestion for Seamless Data Flow*

![Last Commit](https://img.shields.io/github/last-commit/BigFudge420/webhook-ingestion-service?label=last%20commit&color=blue)
![TypeScript](https://img.shields.io/badge/typescript-100.0%25-blue)
![Languages](https://img.shields.io/github/languages/count/BigFudge420/webhook-ingestion-service?label=languages)

**Built with the tools and technologies:**

![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![JSON](https://img.shields.io/badge/JSON-000000?style=flat&logo=json&logoColor=white)
![Markdown](https://img.shields.io/badge/Markdown-000000?style=flat&logo=markdown&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837?style=flat&logo=npm&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=flat&logo=prettier&logoColor=black)
![.ENV](https://img.shields.io/badge/.ENV-ECD53F?style=flat&logo=dotenv&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=flat&logo=zod&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat&logo=eslint&logoColor=white)

</div>

---

## 📋 Table of Contents

- [Overview](#overview-)
- [What this service does](#what-this-service-does-)
- [What this service does NOT do](#what-this-service-does-not-do-)
- [Tech Stack](#tech-stack-)
- [Signature Format](#signature-format-)
- [Environment Variables](#environment-variables-)
- [Build & Run Instructions](#build--run-instructions-)
  - [Prerequisites](#prerequisites-)
  - [1. Clone the repository](#1-clone-the-repository-)
  - [2. Installing dependencies](#2-installing-dependencies-)
  - [3. Configure environment variables](#3-configure-environment-variables-)
  - [4. Generate Prisma client](#4-generate-prisma-client-)
  - [5. Run database migrations](#5-run-database-migrations-)
  - [6. Run in development mode](#6-run-in-development-mode-)
  - [7. Build for production](#7-build-for-production-)
  - [8. Run the production build](#8-run-the-production-build-)
- [Testing the Service](#testing-the-service-)
  - [Generate a valid HMAC signature](#generate-a-valid-hmac-signature-)
  - [Send a webhook event](#send-a-webhook-event-)
  - [Query stored events](#query-stored-events-)
  - [Test error cases](#test-error-cases-)

---

A lightweight backend service that receives order status webhook events from a fulfillment provider, verifies their authenticity using HMAC signatures, stores them in PostgreSQL with safe deduplication, and exposes a polling API for internal consumers.

This service is intentionally simple and focuses on **correctness, security, and reliability** ✨, leaving all business logic to downstream systems.

---

## Overview 📋

External fulfillment providers (e.g. ShipStation-style systems) send order status updates via webhooks. These providers may retry the same event multiple times and require request signature verification.

This service acts as a **secure event inbox** 📬:

- accepts webhook events  
- verifies request authenticity (HMAC) 🔐  
- deduplicates events safely  
- persists events 💾  
- exposes a read-only API for polling recent events  

---

## What this service does ✅

- Receives webhook events via HTTP POST  
- Verifies HMAC signatures on incoming requests  
- Validates request payloads  
- Deduplicates events using database constraints  
- Stores events in PostgreSQL  
- Exposes a polling endpoint to retrieve recent events  

## What this service does NOT do ⛔

- Apply business logic  
- Trigger downstream workflows  
- Authenticate GET requests  
- Push events to other systems  

---

## Tech Stack 🛠️

- Node.js  
- Express  
- TypeScript  
- PostgreSQL  
- Prisma ORM  
- Zod (runtime payload validation)  

---

## Signature Format 🔑

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

will be rejected with **HTTP 401 Unauthorized** ❌.

---

## Environment Variables 🌍

The following environment variables are required:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
WEBHOOK_SECRET=your_shared_hmac_secret
```
---

## Build & Run Instructions 🏗️

### Prerequisites ✔️

- Node.js **18+**
- PostgreSQL **14+**
- npm
- A PostgreSQL database available locally or remotely

---

### 1. Clone the repository 📦

```bash
git clone https://github.com/BigFudge420/webhook-ingestion-service.git
cd webhook-ingestion-service
```

### 2. Installing dependencies ⬇️

```bash
npm install
```

### 3. Configure environment variables ⚙️

Create a .env file in the project root:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/webhooks
WEBHOOK_SECRET=your_shared_hmac_secret
PORT=3000
```

DATABASE_URL – PostgreSQL connection string

WEBHOOK_SECRET – shared secret used to verify webhook HMAC signatures

PORT – optional (defaults to 3000)

### 4. Generate Prisma client 🔧

```bash
npx prisma generate
```

### 5. Run database migrations 🗄️

```bash
npx prisma migrate dev
```

This creates the required tables and indexes.

### 6. Run in development mode 🔥

```bash
npm run dev
```

Uses tsx

Auto-restarts on file changes

Intended for local development only


### 7. Build for production 📦

```bash
npm run build
```

This compiles TypeScript into the dist/ directory.

### 8. Run the production build 🚀

```bash
npm start
```

This runs the compiled JavaScript from dist/server.js.

---

## Testing the Service 🧪

### Generate a valid HMAC signature 🔐

Use OpenSSL to compute the HMAC for a test payload:
```bash
echo -n '{"order_id":"ord_123","status":"shipped","timestamp":"2025-01-15T10:30:00Z","provider_event_id":"evt_001"}' | \
  openssl dgst -sha256 -hmac "your_shared_hmac_secret" | \
  awk '{print "sha256="$2}'
```

Replace `your_shared_hmac_secret` with your actual `WEBHOOK_SECRET`.

### Send a webhook event 📤
```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -H "X-Signature: sha256=<computed_signature_from_above>" \
  -d '{"order_id":"ord_123","status":"shipped","timestamp":"2025-01-15T10:30:00Z","provider_event_id":"evt_001"}'
```

**Expected response (first request):** ✅
```json
{"message":"Event stored"}
```

**Expected response (duplicate `provider_event_id`):** ⚠️
```json
{"message":"Duplicate Event"}
```

### Query stored events 📊
```bash
curl "http://localhost:3000/webhook?order_id=ord_123"
```

**Expected response:**
```json
[
  {
    "id": 1,
    "orderId": "ord_123",
    "status": "shipped",
    "providerTimeStamp": "2025-01-15T10:30:00.000Z",
    "providerEventId": "evt_001",
    "createdAt": "2025-12-26T12:34:56.789Z"
  }
]
```

### Test error cases ⚠️

**Missing signature:**
```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{"order_id":"ord_123","status":"shipped","timestamp":"2025-01-15T10:30:00Z","provider_event_id":"evt_001"}'
```
Returns `401 Unauthorized` with `{"message":"Missing signature"}` ❌

**Invalid signature format (no prefix):**
```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -H "X-Signature: abc123" \
  -d '{"order_id":"ord_123","status":"shipped","timestamp":"2025-01-15T10:30:00Z","provider_event_id":"evt_001"}'
```
Returns `401 Unauthorized` with `{"message":"Invalid signature format"}` ❌

**Malformed JSON:**
```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -H "X-Signature: sha256=abc123" \
  -d '{invalid json}'
```
Returns `400 Bad Request` with `{"message":"Invalid JSON payload"}` ❌