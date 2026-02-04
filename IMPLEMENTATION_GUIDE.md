# 🚀 Implementation Guide - Real Backend Integration

## ⚠️ **Current Status:**

### ✅ **Completed:**
1. **API Service Layer** (`src/services/api.ts`)
   - All TypeScript interfaces defined
   - All API endpoints documented
   - Fetch wrapper with error handling

2. **Backend API Routes Started:**
   - Dashboard Stats API (`backend/src/app/api/dashboard/stats/route.ts`)
   - Dashboard Actions API (`backend/src/app/api/dashboard/actions/route.ts`)
   - Dashboard Health API (`backend/src/app/api/dashboard/health/route.ts`)

3. **Documentation:**
   - Backend Audit (`BACKEND_AUDIT.md`)
   - Environment template (`.env.example`)

### ⚠️ **Known Issues:**
- TypeScript errors: `Cannot find module 'next/server'` and `@prisma/client`
- **Reason:** Backend dependencies not installed yet
- **Solution:** Need to run `npm install` in backend folder

---

## 📋 **Step-by-Step Implementation:**

### **Step 1: Setup Backend Dependencies** ⚠️ REQUIRED FIRST

```bash
cd backend

# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Create .env file
cp .env.example .env
# Edit .env with your DATABASE_URL
```

### **Step 2: Setup Database**

```bash
# Run migrations
npx prisma migrate dev --name init

# Seed initial data (optional)
npx prisma db seed
```

### **Step 3: Start Backend Server**

```bash
# In backend folder
npm run dev

# Backend will run on http://localhost:3000
```

### **Step 4: Setup Frontend Environment**

```bash
# In root folder
cp .env.example .env.local

# Edit .env.local
VITE_API_BASE_URL=http://localhost:3000/api
```

### **Step 5: Start Frontend**

```bash
# In root folder
npm run dev

# Frontend will run on http://localhost:5173
```

---

## 🔧 **Remaining Backend APIs to Implement:**

### **Priority 1: Core Features**
- [ ] Risk Management API (`/api/risk/*`)
- [ ] Lottery Operations API (`/api/lottery/*`)
- [ ] Financial API (`/api/financial/*`)

### **Priority 2: User Management**
- [ ] Member API (`/api/members/*`)
- [ ] Ticket/Bet API (`/api/tickets/*`)

### **Priority 3: Reports & Admin**
- [ ] Reports API (`/api/reports/*`)
- [ ] System API (`/api/system/*`)
- [ ] Admin API (`/api/admins/*`)

---

## 📝 **Frontend Components to Update:**

### **Replace Mock Data:**

1. **EnhancedAdminDashboard.tsx**
   ```typescript
   // Replace mock data with:
   import api from '@/services/api';
   
   useEffect(() => {
     const fetchData = async () => {
       const stats = await api.dashboard.getStats();
       const actions = await api.dashboard.getActionItems();
       const health = await api.dashboard.getSystemHealth();
       // Update state
     };
     fetchData();
   }, []);
   ```

2. **EnhancedRiskManagement.tsx**
   ```typescript
   import api from '@/services/api';
   
   const numbers = await api.risk.getNumbers();
   const config = await api.risk.getConfig();
   ```

3. **LotteryOperations.tsx**
   ```typescript
   import api from '@/services/api';
   
   const rounds = await api.lottery.getRounds();
   ```

---

## 🔐 **Authentication Setup (TODO):**

### **Add JWT Authentication:**

```typescript
// backend/src/middleware/auth.ts
export async function authenticate(request: NextRequest) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) throw new Error('Unauthorized');
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET!);
  return decoded;
}
```

### **Add Role-Based Access:**

```typescript
// backend/src/middleware/rbac.ts
export function requireRole(roles: string[]) {
  return async (request: NextRequest) => {
    const user = await authenticate(request);
    if (!roles.includes(user.role)) {
      throw new Error('Forbidden');
    }
    return user;
  };
}
```

---

## 🧪 **Testing Checklist:**

### **Backend API Testing:**
- [ ] Test Dashboard Stats endpoint
- [ ] Test Dashboard Actions endpoint
- [ ] Test Dashboard Health endpoint
- [ ] Test Risk Management endpoints
- [ ] Test Lottery Operations endpoints
- [ ] Test Financial endpoints
- [ ] Test Member endpoints
- [ ] Test Ticket endpoints

### **Frontend Integration Testing:**
- [ ] Dashboard loads real data
- [ ] Risk Management loads real data
- [ ] Lottery Operations loads real data
- [ ] Deposit/Withdrawal loads real data
- [ ] Member Management loads real data
- [ ] Error handling works
- [ ] Loading states work

---

## 🚨 **Critical Notes:**

1. **NO MOCK DATA** - All components must use real API calls
2. **Error Handling** - Add try-catch blocks everywhere
3. **Loading States** - Show loading indicators during API calls
4. **TypeScript** - Fix all type errors before deployment
5. **Security** - Add authentication to all API routes
6. **Validation** - Validate all inputs on both frontend and backend
7. **Transactions** - Use Prisma transactions for critical operations
8. **Audit Logs** - Log all admin actions

---

## 📦 **Required Environment Variables:**

### **Backend `.env`:**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/lottery_db"
JWT_SECRET="your-secret-key-here"
BANKING_API_URL="https://api.banking.com"
LOTTO_API_URL="https://api.lotto.com"
```

### **Frontend `.env.local`:**
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

---

## 🎯 **Next Actions:**

1. **Install backend dependencies** (CRITICAL)
2. **Setup PostgreSQL database**
3. **Run Prisma migrations**
4. **Implement remaining API routes**
5. **Replace mock data in all frontend components**
6. **Add authentication system**
7. **Test all integrations**
8. **Deploy to production**

---

**Status:** Backend API structure created, waiting for dependencies installation
**Blocker:** Need to run `npm install` in backend folder to resolve TypeScript errors
**Timeline:** 2-3 weeks for complete implementation
