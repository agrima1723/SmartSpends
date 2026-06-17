# ⚡ Budget Tracker - Quick Start Guide

**Estimated Reading Time:** 5 minutes  
**Status:** Phase 2 Complete | Phase 3 Ready

---

## 🚀 Get Backend Running (2 minutes)

```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env

# 4. Edit .env with your MongoDB connection
# MONGODB_URI=mongodb://localhost:27017/budget-tracker
# JWT_SECRET=your-secret-key-here

# 5. Start server
npm run dev

# ✅ Server running on http://localhost:5000
```

---

## 🎨 Get Frontend Running (2 minutes)

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev

# ✅ App running on http://localhost:5173
```

---

## 📋 Test Backend Immediately

### Option 1: Postman (Recommended)
```
1. Open Postman
2. Import: backend/Budget_Tracker_API_Phase2.postman_collection.json
3. Click "Sign up" request
4. Hit Send
5. Copy token from response
6. Set as Postman variable
7. Test other endpoints
```

### Option 2: cURL
```bash
# Sign up
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "displayName":"Test User",
    "password":"Password123",
    "baseCurrency":"USD"
  }'

# Get token from response, then:
TOKEN="your-token-here"

# Get profile
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🎯 What's Already Built

### Backend ✅ (26 Endpoints)
- [x] Authentication (signup, login, logout, refresh)
- [x] User management (profile, password)
- [x] Account management (CRUD)
- [x] Category management (CRUD + defaults)
- [x] Transaction system (CRUD + filters)
- [x] Calculator input (50 + 20 = 70)
- [x] Multi-currency support
- [x] Analytics aggregation

### Frontend 🔄 (In Progress)
- [ ] Layout & Navigation
- [ ] Authentication pages
- [ ] Dashboard with charts
- [ ] Transaction management
- [ ] Analytics visualization

---

## 📚 Documentation

| Document | Purpose | Time |
|----------|---------|------|
| [README_MASTER.md](./README_MASTER.md) | Main overview | 10 min |
| [API_REFERENCE.md](./API_REFERENCE.md) | Complete API docs | 15 min |
| [PHASE3_NEXT_STEPS.md](./PHASE3_NEXT_STEPS.md) | How to build Phase 3 | 20 min |
| [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md) | Verify setup | 5 min |
| [PROJECT_STATUS.md](./PROJECT_STATUS.md) | Full project status | 30 min |

---

## 🧪 Quick Test Sequence

### 1. Sign Up User
```bash
POST /api/auth/signup
{
  "email": "john@example.com",
  "displayName": "John Doe",
  "password": "SecurePass123",
  "baseCurrency": "USD"
}
```

### 2. Initialize Categories
```bash
POST /api/categories/init-defaults
Authorization: Bearer TOKEN
```

### 3. Create Account
```bash
POST /api/accounts
{
  "accountName": "My Bank",
  "accountType": "Bank",
  "icon": "CreditCard",
  "color": "#3B82F6",
  "initialBalance": 5000,
  "currency": "USD"
}
```

### 4. Create Transaction with Calculator
```bash
POST /api/transactions
{
  "accountId": "ACCOUNT_ID",
  "categoryId": "CATEGORY_ID",
  "type": "expense",
  "amountExpression": "50 + 20 + 5.50",
  "currency": "USD",
  "description": "Lunch",
  "date": "2026-05-15"
}
```

### 5. Get Analytics
```bash
GET /api/transactions/summary/overview?startDate=2026-05-01&endDate=2026-05-31
```

---

## 💻 Project Structure

```
budget-tracker/
├── backend/              ← Backend API (production ready)
│   ├── server.js        ← Express server
│   ├── models.js        ← Database schemas
│   └── *-routes.js      ← API endpoints
│
├── frontend/            ← React app (ready to build)
│   └── src/             ← Source code (start here in Phase 3)
│
└── docs/                ← All documentation
```

---

## 🔑 Important Files to Know

### Backend
- `backend/server.js` - Main server entry point
- `backend/models.js` - Database schemas (modify here for DB changes)
- `backend/transaction-routes.js` - Transaction endpoints
- `backend/calculator-util.js` - Calculator logic
- `backend/currency-util.js` - Currency conversion

### Frontend (Phase 3)
- `frontend/src/components/` - Reusable components
- `frontend/src/pages/` - Page components
- `frontend/src/context/` - State management
- `frontend/src/api/` - API client

---

## 🎓 Key Features to Test

### Calculator Input
```javascript
// The API accepts expressions instead of just numbers:
"50 + 20"           → 70
"100 - 25"          → 75
"10 * 5"            → 50
"(50 + 50) * 2"     → 200
```

### Multi-Currency
```javascript
// Supports 6 currencies:
- USD (US Dollar)
- EUR (Euro)
- GBP (British Pound)
- JPY (Japanese Yen)
- AUD (Australian Dollar)
- INR (Indian Rupee)

// Auto-converts to user's base currency
```

