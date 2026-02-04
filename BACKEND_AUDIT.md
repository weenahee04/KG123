# 🔍 Backend Features Audit & Mock Data Replacement Plan

## 📊 Current Status: Mock Data Analysis

### ✅ **Backend Features Already Implemented:**

1. **Prisma Schema** (`backend/prisma/schema.prisma`)
   - ✅ SystemConfig model
   - ✅ GlobalStats model
   - ✅ LottoRisk model
   - ✅ User model (with referral system)
   - ✅ LotteryRound model
   - ✅ Ticket model
   - ✅ Bet model
   - ✅ Transaction model
   - ✅ Admin model

2. **Risk Engine** (`backend/src/utils/risk-engine.ts`)
   - ✅ validateAndCalculateRisk function
   - ✅ Dynamic limit calculation
   - ✅ Step-down payout tiers
   - ✅ Transaction safety with Prisma

3. **Server Actions** (`backend/src/actions/submitTicket.ts`)
   - ✅ submitTicket action
   - ✅ Risk validation integration
   - ✅ Balance deduction
   - ✅ Transaction logging

---

## ❌ **Pages Using Mock Data (Need Real API Integration):**

### **High Priority:**

1. **EnhancedAdminDashboard.tsx**
   - Mock: Live status cards (deposit/withdraw/profit/liability)
   - Mock: Action center items
   - Mock: System health status
   - **Need:** Real-time dashboard API

2. **EnhancedRiskManagement.tsx**
   - Mock: Risk numbers data
   - Mock: Heatmap data
   - Mock: Risk config
   - **Need:** Risk API with Prisma integration

3. **LotteryOperations.tsx**
   - Mock: Lottery rounds array
   - Mock: Result submission
   - Mock: Process results
   - **Need:** Lottery CRUD API

4. **DepositWithdrawal.tsx**
   - Mock: Transaction list
   - Mock: Approval/rejection
   - **Need:** Financial transaction API

5. **MemberManagement.tsx**
   - Mock: Member list
   - Mock: Member details
   - **Need:** User management API

6. **BetManagement.tsx**
   - Mock: Ticket/bet list
   - **Need:** Ticket query API

### **Medium Priority:**

7. **LotteryNumberGrid.tsx**
   - Mock: Number grid data
   - **Need:** Aggregate bet data by number

8. **ReportsAnalytics.tsx**
   - Mock: Report data
   - **Need:** Analytics API

9. **ResultAnnouncement.tsx**
   - Mock: Result history
   - **Need:** Result query API

10. **AgentManagement.tsx**
    - Mock: Agent list
    - **Need:** Affiliate tree API

11. **NotificationSystem.tsx**
    - Mock: Notifications
    - **Need:** Notification API

12. **RealTimeRisk.tsx**
    - Mock: Real-time risk data
    - **Need:** WebSocket or polling API

### **Low Priority (Utility/Simulator):**

13. **RiskSimulator.tsx** - Keep as simulator (educational)
14. **BotSimulator.tsx** - Keep as simulator (testing)
15. **RiskLogicSimulator.tsx** - Keep as simulator (testing)

---

## 🎯 **Required Backend APIs to Implement:**

### **1. Dashboard API** (`/api/dashboard/*`)
```typescript
GET  /api/dashboard/stats          // Live statistics
GET  /api/dashboard/actions        // Pending actions
GET  /api/dashboard/health         // System health
```

### **2. Risk Management API** (`/api/risk/*`)
```typescript
GET  /api/risk/numbers             // Get all risk numbers
GET  /api/risk/config              // Get risk config
PUT  /api/risk/config              // Update risk config
POST /api/risk/close               // Close number manually
POST /api/risk/open                // Open number manually
POST /api/risk/limit               // Set manual limit
```

### **3. Lottery Operations API** (`/api/lottery/*`)
```typescript
GET    /api/lottery/rounds                    // Get all rounds
POST   /api/lottery/rounds                    // Create round
POST   /api/lottery/rounds/yiki/generate      // Auto-gen Yiki
POST   /api/lottery/results                   // Submit result
GET    /api/lottery/results/fetch/:roundId    // Fetch from external API
POST   /api/lottery/results/process/:roundId  // Process & pay
POST   /api/lottery/rounds/:id/refund         // Refund round
POST   /api/lottery/results/:id/rollback      // Rollback result
DELETE /api/lottery/rounds/:id                // Delete round
```

### **4. Financial API** (`/api/financial/*`)
```typescript
GET  /api/financial/transactions              // Get transactions
POST /api/financial/transactions/:id/approve  // Approve
POST /api/financial/transactions/:id/reject   // Reject
POST /api/financial/verify-slip               // Verify slip image
```

