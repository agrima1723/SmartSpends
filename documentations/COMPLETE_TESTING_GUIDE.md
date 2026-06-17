# Complete Testing & Deployment Guide

## Quick Start (5 minutes)

### 1. Install Dependencies
```bash
# Terminal 1: Backend
cd backend
npm install

# Terminal 2: Frontend  
cd frontend
npm install
```

### 2. Start Servers
```bash
# Terminal 1: Backend (port 5001)
cd backend
npm run dev

# Terminal 2: Frontend (port 5173)
cd frontend
npm run dev
```

### 3. Open Browser
```
http://localhost:5173
```

---

## Testing Workflow

### User Flow Testing

**Step 1: Authentication**
```
1. Go to http://localhost:5173
2. Click "Sign up" if first time
3. Create account with:
   - Email: test@example.com
   - Password: Test@123
   - Display Name: Test User
4. Select base currency (USD/INR/EUR)
5. Login with credentials
```

**Expected:** Dashboard loads with 0 accounts/transactions

---

**Step 2: Create Account**
```
1. On Dashboard, click "New Account" (or Accounts menu if added)
2. Fill:
   - Account Name: My Savings
   - Type: Bank
   - Initial Balance: 5000
3. Click Create
4. Verify account appears on Dashboard
5. Verify balance shows 5000
```

**Expected:** Account visible, balance correct

---

**Step 3: Add Transaction**
```
1. Go to Transactions page
2. Click "New Transaction"
3. Fill:
   - Account: My Savings
   - Type: Expense
   - Amount: 150
   - Category: Food
   - Description: Lunch
   - Date: Today
4. Click Create
5. Verify transaction appears in list
6. Verify account balance decreased to 4850
```

**Expected:** Transaction appears, balance updates

---

**Step 4: Analytics Dashboard**
```
1. Go to Analytics page
2. Verify you see:
   - Spending by Category (pie chart)
   - 7-day Balance Trend (area chart)
   - Income vs Expenses (bar chart)
3. Add more transactions (income/expenses)
4. Verify charts update
```

**Expected:** Charts render with your data

---

**Step 5: Budgets (Phase 4)**
```
1. Go to Budgets page
2. Click "Add Budget"
3. Fill:
   - Category: Food
   - Limit: 500
   - Period: Monthly
   - Alert: 75%
4. Click Create
5. Verify budget card appears
6. Progress bar should show your spending vs limit
```

**Expected:** Budget created, progress visible

---

**Step 6: Recurring (Phase 4)**
```
1. Go to Recurring page
2. Click "New Transaction"
3. Fill:
   - Type: Expense
   - Amount: 50
   - Description: Netflix
   - Frequency: Monthly
   - Start Date: Today
4. Click Create
5. Verify appears in "Recurring" list
6. Verify appears in "Upcoming" section
```

**Expected:** Recurring transaction created, shows in upcoming

---

**Step 7: Goals (Phase 4) - FIXED**
```
1. Go to Goals page
2. Click "New Goal"
3. Fill:
   - Name: Buy Laptop
   - Target: 2000
   - Deadline: 6 months from now
   - Priority: High
   - Category: Personal
4. Click Create
5. Verify goal card appears
6. Click "Add Savings" → Enter 500
7. Verify progress bar updates to 25%
8. Click Edit → Change target to 3000
9. Verify button shows "Update Goal"
10. Verify progress recalculates
```

**Expected:** Goal created, edited, savings tracked, progress calculated

---

**Step 8: Groups (Phase 5)**
```
1. Go to Groups page
2. Click "Create Group"
3. Fill:
   - Name: Trip with Friends
   - Description: Vegas trip expenses
4. Click Create
5. Copy join code (should be 8 chars)
6. Click "View Details"
7. Fill "Add Expense":
   - Description: Gas
   - Amount: 100
8. Click Add Expense
9. Scroll to "Who Owes Who" - should show settlements
10. Click "Settled" to mark paid
```

**Expected:** Group created, expense added, debts calculated

---

**Step 9: Loyalty Cards (Phase 6)**
```
1. Go to Loyalty Cards page
2. Click "Add Card"
3. Fill:
   - Brand: Starbucks
   - Card Number: 1234567890
   - Category: Retail
   - Points: 250
4. Click Add
5. Verify card appears in gradient card UI
6. Card number should show masked (****7890)
7. Click Edit → Change points to 300
8. Verify button shows "Update"
```

**Expected:** Card created, masked, edited

---

**Step 10: Warranty (Phase 6)**
```
1. Go to Warranty Tracker page
2. Click "Add Warranty"
3. Fill:
   - Product: Laptop
   - Purchase Date: 3 months ago
   - Duration: 2
   - Unit: Years
   - Vendor: Dell
4. Click Add
5. Verify warranty appears
6. Verify "Days Left" shows ~21 months
7. If expiring in 30 days, "Expiring Soon" alert appears
```

**Expected:** Warranty created, expiry calculated, alerts shown

---

