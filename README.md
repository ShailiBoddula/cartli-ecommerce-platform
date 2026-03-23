# CartLi E-commerce Website

## Overview
CartLi is a complete e-commerce website featuring a React frontend and a Spring Boot backend, utilizing PostgreSQL as the database. It provides a full shopping experience including user authentication, product browsing, cart management, and order processing.

## Technologies Used
- **Frontend**: React, Vite, Tailwind CSS, React Router DOM
- **Backend**: Spring Boot, Java
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Spring Security
- **Build Tools**: Maven (for backend), Vite (for frontend)

## Implemented Features

### User Service
The User Service handles user registration, authentication, and profile management.
- **Implemented**: User model with fields for personal information, UserService for business logic, and AuthController with endpoints for signup and signin.
- **Endpoints**:
  - `POST /auth/signup`: Registers a new user and returns a JWT token.
  - `POST /auth/signin`: Authenticates a user and returns a JWT token.
- **Technologies**: Uses BCrypt for password hashing and JWT for token generation.

### Cart Service
The Cart Service manages the shopping cart functionality, allowing users to add, view, and remove items.
- **Implemented**: Cart and CartItem models, CartService for cart operations, and CartController.
- **Endpoints**:
  - `GET /api/cart`: Retrieves the current user's cart.
  - `POST /api/cart/add`: Adds an item to the cart with product ID, quantity, and size.
  - `DELETE /api/cart/remove/{itemId}`: Removes an item from the cart.
- **Technologies**: Integrates with UserService for user identification via JWT.

### Order Service
The Order Service handles order creation, retrieval, updates, and cancellation.
- **Implemented**: Order model, OrderService for order logic, and OrderController.
- **Endpoints**:
  - `POST /api/order/place`: Places an order from the current user's cart.
  - `GET /api/order/user`: Retrieves all orders for the current user.
  - `PUT /api/order/{id}`: Updates order status.
  - `DELETE /api/order/{id}`: Cancels an order.
- **Technologies**: Manages order lifecycle and integrates with payment information.

### CartItem and OrderItem Services
These services manage individual items within carts and orders.
- **Implemented**: CartItemService and OrderItemService with implementations for CRUD operations on cart and order items.
- **CartItem Service**: Handles adding/removing items from carts, quantity updates.
- **OrderItem Service**: Manages items associated with orders, including retrieval by order ID.
- **Technologies**: Uses repositories for database interactions.

### Integration and Frontend Interaction
The frontend interacts seamlessly with the backend APIs to provide a dynamic user experience.
- **Implemented**: React components for various pages (Home, Products, Cart, Orders, etc.), using Axios or fetch for API calls. Context providers for state management (e.g., CartContext).
- **Features**: Product carousels, filtering, modals for authentication and cart, responsive design with Tailwind CSS.
- **Technologies**: React Router for navigation, Heroicons for UI elements.

### Order API
The Order API provides endpoints for order management.
- **Endpoints** (as listed in Order Service): place, user orders, update, cancel.
- **Integration**: Frontend calls these APIs from order-related pages like OrdersPage and CheckoutPage.

### OrderItem API
The OrderItem API handles operations on order items.
- **Endpoints**:
  - `GET /api/order/{orderId}/items`: Retrieves items for a specific order.
- **Integration**: Used in order details views on the frontend.

## How to Run the Application

### Prerequisites
- Java 17 or higher
- Node.js and npm
- PostgreSQL database running on localhost:5432 with database name `ecommerce_youtube`, username `postgres`, password `210039`

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```
2. Run the Spring Boot application:
   ```
   mvn spring-boot:run
   ```
   The backend will start on port 5454.

### Frontend Setup
1. In the root directory, install dependencies:
   ```
   npm install
   ```
2. Start the development server:
   ```
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173` (default Vite port).

### Database
Ensure PostgreSQL is configured as per `application.properties`. The application uses JPA with `ddl-auto=update` to create/update tables automatically.

## Project Structure
- `backend/`: Spring Boot application with controllers, services, models, and repositories.
- `src/`: React frontend with components, pages, and contexts.
- `public/`: Static assets.
- Configuration files: `package.json`, `vite.config.js`, `tailwind.config.js`, etc.
