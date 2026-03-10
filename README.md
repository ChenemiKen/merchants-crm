# Merchant CRM

A robust Merchant Management System That provides comprehensive APIs for merchant onboarding, merchant status management to support KYB, and automated notifications via webhooks.

## 🚀 Features

- **User Authentication**: Secure signup and login.
- **Role-Based Access**: Support for `admin` and `operator` roles.
- **Merchant Management**: Full CRUD operations for merchants, soft delete and detailed status history tracking.
- **Webhook Notifications**: Asynchronous notification system using BullMQ and Redis to notify external systems of merchant status changes.
- **API Documentation**: Interactive API documentation generated with Swagger UI.
- **Security**

## 🛠️ Technology Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Database**: PostgreSQL
- **Background Jobs**: [BullMQ](https://docs.bullmq.io/) with [Redis](https://redis.io/)
- **Validation**: [Zod](https://zod.dev/)
- **Documentation**: [Swagger](https://swagger.io/)
- **Testing**: [Jest](https://jestjs.io/)

## ⚙️ Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- Redis (for BullMQ)

## 🛠️ Setup and Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ChenemiKen/merchants-crm.git
   cd merchants-crm
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and populate it with your configuration. You can use `.env.example` as a template.

   ```env
   # App Configuration
   PORT=3000
   NODE_ENV=development

   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=merchant_crm
   DB_USER=postgres
   DB_PASSWORD=your_password

   # JWT Configuration
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRY=15m
   REFRESH_TOKEN_SECRET=your_refresh_secret
   REFRESH_TOKEN_EXPIRY_SEC=259200 # 3 days

   # Redis Configuration
   REDIS_HOST=127.0.0.1
   REDIS_PORT=6379

   # Notification Configuration
   NOTIFICATION_RETRY_DELAY=5000
   NOTIFICATION_MAX_RETRIES=3
   ```

4. **Initialize the Database**:
   Apply migrations to your database:
   ```bash
   npm run db:migrate
   ```

## 🏃 Running the Project

- **Development Mode**:
  ```bash
  npm run dev
  ```

- **Production Build**:
  ```bash
  npm run build
  npm start
  ```

## 🧪 Testing

Run the test suite using Jest:
```bash
npm test
```

## 📖 API Documentation

Once the server is running, you can access the interactive Swagger UI at:
`http://localhost:4000/api-docs`

---
Developed by [ChenemiKen](https://github.com/ChenemiKen).