**Step 11: CSV Import (Phase 6)**
```
1. Go to CSV Import page
2. Click "Download Template"
3. File downloads (budget-tracker-template.csv)
4. Open in Excel/Google Sheets
5. Add 3 transactions:
   - 2024-01-15,Grocery,Food,50.00,expense
   - 2024-01-16,Salary,Income,2000.00,income
   - 2024-01-17,Gas,Transport,30.00,expense
6. Copy all rows back to import page
7. Select "My Savings" account
8. Click "Import CSV"
9. Verify "3 successful, 0 failed"
10. Go to Transactions → verify 3 new transactions appear
```

**Expected:** CSV imported, transactions created

---

## Edge Case Testing

### Test Dark Mode
```
1. Open browser DevTools (F12)
2. Find <html> tag
3. Add dark class: <html class="dark">
4. Refresh page
5. Verify all pages readable in dark mode
6. Verify all form inputs visible
7. Verify all buttons clickable
```

### Test Mobile Responsiveness
```
1. Open DevTools (F12)
2. Click device toggle (375px, 768px, 1024px)
3. Verify:
   - Sidebar collapses or reorganizes
   - Charts responsive
   - Forms stack vertically
   - Buttons still clickable
```

### Test Error Handling
```
1. Go to Transactions
2. Create transaction with:
   - Amount: -100 (negative)
   - Expected: Error message
   
3. Try with Amount: 0
   - Expected: Error or validation message
   
4. Create with empty fields
   - Expected: Form validation errors
```

### Test Session Persistence
```
1. Login and create a transaction
2. Close browser completely (not just tab)
3. Reopen and go to localhost:5173
4. Should redirect to login (not auto-login)
5. Login again
6. Transaction should still exist
```

---

## API Testing (curl/Postman)

### Test Goal Endpoints
```bash
# Get all goals
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5001/api/goals

# Get goals summary (FIXED - should work now)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5001/api/goals/summary

# Create goal
curl -X POST http://localhost:5001/api/goals \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "targetAmount": 2000,
    "deadline": "2024-12-31"
  }'

# Edit goal (FIXED - should work now)
curl -X PATCH http://localhost:5001/api/goals/GOAL_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "New Laptop", "targetAmount": 3000}'
```

### Test Group Join (FIXED)
```bash
# This endpoint should now work (was caught by /:id before)
curl -X POST http://localhost:5001/api/groups/join \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"joinCode": "ABC12345"}'
```

---

## Common Issues & Fixes

### Issue: "Cannot find package 'express'"
**Solution:**
```bash
cd backend
npm install
```

### Issue: "Toggle2 is not defined"
**Status:** ✅ FIXED - Changed to ToggleLeft

### Issue: Goals page shows errors
**Status:** ✅ FIXED - Route ordering corrected

### Issue: Cannot join group with code
**Status:** ✅ FIXED - Route ordering corrected

### Issue: Warranty expiring endpoint 404
**Status:** ✅ FIXED - Route ordering corrected

### Issue: Chart not rendering
**Solution:** Verify Recharts installed:
```bash
cd frontend
npm install recharts
```

### Issue: Dark mode not working
**Solution:** Check if tailwind.config.js has:
```js
theme: {
  extend: {
    darkMode: 'class'
  }
}
```

---

## Performance Checklist

- [ ] Dashboard loads in < 2 seconds
- [ ] Transactions list loads in < 1 second
- [ ] Charts render smooth without lag
- [ ] Form submissions complete in < 1 second
- [ ] Page navigation feels instant
- [ ] No console errors (check F12)
- [ ] No network tab 500 errors

---

## Final Verification

- [x] All 80+ endpoints created
- [x] All 12 database schemas defined
- [x] All 12 frontend pages functional
- [x] Dark mode working
- [x] Responsive design verified
- [x] Route ordering fixed
- [x] Edit functionality added (Goals, Recurring)
- [x] Bug fixes documented

---

## Deployment Checklist

Before deploying to production:

1. **Backend:**
   - [ ] Set NODE_ENV=production
   - [ ] Update MONGODB_URI to production database
   - [ ] Configure CORS for production domain
   - [ ] Set JWT_SECRET to strong value
   - [ ] Enable HTTPS

2. **Frontend:**
   - [ ] Update API_BASE_URL to production backend
   - [ ] Build: `npm run build`
   - [ ] Test build output
   - [ ] Deploy to hosting (Vercel, Netlify, etc.)

3. **Database:**
   - [ ] Backup production data
   - [ ] Run migrations if any
   - [ ] Verify indexes created

4. **Security:**
   - [ ] Remove debug logs
   - [ ] Enable rate limiting
   - [ ] Set Content Security Policy headers
   - [ ] Enable CSRF protection

---

## Support

All bugs identified have been fixed. If you encounter new issues:

1. Check console (F12) for JavaScript errors
2. Check Network tab for API errors
3. Check server logs (terminal running `npm run dev`)
4. Verify you're logged in (check token in localStorage)
5. Try clearing browser cache (Ctrl+Shift+Delete)
