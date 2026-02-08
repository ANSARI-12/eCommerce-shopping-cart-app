# Shopping Cart App

A full-stack e-commerce application built with React (frontend) and Node.js/Express (backend), featuring user authentication, item management, cart, wishlist, and order history.

## Features

- **User Authentication**: Login and registration for users and admins.
- **Item Management**: Admins can add, view, and delete items. Users can browse and search items.
- **Shopping Cart**: Add items to cart, view cart, and manage quantities.
- **Wishlist**: Add/remove items from wishlist.
- **Order History**: View past orders.
- **Concert Listings**: Browse and manage concert events.
- **Responsive Design**: Works on desktop and mobile devices.

## Tech Stack

### Frontend

- React
- Vite (build tool)
- Axios (HTTP client)
- Tailwind CSS (styling)
- Lucide React (icons)

### Backend

- Node.js
- Express.js
- MongoDB (database)
- Mongoose (ODM)
- JWT (authentication)
- Multer (file uploads)
- bcryptjs (password hashing)

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd shopping-cart-app
   ```

2. Install dependencies for both frontend and backend:

   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

## Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Create a `.env` file in the backend directory with the following variables:

   ```
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/shopping-cart
   JWT_SECRET=your-secret-key
   ```

3. Start the backend server:
   ```bash
   npm start
   ```
   The server will run on `http://localhost:3000`.

## Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```
   The app will run on `http://localhost:5173` (default Vite port).

## Live Demo

- **Frontend**: https://ecommerce-shopping-cart-app-1.onrender.com
- **Backend API**: https://ecommerce-shopping-cart-app-1.onrender.com/api


## Usage

1. Open the frontend in your browser.
2. Register or login as a user or admin.
   - Default user login: username "abc", password "abc123"
   - Default admin login: username "admin", password "admin123"
3. Browse items, add to cart/wishlist, place orders.
4. Admins can manage items and view all orders.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Items

- `GET /api/items` - Get all items
- `POST /api/items` - Add new item (admin)
- `DELETE /api/items/:id` - Delete item (admin)

### Cart

- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `DELETE /api/cart/:id` - Remove item from cart

### Wishlist

- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist` - Add item to wishlist
- `DELETE /api/wishlist/:id` - Remove item from wishlist

### Orders

- `GET /api/orders` - Get user's order history
- `POST /api/orders` - Place an order

### Concerts

- `GET /api/concerts` - Get all concerts
- `POST /api/concerts` - Add new concert (admin)
- `DELETE /api/concerts/:id` - Delete concert (admin)

## Project Structure

```
shopping-cart-app/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── uploads/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── assets/
│   │   └── App.jsx
│   ├── public/
│   └── package.json
├── README.md
└── TODO.md
```

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Submit a pull request.

## License

This project is licensed under the MIT License.
