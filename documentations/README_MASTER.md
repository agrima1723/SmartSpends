# 💰 Budget Tracker - Full Stack Financial Application

## 🎯 Overview

**Budget Tracker** is a comprehensive full-stack financial management application built with the MERN stack. It provides users with complete control over their finances through transaction tracking, smart categorization, multi-currency support, and beautiful analytics dashboards.

Similar to apps like **Wallet by BudgetBakers**, Budget Tracker transforms raw financial data into actionable insights with intuitive visualizations.

---

## ✨ Key Features

### Phase 1: Authentication & Accounts ✅
- Secure JWT-based authentication
- Argon2 password hashing
- User profile management
- Multi-currency support
- Account management with custom colors/icons

### Phase 2: Transaction Engine ✅
- Income/expense/transfer tracking
- **Calculator input** (50 + 20 = 70)
- Smart categorization system
- Multi-currency automatic conversion
- Advanced search & filtering
- Analytics aggregation

### Phase 3: Analytics & Visualization ⏳
- Beautiful dashboard with charts
- Spending breakdown by category
- Balance trend analysis
- Income vs Expenses comparison
- Cash flow forecasting

### Phase 4+: Planned
- Budgeting & spending limits
- Recurring transactions
- Group splitting & debt settlement
- Financial goals tracking
- Receipt uploads
- CSV import/export

---

## 🏗️ Project Structure

```
budget-tracker/
│
├── backend/                    # Node.js + Express API
│   ├── server.js
│   ├── models.js              # MongoDB schemas
│   ├── middleware.js          # Auth & error handling
│   ├── controllers.js         # Business logic
│   ├── *-routes.js            # API endpoints
│   ├── utils/                 # Utilities
│   ├── package.json
│   └── .env.example
│
├── frontend/                   # React + Vite UI
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Page components
│   │   ├── api/               # API client
│   │   ├── context/           # React context
│   │   └── utils/             # Utilities
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html
│
├── docs/                       # Documentation
├── api-collections/            # Postman collections
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- npm v8+
- MongoDB (local or Atlas cloud)
- Git

### Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
# MONGODB_URI=mongodb://localhost:27017/budget-tracker
# JWT_SECRET=your_secret_key_here

# Start development server
npm run dev

# Server runs on http://localhost:5000
```

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# App runs on http://localhost:5173
```

### Running Both Together

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

---

## 📊 API Endpoints

### Summary
- **Phase 1:** 13 endpoints (Auth, User, Account)
- **Phase 2:** 13 endpoints (Categories, Transactions)
- **Total:** 26 production-ready endpoints

### Quick Reference

```
Authentication
├─ POST /api/auth/signup
├─ POST /api/auth/login
├─ POST /api/auth/logout
└─ POST /api/auth/refresh

User Management
├─ GET /api/users/profile
├─ PATCH /api/users/profile
└─ POST /api/users/change-password

Accounts
├─ POST /api/accounts
├─ GET /api/accounts
├─ GET /api/accounts/balance/total
├─ GET /api/accounts/:id
├─ PATCH /api/accounts/:id
└─ DELETE /api/accounts/:id

Categories
├─ POST /api/categories/init-defaults
├─ GET /api/categories
├─ POST /api/categories
├─ GET /api/categories/:id
├─ PATCH /api/categories/:id
└─ DELETE /api/categories/:id

Transactions
├─ POST /api/transactions
├─ GET /api/transactions
├─ GET /api/transactions/:id
├─ PATCH /api/transactions/:id
├─ DELETE /api/transactions/:id
└─ GET /api/transactions/summary/overview
```

**[Full API Reference →](./API_REFERENCE.md)**

---

## 🧮 Calculator Feature

Users can enter math expressions instead of just numbers:

```
Input: "50 + 20 + 5"
Result: 75

Input: "(100 - 25) * 2"
Result: 150

