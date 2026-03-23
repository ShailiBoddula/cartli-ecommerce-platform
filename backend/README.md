# CartLi E-Commerce Platform - Backend

A production-ready e-commerce backend built with Spring Boot, featuring JWT authentication, payment processing, and order management.

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Architecture Overview](#architecture-overview)
3. [Payment Lifecycle](#payment-lifecycle)
4. [Database Schema](#database-schema)
5. [Environment Variables](#environment-variables)
6. [API Endpoints](#api-endpoints)
7. [Deployment](#deployment)
8. [Running Locally](#running-locally)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Spring Boot 3.x, Java 17 |
| **Security** | Spring Security, JWT |
| **Database** | PostgreSQL (Production), H2 (Development) |
| **ORM** | Spring Data JPA |
| **Build Tool** | Maven |
| **Frontend** | React 18, Vite, TailwindCSS |
| **Payments** | Razorpay (Mock/Real) |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                     │
│                   ┌─────────────────────┐                  │
│                   │   React Components  │                  │
│                   │   - Pages           │                  │
│                   │   - Components      │                  │
│                   │   - Context         │                  │
│                   └─────────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
                           │ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                      Backend (Spring Boot)                  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │                    Controllers                        │  │
│  │  - AuthController  │  OrderController  │  PaymentController  │  │
│  └─────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │                    Services                          │  │
│  │  - UserService  │  OrderService  │  RazorpayService │  │
│  └─────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │                    Repositories                       │  │
│  │  - JPA Repositories for all entities                 │  │
│  └─────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │                    Security                           │  │
│  │  - JWT Authentication  │  Security Config            │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           │ JPA
┌─────────────────────────────────────────────────────────────┐
│                    Database (PostgreSQL)                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│  │   User   │ │  Order   │ │ Payment  │ │   Product   │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Payment Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│                    Payment Flow Diagram                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────┐    ┌─────────────┐    ┌──────────────┐            │
│  │  User  │───▶│ Checkout    │───▶│ Create Order │            │
│  │         │    │ Page        │    │ (Backend)    │            │
│  └─────────┘    └─────────────┘    └──────┬───────┘            │
│                                           │                     │
│                                           ▼                     │
│                                  ┌─────────────────┐            │
│                                  │ Razorpay        │            │
│                                  │ Payment Gateway │            │
│                                  └────────┬────────┘            │
│                                           │                     │
│                     ┌─────────────────────┼─────────────────────┐
│                     │ Success             │ Failure             │
│                     ▼                     ▼                     │
│            ┌──────────────┐      ┌──────────────┐              │
│            │ Verify       │      │ Show Error   │              │
│            │ Payment      │      │ (Retry)      │              │
│            └──────┬───────┘      └──────────────┘              │
│                   │                                             │
│                   ▼                                             │
│          ┌─────────────────┐                                   │
│          │ Update Order    │                                   │
│          │ Status: PAID    │                                   │
│          └─────────────────┘                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Payment Status Enum

```java
public enum PaymentStatus {
    CREATED("Payment Created"),
    PAYMENT_PENDING("Awaiting Payment"),
    SUCCESS("Payment Successful"),
    FAILED("Payment Failed");
}
```

### Order Status Enum

```java
public enum OrderStatus {
    CREATED("Order Created"),
    PAID("Payment Received"),
    SHIPPED("Order Shipped"),
    DELIVERED("Order Delivered"),
    CANCELLED("Order Cancelled");
}
```

---

## Database Schema

### Users Table
| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| email | VARCHAR(255) | Unique email |
| password | VARCHAR(255) | Encrypted password |
| first_name | VARCHAR(100) | First name |
| last_name | VARCHAR(100) | Last name |
| mobile | VARCHAR(20) | Phone number |

### Orders Table
| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| user_id | BIGINT | Foreign key to User |
| order_date | TIMESTAMP | Order creation time |
| status | VARCHAR(20) | Order status (enum) |
| total_price | DECIMAL | Total order amount |
| shipping_address_id | BIGINT | Foreign key to Address |

### PaymentInformation Table
| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| order_id | BIGINT | Foreign key to Order |
| user_id | BIGINT | Foreign key to User |
| amount | DECIMAL | Payment amount |
| status | VARCHAR(20) | Payment status (enum) |
| razorpay_order_id | VARCHAR(100) | Razorpay order ID |
| razorpay_payment_id | VARCHAR(100) | Razorpay payment ID |
| payment_time | TIMESTAMP | Payment completion time |

---

## Environment Variables

Create a `.env` file or set these environment variables for production:

```bash
# Server Configuration
SERVER_PORT=5454

# Database Configuration
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/shopsy
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-minimum-256-bits
JWT_EXPIRATION=86400000

# Razorpay Configuration (for real payments)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_ENABLE_MOCK=false

# Frontend URL (for CORS)
CORS_ORIGIN=http://localhost:5173
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | Get user's orders |
| GET | `/api/orders/{id}` | Get order by ID |
| POST | `/api/orders/place` | Place order from cart |
| PUT | `/api/orders/{id}` | Update order status |
| DELETE | `/api/orders/{id}` | Cancel order |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payment/create-order` | Create payment order |
| POST | `/api/payment/verify` | Verify payment |
| POST | `/api/payment/simulate-success` | Simulate success (dev only) |

---

## Deployment

### Backend Deployment (Render/Railway/Heroku)

1. **Create Procfile:**
   ```
   web: java -jar target/backend-0.0.1-SNAPSHOT.jar
   ```

2. **Set Environment Variables** in your hosting platform's dashboard.

3. **Database:** Use managed PostgreSQL from your hosting provider.

4. **Build:**
   ```bash
   mvn clean package -DskipTests
   ```

### Frontend Deployment (Vercel/Netlify)

1. **Set API URL:**
   ```env
   VITE_API_URL=https://your-backend-api.com
   ```

2. **Deploy:** Connect your GitHub repository to Vercel/Netlify.

### CORS Configuration

The backend includes CORS configuration for production:

```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList(
            "http://localhost:5173",
            "https://your-production-domain.com"
        ));
        config.addAllowedMethod("*");
        config.addAllowedHeader("*");
        return new CorsFilter(source);
    }
}
```

---

## Running Locally

### Prerequisites
- Java 17+
- Maven 3.6+
- PostgreSQL (or H2 for development)

### Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Frontend Setup
```bash
npm install
npm run dev
```

### Testing Payments
For local testing, the mock Razorpay service is enabled by default. Use `/api/payment/simulate-success` to simulate successful payments.

To test failure scenarios, pass a signature containing "fail":
```json
{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "fail_test"
}
```

---

## Security Best Practices

1. **JWT Secrets**: Use strong, random secrets (256+ bits)
2. **Passwords**: BCrypt encryption with adequate work factor
3. **API Keys**: Store Razorpay keys in environment variables
4. **CORS**: Restrict origins in production
5. **Rate Limiting**: Implement for payment endpoints
6. **HTTPS**: Force SSL in production

---

## License

MIT License - See LICENSE file for details.
