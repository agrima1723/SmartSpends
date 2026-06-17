# Phase 5: Social & Group Features - Implementation Guide

## What Was Implemented

**Phase 5 adds group expense splitting and debt tracking.** Users can now:
- Create/join groups with unique join codes
- Split expenses among members
- Automatically calculate who owes whom
- Mark debts as settled

## Architecture

### Database Schemas (3 new)
```
Group
├── name, description, createdBy
├── joinCode (unique 8-char hex)
├── members[] (user references)

GroupExpense
├── groupId, description, amount
├── paidBy (user who paid)
├── splitAmong[] (array of users who benefit)

Settlement
├── groupId, fromUser, toUser, amount
├── status (pending/settled)
├── createdAt
```

### Backend API (8 endpoints)
```
POST   /api/groups              → Create group
GET    /api/groups              → List my groups
POST   /api/groups/join         → Join by code
GET    /api/groups/:id          → Get group details
DELETE /api/groups/:id          → Delete group

POST   /api/groups/:groupId/expenses      → Add expense
GET    /api/groups/:groupId/expenses      → List expenses
GET    /api/groups/:groupId/settlements   → List debts
POST   /api/groups/settlement/:id/settle  → Mark settled
```

### Settlement Algorithm
When you add an expense with multiple people:
1. Calculate each person's share
2. Compare balances (who paid vs who benefited)
3. Auto-generate Settlement records with exact amounts owed
4. Example: If Alice pays $100 for 4 people, each owes $25

### Frontend Components
- **GroupsPage:** Main page with create/join/list
- **GroupDetails Modal:** Shows expenses & settlements for a group
- **Quick Actions:** Copy join code, add expense, settle debt

## Tech Stack
- **Backend:** Node.js + Express + MongoDB
- **Frontend:** React + Tailwind CSS
- **Authentication:** JWT tokens on all endpoints
- **Currency:** Decimal128 in MongoDB

## Known Limitations (Phase 5 MVP)
- No real-time notifications yet (Phase 6)
- No member removal after group created (can add later)
- Split types limited to equal + custom (percentage mode available in code)
- No export or settlement history export

## Next Steps for Phase 6
- Add Socket.io for real-time settlement notifications
- Add member management (leave group, remove user)
- CSV export of group settlement history
