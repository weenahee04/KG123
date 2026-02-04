# 🎰 Lottery System - Dynamic Risk Engine Backend

## 📋 Overview

This is a production-ready **Dynamic Risk Management System** for a lottery platform built with:
- **Next.js 14+** (App Router)
- **Prisma ORM**
- **PostgreSQL**
- **TypeScript**

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Setup Database

```bash
# Create .env file
DATABASE_URL="postgresql://user:password@localhost:5432/lottery_db"

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed initial data
npx prisma db seed
```

### 3. Initialize System Configuration

```typescript
// Run this once to initialize system
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function initializeSystem() {
  // Create SystemConfig
  await prisma.systemConfig.upsert({
    where: { id: 'config' },
    update: {},
    create: {
      id: 'config',
      initialCapital: 500000,
      payoutTop3: 800,
      payoutToad3: 150,
      payoutTop2: 90,
      payoutBottom2: 90,
      payoutRun: 3.2,
      payoutTop3Tier1: 650,
      payoutToad3Tier1: 130,
      payoutTop2Tier1: 80,
      payoutBottom2Tier1: 80,
      payoutRunTier1: 3.0,
      payoutTop3Tier2: 500,
      payoutToad3Tier2: 110,
      payoutTop2Tier2: 70,
      payoutBottom2Tier2: 70,
      payoutRunTier2: 2.8,
      affiliateRate: 0.08,
      warningThreshold: 0.70,
      dangerThreshold: 0.85,
      rejectThreshold: 1.00
    }
  });

  // Create GlobalStats
  await prisma.globalStats.upsert({
    where: { id: 'stats' },
    update: {},
    create: {
      id: 'stats',
      netTotalSales: 0,
      totalTickets: 0,
      totalWinnings: 0
    }
  });

  console.log('✅ System initialized successfully');
}

initializeSystem();
```

## 🎯 Core Features

### 1. Dynamic Risk Engine

The risk engine calculates limits and assigns payout rates dynamically based on:
- **Current Pool** = Initial Capital + Net Total Sales
- **Allocation Percentage** (per bet type)
- **Usage Ratio** (current bets / max limit)

#### Formula:
```
Max Limit = (Current Pool × Allocation %) ÷ Base Payout
Usage Ratio = Total Bet Amount ÷ Max Limit
```

#### Payout Tiers:
- **0-70% Usage** → Base Payout (e.g., 800x for Top3)
- **70-85% Usage** → Tier 1 Payout (e.g., 650x)
- **85-100% Usage** → Tier 2 Payout (e.g., 500x)
- **>100% Usage** → **REJECTED** (Over Limit)

### 2. Allocation Percentages

```typescript
TOP3:    20%  // 3 ตัวบน
TOAD3:   20%  // 3 ตัวโต๊ด
TOP2:    30%  // 2 ตัวบน
BOTTOM2: 30%  // 2 ตัวล่าง
RUN:     5%   // วิ่ง
```

### 3. Affiliate Commission

When a user has a referrer:
- **Net Amount** = Bet Amount × (1 - Affiliate Rate)
- Default Affiliate Rate: **8%**
- Commission is automatically credited to referrer's balance

## 📖 API Usage

### Submit Ticket

```typescript
import { submitTicket } from '@/actions/submitTicket';

const result = await submitTicket({
  userId: 'user123',
  roundId: 'round456',
  bets: [
    { type: 'TOP3', number: '123', amount: 100 },
    { type: 'TOP2', number: '45', amount: 50 },
    { type: 'BOTTOM2', number: '67', amount: 50 }
  ]
});

if (result.success) {
  console.log('Ticket Number:', result.ticketNumber);
  console.log('Accepted Bets:', result.acceptedBets);
  console.log('Rejected Bets:', result.rejectedBets);
} else {
  console.error('Error:', result.message);
}
```

### Validate Single Bet

```typescript
import { validateAndCalculateRisk } from '@/utils/risk-engine';

const validation = await validateAndCalculateRisk(
  'TOP3',      // betType
  '123',       // number
  100,         // amount
  true         // hasReferrer
);

console.log('Valid:', validation.isValid);
console.log('Assigned Payout:', validation.assignedPayout);
console.log('Potential Win:', validation.potentialWin);
console.log('Usage:', validation.usagePercent + '%');
console.log('Tier:', validation.tier);
console.log('Message:', validation.message);
```

### Get Risk Summary

```typescript
import { getRiskSummary } from '@/utils/risk-engine';

const summary = await getRiskSummary('TOP3');

console.log('Current Pool:', summary.currentPool);
console.log('Net Sales:', summary.netTotalSales);
console.log('Top Risks:', summary.risks);
```

### Reset Risk Data (New Round)

```typescript
import { resetRiskDataForNewRound } from '@/utils/risk-engine';

await resetRiskDataForNewRound();
```

## 🔒 Transaction Safety

All risk calculations and ticket submissions use **Prisma Transactions** to prevent:
- Race conditions
- Double spending
- Inconsistent data states

```typescript
await prisma.$transaction(async (tx) => {
  // All operations are atomic
  // Either all succeed or all fail
});
```

## 📊 Database Models

### Key Models:
- **SystemConfig** - System settings (singleton)
- **GlobalStats** - Accumulated statistics (singleton)
- **LottoRisk** - Per-number risk tracking
- **LotteryRound** - Lottery rounds/draws
- **User** - Users with referral system
- **Ticket** - Bet tickets
- **Bet** - Individual number bets
- **Transaction** - Financial transactions

## 🎮 Example Scenario

```
Initial Capital: 500,000 บาท
Net Sales: 100,000 บาท
Current Pool: 600,000 บาท

For TOP3 (Allocation 20%, Base Payout 800x):
- Type Pot = 600,000 × 20% = 120,000 บาท
- Max Limit = 120,000 ÷ 800 = 150 บาท per number

Number "123" Current Bets: 100 บาท
New Bet: 30 บาท
Total: 130 บาท

Usage Ratio = 130 ÷ 150 = 86.67%
→ DANGER ZONE (85-100%)
→ Assigned Payout: 500x (Tier 2)
→ Potential Win: 30 × 500 = 15,000 บาท
```

## 🛠️ Maintenance

### View Current Configuration

```sql
SELECT * FROM "SystemConfig" WHERE id = 'config';
```

### View Global Stats

```sql
SELECT * FROM "GlobalStats" WHERE id = 'stats';
```

### View Top Risk Numbers

```sql
SELECT * FROM "LottoRisk" 
ORDER BY "totalBetAmount" DESC 
LIMIT 20;
```

### Manual Block Number

```sql
UPDATE "LottoRisk" 
SET "isBlocked" = true 
WHERE type = 'TOP3' AND number = '123';
```

## 📝 Notes

1. **Always initialize** SystemConfig and GlobalStats before use
2. **Reset risk data** at the start of each new lottery round
3. **Monitor high-risk numbers** regularly
4. **Adjust thresholds** based on business needs
5. **Test thoroughly** before production deployment

## 🔧 Configuration

Edit `SystemConfig` to adjust:
- Initial capital
- Payout rates (Base, Tier1, Tier2)
- Affiliate commission rate
- Risk thresholds (Warning, Danger, Reject)

## 📞 Support

For issues or questions, contact the development team.

---

**Built with ❤️ for secure and fair lottery operations**
