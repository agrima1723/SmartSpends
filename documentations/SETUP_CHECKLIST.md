# 🎯 Budget Tracker Setup Checklist

## Pre-Flight Checklist (Do This First)

### System Requirements
- [ ] Node.js v16+ installed (`node --version`)
- [ ] npm v8+ installed (`npm --version`)
- [ ] MongoDB installed locally OR MongoDB Atlas account created
- [ ] Text editor (VS Code recommended)
- [ ] Postman or Thunder Client for API testing

### Project Directory
- [ ] Navigate to: `c:\Users\HP\Downloads\budget-tracker`
- [ ] All 21 files present (run `dir` to verify)
- [ ] Git initialized (optional): `git init`

---

## Step 1: Environment Setup (5 min)

- [ ] Copy `.env.example` to `.env`
  ```bash
  copy .env.example .env
  ```

- [ ] Edit `.env` with your values:
  ```
  PORT=5000
  MONGODB_URI=mongodb://localhost:27017/budget-tracker
  JWT_SECRET=your_secret_key_here
  JWT_REFRESH_SECRET=your_refresh_secret_here
  NODE_ENV=development
  ```

- [ ] Generate secure secrets (optional but recommended):
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

---

## Step 2: Database Setup (5 min)

### Option A: Local MongoDB
- [ ] Install MongoDB Community Edition
- [ ] Start MongoDB service:
  ```bash
  mongod
  # Watch for: "waiting for connections on port 27017"
  ```

### Option B: MongoDB Atlas (Cloud)
- [ ] Create free account: https://www.mongodb.com/cloud/atlas
- [ ] Create cluster
- [ ] Get connection string
- [ ] Update `MONGODB_URI` in `.env`

---

## Step 3: Backend Installation (5 min)

- [ ] Install dependencies:
  ```bash
  npm install
  ```
  
  Watch for:
  - ✓ All packages installed (no errors)
  - ✓ `node_modules` folder created

- [ ] Verify installation:
  ```bash
  npm list express mongoose jsonwebtoken argon2
  ```

---

## Step 4: Start Backend Server (2 min)

- [ ] Start development server:
  ```bash
  npm run dev
  ```

- [ ] Verify startup:
  - ✓ "MongoDB connected" message
  - ✓ "🚀 Server running on http://localhost:5000"
  - ✓ No error messages

---

## Step 5: Health Check (2 min)

### Option A: Using Browser
- [ ] Open: http://localhost:5000/health
- [ ] Should see: `{"status":"Server is running"}`

### Option B: Using cURL (Windows)
- [ ] Open Command Prompt (not PowerShell)
- [ ] Run:
  ```bash
  curl http://localhost:5000/health
  ```

### Option C: Using curl (PowerShell)
- [ ] In PowerShell:
  ```powershell
  Invoke-WebRequest -Uri "http://localhost:5000/health" | Select-Object -ExpandProperty Content
  ```

---

## Step 6: Test API Endpoints (10 min)

### Using Postman (Recommended)
- [ ] Download Postman: https://www.postman.com/downloads/
- [ ] Import collection: `Budget_Tracker_API_Phase1.postman_collection.json`
  - Click: Import → Select file → Upload
- [ ] Run tests in order:
  1. [ ] Sign Up
  2. [ ] Login (copy token)
  3. [ ] Get Profile
  4. [ ] Create Account
  5. [ ] Get All Accounts

### Using cURL (Alternative)

**Sign Up:**
```bash
curl -X POST http://localhost:5000/api/auth/signup ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"displayName\":\"John\",\"password\":\"SecurePass123\"}"
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"SecurePass123\"}"
```

**Get Profile (replace TOKEN):**
```bash
curl http://localhost:5000/api/users/profile ^
  -H "Authorization: Bearer TOKEN"
```

---

## Step 7: Frontend Setup (Optional - Phase 2)

Later, when ready for frontend:

- [ ] Create `client` directory:
  ```bash
  mkdir client
  cd client
  ```

- [ ] Copy package.json from project info
- [ ] Install dependencies:
  ```bash
  npm install
  ```