### Advanced Filtering
```javascript
// Get transactions with multiple filters:
GET /api/transactions?
  type=expense&
  categoryId=CATEGORY_ID&
  startDate=2026-05-01&
  endDate=2026-05-31&
  search=coffee&
  page=1&
  limit=20
```

---

## 🆘 Common Issues & Quick Fixes

| Issue | Solution |
|-------|----------|
| **Backend won't start** | Check MongoDB is running & connection string in .env |
| **Frontend shows blank page** | Check browser console for errors, verify API base URL |
| **401 Unauthorized errors** | Check token in Authorization header, refresh if expired |
| **CORS errors** | Backend CORS configured for localhost:5173 |
| **Calculator returning null** | Verify expression syntax (only +, -, *, /, (), decimals) |
| **Port already in use** | Change PORT in .env or stop other processes |

---

## 📞 Where to Find What

### I want to...

**Add a new API endpoint**
→ Check `backend/transaction-routes.js` for pattern, add to appropriate file

**Understand the database schema**
→ Read `backend/models.js`

**See all available endpoints**
→ Check [API_REFERENCE.md](./API_REFERENCE.md)

**Start building Phase 3 frontend**
→ Read [PHASE3_NEXT_STEPS.md](./PHASE3_NEXT_STEPS.md)

**Test backend thoroughly**
→ Import Postman collection from `backend/` folder

**Verify my setup**
→ Follow [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)

**Understand project status**
→ Read [PROJECT_STATUS.md](./PROJECT_STATUS.md)

---

## ✅ Verification Checklist

After setup, verify everything works:

```bash
# 1. Backend running?
curl http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json"
# Should return error or work

# 2. MongoDB connected?
# Check server output for connection message

# 3. Frontend running?
# Open http://localhost:5173 in browser
# Should load without errors

# 4. Postman collection working?
# Import collection and test signup endpoint
```

---

## 🚀 Next Steps

### For Backend Developers
1. ✅ Backend is complete
2. ✅ All 26 endpoints working
3. ✅ Ready for frontend integration
4. → Frontend team can start building UI

### For Frontend Developers
1. Read [PHASE3_NEXT_STEPS.md](./PHASE3_NEXT_STEPS.md)
2. Create folder structure (components/, pages/, etc)
3. Build Layout components (Navbar, Sidebar)
4. Build Auth pages (Login, Signup)
5. Connect to backend API endpoints

### For Full Stack Developers
1. Verify backend works with Postman
2. Start building React components
3. Connect frontend to backend API
4. Test full flow: signup → login → create transaction → view analytics

---

## 📊 Status Dashboard

```
🟢 Backend:      READY (26 endpoints tested)
🟢 Database:     READY (MongoDB with indexes)
🟡 Frontend:     SETUP COMPLETE (ready to build)
🟡 Docs:         COMPREHENSIVE (60K+ lines)
🟢 Tests:        POSTMAN COLLECTIONS READY
🟡 Phase 3:      ROADMAP COMPLETE (4-week plan)
```

---

## 💡 Pro Tips

1. **Use Postman** for API testing (easier than cURL)
2. **Check MongoDB Compass** to see data in database
3. **Read error messages** - they usually explain the issue
4. **Test incrementally** - verify each endpoint works before moving on
5. **Use mock data** in frontend before connecting to API
6. **Keep localStorage for token** in frontend
7. **Refresh token** when JWT expires (1 hour default)

---

## 🎯 Phase Overview

| Phase | Status | Endpoints | Time |
|-------|--------|-----------|------|
| Phase 1 | ✅ Done | 13 | Done |
| Phase 2 | ✅ Done | 13 | Done |
| Phase 3 | ⏳ Start | 0 | 4 weeks |
| Phase 4 | 🔄 Plan | TBD | Future |
| Phase 5 | 🔄 Plan | TBD | Future |
| Phase 6 | 🔄 Plan | TBD | Future |

---

## 📖 Essential Links

- **Main README:** [README_MASTER.md](./README_MASTER.md)
- **API Docs:** [API_REFERENCE.md](./API_REFERENCE.md)
- **Backend Code:** `backend/` folder
- **Frontend Code:** `frontend/src/` folder
- **Tests:** Postman collections in `backend/` folder

---

## ⏱️ Time Estimates

| Task | Time | Status |
|------|------|--------|
| Backend setup | 2 min | ✅ |
| Frontend setup | 2 min | ✅ |
| Test backend | 5 min | ✅ |
| Read documentation | 30 min | 📖 |
| Build Phase 3 | 4 weeks | ⏳ |

---

**Ready to start? Follow the setup above and test your first endpoint! 🚀**

Questions? Check the [documentation files](.) or refer to [API_REFERENCE.md](./API_REFERENCE.md).

---

*Last Updated: May 2026*
*Status: Phase 2 Complete ✅ | Phase 3 Ready ⏳*