Supports: +, -, *, /, (, ), decimals
```

---

## 💱 Multi-Currency Support

All transactions automatically convert to user's base currency:

**Supported:**
- USD (US Dollar)
- EUR (Euro)
- GBP (British Pound)
- JPY (Japanese Yen)
- AUD (Australian Dollar)
- INR (Indian Rupee)

---

## 🔐 Security Features

- ✅ JWT token authentication (1hr + 7day refresh)
- ✅ Argon2 password hashing
- ✅ httpOnly cookies (XSS protection)
- ✅ CORS protection
- ✅ Protected routes
- ✅ Input validation
- ✅ User data isolation
- ✅ Decimal128 for currency precision

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 | UI framework |
| **Build** | Vite 5 | Fast build tool |
| **Styling** | Tailwind CSS 3 | Utility-first CSS |
| **Backend** | Express.js 4 | REST API server |
| **Runtime** | Node.js 16+ | JavaScript runtime |
| **Database** | MongoDB 5+ | NoSQL database |
| **ODM** | Mongoose 8 | MongoDB Object Modeling |
| **Auth** | JWT | Token authentication |
| **Hashing** | Argon2 | Password hashing |
| **Charts** | Recharts | Data visualization |
| **Icons** | Lucide React | Icon library |

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [API_REFERENCE.md](./API_REFERENCE.md) | Complete API documentation |
| [PHASE1_GUIDE.md](./PHASE1_GUIDE.md) | Phase 1 setup & testing |
| [PHASE2_GUIDE.md](./PHASE2_GUIDE.md) | Phase 2 features |
| [PHASE2_SUMMARY.md](./PHASE2_SUMMARY.md) | Phase 2 overview |
| [PHASE3_PLAN.md](./PHASE3_PLAN.md) | Phase 3 roadmap |
| [FRONTEND_SETUP.md](./FRONTEND_SETUP.md) | Frontend development guide |
| [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md) | Verification checklist |

---

## 🧪 Testing

### Using Postman
1. Import collections from `api-collections/` folder
2. Set variables (token, accountId, categoryId)
3. Test endpoints following the documented order

### Using cURL
```bash
# Sign up
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","displayName":"Test","password":"Pass123"}'

# Initialize categories
curl -X POST http://localhost:5000/api/categories/init-defaults \
  -H "Authorization: Bearer TOKEN"

# Create transaction with calculator
curl -X POST http://localhost:5000/api/transactions \
  -H "Authorization: Bearer TOKEN" \
  -d '{"amountExpression":"50+20",...}'
```

---

## 📊 Development Progress

| Phase | Status | Features |
|-------|--------|----------|
| **Phase 1** | ✅ Complete | Auth, Accounts, User management |
| **Phase 2** | ✅ Complete | Transactions, Categories, Calculator, Multi-currency |
| **Phase 3** | ⏳ In Progress | Dashboards, Charts, Analytics |
| **Phase 4** | 🔄 Planned | Budgets, Recurring transactions |
| **Phase 5** | 🔄 Planned | Group splitting, Debt settlement |
| **Phase 6** | 🔄 Planned | Utilities, CSV import, Dark mode |

---

## 🎯 Next Steps

1. **Test Phase 2**: Import Postman collection and test all 26 endpoints
2. **Build Phase 3**: Implement dashboard and analytics UI
3. **Frontend Integration**: Connect React components to backend API
4. **Deploy**: Prepare for production deployment

---

## 🤝 Contributing

When adding new features:

1. Follow existing code patterns
2. Organize files in appropriate folders
3. Test thoroughly before committing
4. Update documentation
5. Use clear commit messages

---

## 📝 Commit Convention

```
feat: Add new feature
fix: Fix bug
docs: Update documentation
refactor: Refactor code
test: Add tests
chore: Maintenance tasks
```

Example: `feat: Add multi-currency transaction support`

---

## 🚀 Deployment

### Backend (Node.js)
- Deploy to: Heroku, Railway, Render, DigitalOcean
- Environment: Set production environment variables
- Database: Use MongoDB Atlas
- Secrets: Use environment variables

### Frontend (React)
- Deploy to: Vercel, Netlify, GitHub Pages
- Build: `npm run build`
- Output: `dist/` folder
- Environment: Configure API base URL

---

## 🐛 Troubleshooting

### Backend Issues

**MongoDB connection failed**
```bash
# Check MongoDB is running
mongod

# Or use MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/budget-tracker
```

**Port already in use**
```bash
# Change port in .env
PORT=5001
```

### Frontend Issues

**Blank page**
- Check browser console for errors
- Verify backend is running
- Check API base URL configuration

**CORS errors**
- Verify backend CORS configuration
- Check frontend is on localhost:5173
- Check authorization headers

---

## 📞 Support

For issues or questions:

1. Check the documentation files
2. Review API reference
3. Check error messages in console
4. Review existing code examples
5. Open an issue with details

---

## 📄 License

ISC License - Feel free to use this project!

---

## 🎉 Acknowledgments

Built as a comprehensive financial app demonstration with modern web technologies.

Inspired by apps like Wallet by BudgetBakers, YNAB, and Goodbudget.

---

## 📈 Project Stats

- **Backend Files:** 7+ files
- **Frontend Files:** 10+ files (in development)
- **API Endpoints:** 26 endpoints
- **Lines of Code:** 27,000+ lines
- **Documentation:** 25,000+ lines
- **Development Time:** Ongoing

---

**Status: Phase 2 Complete ✅ | Phase 3 In Progress ⏳**

**Last Updated:** May 2026

**Build with ❤️ using MERN Stack**

---

### Quick Links
- [API Reference](./API_REFERENCE.md)
- [Setup Guide](./SETUP_CHECKLIST.md)
- [Development Guide](./FRONTEND_SETUP.md)
- [Phase 3 Roadmap](./PHASE3_PLAN.md)
- [Postman Collections](./api-collections/)