### **5. Member API** (`/api/members/*`)
```typescript
GET  /api/members                      // Get all members
GET  /api/members/:id                  // Get member details
PUT  /api/members/:id                  // Update member
POST /api/members/:id/suspend          // Suspend member
POST /api/members/:id/unsuspend        // Unsuspend member
POST /api/members/:id/adjust-balance   // Adjust balance
```

### **6. Ticket/Bet API** (`/api/tickets/*`)
```typescript
GET  /api/tickets                 // Get tickets (with filters)
GET  /api/tickets/:id             // Get ticket details
POST /api/tickets/:id/cancel      // Cancel ticket
GET  /api/tickets/by-number       // Get bets by number
```

### **7. Reports API** (`/api/reports/*`)
```typescript
GET /api/reports/daily    // Daily report
GET /api/reports/monthly  // Monthly report
GET /api/reports/yearly   // Yearly report
```

### **8. System API** (`/api/system/*`)
```typescript
GET /api/system/config    // Get system config
PUT /api/system/config    // Update system config
```

### **9. Admin API** (`/api/admins/*`)
```typescript
GET    /api/admins        // Get all admins
POST   /api/admins        // Create admin
PUT    /api/admins/:id    // Update admin
DELETE /api/admins/:id    // Delete admin
```

---

## 📝 **Implementation Plan:**

### **Phase 1: Core Backend APIs (Week 1)**
- [ ] Create Next.js API routes structure
- [ ] Implement Dashboard API
- [ ] Implement Risk Management API
- [ ] Implement Lottery Operations API
- [ ] Test with Prisma Client

### **Phase 2: Financial & Member APIs (Week 2)**
- [ ] Implement Financial API
- [ ] Implement Member API
- [ ] Implement Ticket/Bet API
- [ ] Add authentication middleware
- [ ] Add role-based permissions

### **Phase 3: Frontend Integration (Week 3)**
- [ ] Replace mock data in EnhancedAdminDashboard
- [ ] Replace mock data in EnhancedRiskManagement
- [ ] Replace mock data in LotteryOperations
- [ ] Replace mock data in DepositWithdrawal
- [ ] Replace mock data in MemberManagement
- [ ] Replace mock data in BetManagement

### **Phase 4: Reports & System (Week 4)**
- [ ] Implement Reports API
- [ ] Implement System API
- [ ] Implement Admin API
- [ ] Replace remaining mock data
- [ ] Add error handling
- [ ] Add loading states

### **Phase 5: Testing & Optimization (Week 5)**
- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] Security audit
- [ ] Documentation
- [ ] Deployment preparation

---

## 🔧 **Technical Requirements:**

### **Backend Setup:**
1. Next.js 14 App Router
2. Prisma ORM with PostgreSQL
3. TypeScript
4. Authentication (JWT/Session)
5. Role-based access control
6. Error handling middleware
7. Logging system

### **Frontend Changes:**
1. Remove all mock data
2. Add API service layer (`src/services/api.ts`) ✅ DONE
3. Add loading states
4. Add error handling
5. Add retry logic
6. Add optimistic updates

### **Database:**
1. PostgreSQL instance
2. Run Prisma migrations
3. Seed initial data
4. Backup strategy

---

## 📦 **Dependencies Needed:**

### **Backend:**
```json
{
  "@prisma/client": "^5.x",
  "next": "^14.x",
  "bcrypt": "^5.x",
  "jsonwebtoken": "^9.x",
  "zod": "^3.x"
}
```

### **Frontend:**
```json
{
  "react-query": "^3.x" // For data fetching & caching
}
```

---

## 🚨 **Critical Notes:**

1. **NO MORE MOCK DATA** - All data must come from real backend APIs
2. **Transaction Safety** - Use Prisma transactions for critical operations
3. **Real-time Updates** - Consider WebSocket for live data
4. **Error Handling** - Proper error messages for users
5. **Loading States** - Show loading indicators during API calls
6. **Validation** - Validate all inputs on both frontend and backend
7. **Security** - Implement proper authentication and authorization
8. **Audit Logs** - Log all critical actions (who did what, when)

---

## ✅ **Completed:**
- [x] Created API service layer (`src/services/api.ts`)
- [x] Defined all TypeScript interfaces
- [x] Documented all required endpoints
- [x] Created environment variable template

## 🔄 **Next Steps:**
1. Implement Backend API routes (Next.js)
2. Connect Prisma to PostgreSQL
3. Replace mock data in frontend components
4. Add authentication system
5. Test all integrations

---

**Status:** Ready to implement real backend integration
**Priority:** HIGH - All mock data must be replaced
**Timeline:** 5 weeks for complete implementation
