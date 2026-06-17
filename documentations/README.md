# Budget Tracker - MERN Financial App

A comprehensive full-stack financial application similar to Wallet by BudgetBakers, built with the MERN stack.

## Project Structure

```
budget-tracker/
├── server.js                    # Main Express server entry point
├── package.json                 # Backend dependencies
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore file
│
├── models.js                    # MongoDB models (User, Account)
├── middleware.js                # Auth middleware, error handling
├── controllers.js               # Authentication controllers
├── auth-routes.js               # Auth endpoints
├── user-routes.js               # User profile endpoints
├── account-routes.js            # Account management endpoints
│
└── client/                      # React frontend
    ├── package.json             # Frontend dependencies
    ├── vite.config.js           # Vite configuration
    ├── tailwind.config.js        # Tailwind CSS config
    ├── postcss.config.js         # PostCSS config
    ├── index.html                # HTML entry point
    ├── src/
    │   ├── main.jsx              # React entry point
    │   ├── App.jsx               # Main app component
    │   ├── api/                  # API client setup
    │   ├── components/           # Reusable components
    │   ├── pages/                # Page components
    │   ├── context/              # React Context (auth, theme)
    │   ├── styles/               # Global styles
    │   └── utils/                # Utility functions
    └── public/                   # Static assets
```

## Installation & Setup

### Backend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create .env file** from .env.example:
   ```bash
   cp .env.example .env
   ```

3. **Configure environment variables:**
   - `MONGODB_URI`: MongoDB connection string (local or Atlas)
   - `JWT_SECRET`: Secret key for JWT signing
   - `JWT_REFRESH_SECRET`: Secret key for refresh tokens
   - `PORT`: Server port (default: 5000)
   - `NODE_ENV`: 'development' or 'production'

4. **Ensure MongoDB is running** (local or remote Atlas connection)

5. **Start backend server:**
   ```bash
   npm run dev      # With auto-reload
   npm start        # Standard start
   ```

### Frontend Setup

1. **Navigate to client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev       # Runs on http://localhost:5173
   ```

### Running Both Simultaneously

From project root:
```bash
npm run client    # Starts both backend and frontend in development mode
```

## API Endpoints - Phase 1

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token

### User Profile
- `GET /api/users/profile` - Get current user profile
- `PATCH /api/users/profile` - Update profile (displayName, baseCurrency, privacyMode)
- `POST /api/users/change-password` - Change password

### Accounts
- `POST /api/accounts` - Create account
- `GET /api/accounts` - List all user accounts
- `GET /api/accounts/balance/total` - Get total balance across all accounts
- `GET /api/accounts/:id` - Get single account details
- `PATCH /api/accounts/:id` - Update account (name, icon, color)
- `DELETE /api/accounts/:id` - Delete account (soft delete)

## Authentication Flow

1. User signs up → Password hashed with Argon2 → JWT + Refresh token issued
2. Tokens stored in httpOnly cookies (XSS protection)
3. Each request includes token in Authorization header or cookie
4. Token expires in 1 hour, refresh token valid for 7 days
5. Protected routes use `verifyToken` middleware

## Database Models

### User
```javascript
{
  email: String (unique, lowercase),
  displayName: String,
  passwordHash: String (Argon2),
  baseCurrency: ['USD', 'INR', 'EUR', 'GBP', 'JPY', 'AUD'] (default: USD),
  privacyMode: Boolean (default: false),
  timestamps: { createdAt, updatedAt }
}
```

### Account
```javascript
{
  userId: ObjectId (ref User),
  accountName: String,
  accountType: ['Cash', 'Bank', 'CreditCard', 'Savings', 'Investment', 'Other'],
  icon: String (Lucide icon name),
  color: String (hex color code),
  initialBalance: Decimal128 (precise currency),
  currency: ['USD', 'INR', 'EUR', 'GBP', 'JPY', 'AUD'],
  isActive: Boolean (soft delete flag),
  timestamps: { createdAt, updatedAt }
}
```

## Phase 1 Implementation Status

✅ Backend boilerplate complete
✅ User authentication (JWT + Argon2)
✅ User profile & preferences
✅ Account management CRUD
✅ API routes structure

⏳ Frontend UI components (React)
⏳ Auth forms & validation
⏳ Account management UI
⏳ Protected routes & context
⏳ API integration

## Next Steps

1. Complete frontend React components
2. Test all API endpoints with Postman/Thunder Client
3. Implement Phase 2: Transaction Engine
4. Add error handling & validation improvements
5. Set up deployment configuration

## Security Notes

- Passwords hashed with Argon2 (cryptographically strong)
- Tokens stored in httpOnly cookies (cannot be accessed by JavaScript)
- CORS enabled for localhost:5173 in development
- Middleware validates JWT on protected routes
- Soft deletes preserve data history

## Technologies Used

- **Backend:** Express.js, Node.js
- **Database:** MongoDB, Mongoose
- **Frontend:** React, Vite, Tailwind CSS, Shadcn/UI
- **Authentication:** JWT, Argon2, httpOnly cookies
- **Validation:** express-validator
- **Charts:** Recharts (Phase 3)
- **Icons:** Lucide React

## License

ISC

## Contributing

This is a personal project. Feel free to fork and customize for your needs.
