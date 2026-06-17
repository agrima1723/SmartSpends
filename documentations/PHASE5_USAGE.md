# Phase 5: Usage & Quick Start

## How to Use the App

### 1. Create a Group
- Click **"Create Group"** button
- Enter group name & optional description
- Get a unique 8-character **join code** (auto-generated)
- Share code with friends

### 2. Join a Group
- Click **"Join Group"** button
- Paste the 8-character code
- You're added to the group instantly

### 3. Add an Expense
- Open group → **"View Details"**
- Fill in expense description & amount
- You're marked as "paidBy" automatically
- All group members split equally

Example:
```
Pizza delivery: $30 (for 3 people)
→ Each person owes $10
→ Settlement auto-created
```

### 4. Check Who Owes What
- In group details, scroll to **"Who Owes Who"**
- See all debts in real-time
- Click **"Settled"** when payment confirmed

Example Settlement View:
```
Alice owes Bob: $25 [pending]
Charlie owes Alice: $30 [pending]
Bob owes Charlie: $5 [pending]
```

### 5. Copy Join Code
- Click code button on group card (e.g., "A7F2B9C1")
- Automatically copied to clipboard
- Share via chat/email

## API Quick Reference

### Create Group
```bash
curl -X POST http://localhost:5001/api/groups \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Trip to Vegas", "description": "Road trip expenses"}'
```

### Add Expense
```bash
curl -X POST http://localhost:5001/api/groups/GROUP_ID/expenses \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"description": "Gas", "amount": 50}'
```

### Get Settlements
```bash
curl -X GET http://localhost:5001/api/groups/GROUP_ID/settlements \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Settle a Debt
```bash
curl -X POST http://localhost:5001/api/groups/settlement/SETTLEMENT_ID/settle \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## UI Walkthrough

**Sidebar:** New "Groups" menu item with 👥 icon  
**Groups Page:** Shows all your groups in cards  
**Group Card:** Has join code, member count, View Details button  
**Expense Form:** Description + Amount fields only (split is auto-equal)  
**Settlement Display:** Color-coded status (pending/settled)  

## Common Scenarios

### Scenario 1: Dinner with Friends
1. Alice creates group "Dinner"
2. Shares code with Bob & Charlie
3. Bob joins with code
4. Charlie joins with code
5. Alice pays $90 restaurant bill
6. System calculates: Bob owes $30, Charlie owes $30
7. Bob & Charlie settle with Alice

### Scenario 2: Road Trip
1. Alice creates "Vegas Trip"
2. Alice pays gas ($100) → 3-way split = $33.33 each
3. Bob pays hotel ($300) → 3-way split = $100 each
4. Charlie pays food ($60) → 3-way split = $20 each
5. Final settlement: Who owes whom after all payments

### Scenario 3: Check Who Paid What
- "Who Owes Who" tab shows complete debt map
- Click "Settled" to mark payment complete
- All debts must be settled to close group
