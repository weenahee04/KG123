# 🎰 บ้านหวย - Lottery Management System

ระบบจัดการหวยออนไลน์แบบครบวงจร พร้อม Dynamic Risk Engine และระบบบริหารจัดการที่ทันสมัย

## 🚀 Features

### Frontend (React + TypeScript + Vite)
- ✅ **Enhanced Admin Dashboard** - ภาพรวมระบบแบบเรียลไทม์
- ✅ **Enhanced Risk Management** - ระบบคุมความเสี่ยงอัตโนมัติ + Manual Control
- ✅ **Lottery Operations** - จัดการงวด, กรอกผล, คืนเงิน/Rollback
- ✅ **Sidebar Layout** - เมนูแนวตั้งด้านซ้าย (Responsive)
- ✅ **Lottery Number Grid** - ตารางแสดงเลขที่ลูกค้าซื้อ
- ✅ **Member Management** - จัดการสมาชิก
- ✅ **Deposit/Withdrawal** - ระบบฝาก-ถอน
- ✅ **Reports & Analytics** - รายงานและสถิติ

### Backend (Next.js + Prisma + PostgreSQL)
- ✅ **Dynamic Risk Engine** - คำนวณ Limit และ Payout อัตโนมัติ
- ✅ **Prisma ORM** - จัดการ Database
- ✅ **Transaction Safety** - ป้องกัน Race Condition
- ✅ **Affiliate System** - ระบบค่าคอมอัตโนมัติ
- ✅ **Server Actions** - Submit Ticket, Cancel Ticket

## 📦 Tech Stack

**Frontend:**
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide Icons

**Backend:**
- Next.js 14 (App Router)
- Prisma ORM
- PostgreSQL
- TypeScript

## 🛠️ Installation

### Frontend

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Backend

```bash
cd backend

# Install dependencies
npm install

# Setup database
cp .env.example .env
# Edit .env with your DATABASE_URL

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Run development server
npm run dev
```

## 📝 Environment Variables

### Backend `.env`

```env
DATABASE_URL="postgresql://user:password@localhost:5432/lottery_db"
```

## 🎮 Usage

### Login Credentials

**Admin:**
- Username: `admin`
- Password: `admin`

### Key Features

**1. Dashboard**
- Live Status Cards (ฝาก/ถอน/กำไร/ยอดค้าง)
- Action Center (งานด่วน)
- System Health (Banking/Lotto API)

**2. Risk Management**
- Manual Control (ปิดรับ/อั้นจ่าย)
- Heatmap Grid (10x10)
- Risk Config (ตั้งค่าสูตร)
- Auto Step-Down Payout

**3. Lottery Operations**
- สร้างงวดใหม่
- Gen ยี่กี 88 รอบอัตโนมัติ
- กรอกผล + ตัดเกรด
- คืนเงิน & Rollback

## 📊 Database Schema

Key Models:
- `SystemConfig` - ตั้งค่าระบบ (Singleton)
- `GlobalStats` - สถิติรวม (Singleton)
- `LottoRisk` - ติดตามความเสี่ยงแต่ละเลข
- `LotteryRound` - งวดหวย
- `User` - ผู้ใช้งาน (พร้อม Referral System)
- `Ticket` - โพยแทง
- `Bet` - รายการแทงแต่ละเลข
- `Transaction` - ธุรกรรมการเงิน

## 🔧 Development

```bash
# Frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Backend
cd backend
npm run dev          # Start Next.js dev server
npm run db:generate  # Generate Prisma Client
npm run db:migrate   # Run migrations
npm run db:studio    # Open Prisma Studio
```

## 📁 Project Structure

```
ppetch/
├── pages/                    # React Pages
│   ├── EnhancedAdminDashboard.tsx
│   ├── EnhancedRiskManagement.tsx
│   ├── LotteryOperations.tsx
│   ├── SidebarAdminLayout.tsx
│   └── ...
├── backend/                  # Backend API
│   ├── prisma/
│   │   └── schema.prisma    # Database Schema
│   ├── src/
│   │   ├── actions/
│   │   │   └── submitTicket.ts
│   │   └── utils/
│   │       └── risk-engine.ts
│   ├── package.json
│   └── README.md
├── types.ts                  # TypeScript Types
├── App.tsx                   # Main App Component
└── package.json
```

## 🎯 Key Algorithms

### Dynamic Risk Formula

```typescript
CurrentPool = InitialCapital + NetTotalSales
MaxLimit = (CurrentPool × Allocation%) ÷ BasePayout
UsageRatio = TotalBetAmount ÷ MaxLimit

if (UsageRatio > 100%) → REJECT
if (UsageRatio > 85%)  → Tier 2 Payout (500x)
if (UsageRatio > 70%)  → Tier 1 Payout (650x)
else                   → Base Payout (800x)
```

## 🔒 Security

- Prisma Transactions for data consistency
- Input validation on all forms
- Admin role-based access control
- 2-factor confirmation for critical operations

## 📄 License

MIT License

## 👨‍💻 Author

Built with ❤️ for secure and fair lottery operations

---

**พร้อมใช้งานเลย! 🚀**