- [ ] Start frontend:
  ```bash
  npm run dev
  # Visit http://localhost:5173
  ```

---

## Verification Checklist

### Backend Running?
- [ ] Server started without errors
- [ ] Health check returns status
- [ ] Can reach http://localhost:5000

### Database Connected?
- [ ] See "✓ MongoDB connected" in console
- [ ] Can create users
- [ ] Can create accounts

### Authentication Working?
- [ ] Sign up creates new user
- [ ] Login returns JWT token
- [ ] Protected endpoints reject without token
- [ ] Protected endpoints work with token

### All 12 Endpoints Working?
- [ ] ✓ POST /api/auth/signup
- [ ] ✓ POST /api/auth/login
- [ ] ✓ POST /api/auth/logout
- [ ] ✓ POST /api/auth/refresh
- [ ] ✓ GET /api/users/profile
- [ ] ✓ PATCH /api/users/profile
- [ ] ✓ POST /api/users/change-password
- [ ] ✓ POST /api/accounts
- [ ] ✓ GET /api/accounts
- [ ] ✓ GET /api/accounts/balance/total
- [ ] ✓ GET /api/accounts/:id
- [ ] ✓ PATCH /api/accounts/:id
- [ ] ✓ DELETE /api/accounts/:id

---

## Troubleshooting

### Problem: "Cannot find module 'express'"
- [ ] Run: `npm install`
- [ ] Check: `node_modules` folder exists

### Problem: "MongoDB connection failed"
- [ ] Option A: Start mongod (`mongod`)
- [ ] Option B: Check MONGODB_URI in .env
- [ ] Option C: Use MongoDB Atlas connection string

### Problem: "CORS error" (later, for frontend)
- [ ] Frontend must be on localhost:5173
- [ ] Backend must allow that origin (already configured)

### Problem: "Port 5000 already in use"
- [ ] Change PORT in .env
- [ ] Or kill process: 
  ```bash
  netstat -ano | findstr :5000    # Find PID
  taskkill /PID <PID> /F          # Kill process
  ```

### Problem: "Invalid token"
- [ ] Check JWT_SECRET in .env
- [ ] Make sure token is copied correctly from login response

---

## Success Indicators

You'll know it's working when:

1. ✅ Backend starts without errors
2. ✅ Health check returns JSON
3. ✅ Can sign up a user
4. ✅ Can login and get token
5. ✅ Can access profile with token
6. ✅ Can create and list accounts
7. ✅ All API endpoints respond correctly
8. ✅ Protected routes reject without token

---

## Next Steps After Verification

- [ ] Read: IMPLEMENTATION_SUMMARY.md
- [ ] Review: All 12 API endpoints in Postman
- [ ] Plan: Phase 2 - Transaction Engine
- [ ] Create: React UI components
- [ ] Build: Frontend dashboard

---

## Files to Reference

| File | When to Read |
|------|-------------|
| PHASE1_GUIDE.md | Step-by-step setup help |
| README.md | Project overview |
| IMPLEMENTATION_SUMMARY.md | What was built |
| INDEX.md | Quick API reference |
| STATUS.txt | Visual summary |

---

## Keep These Terminals Open

During development, keep multiple terminals:

```
Terminal 1: npm run dev           (backend)
Terminal 2: (ready for frontend)
Terminal 3: (ready for testing)
```

---

## Common Commands

```bash
# Start backend
npm run dev

# Start frontend (later)
cd client && npm run dev

# Check health
curl http://localhost:5000/health

# See running processes
netstat -ano | findstr :5000

# Stop server
CTRL + C

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -r node_modules
npm install
```

---

## Time Estimates

- Setup (steps 1-5): ~20 minutes
- Testing (step 6): ~10 minutes
- Total: ~30 minutes to fully functional

---

**You're all set! 🚀**

Once this checklist is complete, your Phase 1 backend is ready for testing.

Next: Build the React frontend and Phase 2 features!

Questions? Check PHASE1_GUIDE.md for more details.

---

✅ **Goal: Check all boxes above = Working Budget Tracker Phase 1**
