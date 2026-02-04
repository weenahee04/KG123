-- CreateTable
CREATE TABLE "SystemConfig" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'config',
    "initialCapital" REAL NOT NULL DEFAULT 500000,
    "payoutTop3" INTEGER NOT NULL DEFAULT 800,
    "payoutToad3" INTEGER NOT NULL DEFAULT 150,
    "payoutTop2" INTEGER NOT NULL DEFAULT 90,
    "payoutBottom2" INTEGER NOT NULL DEFAULT 90,
    "payoutRun" REAL NOT NULL DEFAULT 3.2,
    "payoutTop3Tier1" INTEGER NOT NULL DEFAULT 650,
    "payoutToad3Tier1" INTEGER NOT NULL DEFAULT 130,
    "payoutTop2Tier1" INTEGER NOT NULL DEFAULT 80,
    "payoutBottom2Tier1" INTEGER NOT NULL DEFAULT 80,
    "payoutRunTier1" REAL NOT NULL DEFAULT 3.0,
    "payoutTop3Tier2" INTEGER NOT NULL DEFAULT 500,
    "payoutToad3Tier2" INTEGER NOT NULL DEFAULT 110,
    "payoutTop2Tier2" INTEGER NOT NULL DEFAULT 70,
    "payoutBottom2Tier2" INTEGER NOT NULL DEFAULT 70,
    "payoutRunTier2" REAL NOT NULL DEFAULT 2.8,
    "affiliateRate" REAL NOT NULL DEFAULT 0.08,
    "warningThreshold" REAL NOT NULL DEFAULT 0.70,
    "dangerThreshold" REAL NOT NULL DEFAULT 0.85,
    "rejectThreshold" REAL NOT NULL DEFAULT 1.00,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "GlobalStats" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'stats',
    "netTotalSales" REAL NOT NULL DEFAULT 0,
    "totalTickets" INTEGER NOT NULL DEFAULT 0,
    "totalWinnings" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "LottoRisk" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "totalBetAmount" REAL NOT NULL DEFAULT 0,
    "betCount" INTEGER NOT NULL DEFAULT 0,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "LotteryRound" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roundNumber" TEXT NOT NULL,
    "lotteryType" TEXT NOT NULL,
    "drawDate" DATETIME NOT NULL,
    "openTime" DATETIME NOT NULL,
    "closeTime" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'WAITING',
    "resultTop3" TEXT,
    "resultToad3" TEXT,
    "resultTop2" TEXT,
    "resultBottom2" TEXT,
    "resultRun" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT NOT NULL,
    "fullName" TEXT,
    "phoneNumber" TEXT,
    "role" TEXT NOT NULL DEFAULT 'MEMBER',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "balance" REAL NOT NULL DEFAULT 0,
    "referralCode" TEXT,
    "referredBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "User_referredBy_fkey" FOREIGN KEY ("referredBy") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ticketNumber" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roundId" TEXT NOT NULL,
    "totalAmount" REAL NOT NULL,
    "netAmount" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "hasReferrer" BOOLEAN NOT NULL DEFAULT false,
    "commissionPaid" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Ticket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ticket_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "LotteryRound" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Bet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ticketId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "assignedPayout" REAL NOT NULL,
    "potentialWin" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "actualWin" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Bet_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "balanceBefore" REAL NOT NULL,
    "balanceAfter" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "reference" TEXT,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "LottoRisk_type_idx" ON "LottoRisk"("type");

-- CreateIndex
CREATE INDEX "LottoRisk_totalBetAmount_idx" ON "LottoRisk"("totalBetAmount");

-- CreateIndex
CREATE UNIQUE INDEX "LottoRisk_type_number_key" ON "LottoRisk"("type", "number");

-- CreateIndex
CREATE UNIQUE INDEX "LotteryRound_roundNumber_key" ON "LotteryRound"("roundNumber");

-- CreateIndex
CREATE INDEX "LotteryRound_status_idx" ON "LotteryRound"("status");

-- CreateIndex
CREATE INDEX "LotteryRound_drawDate_idx" ON "LotteryRound"("drawDate");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_referralCode_key" ON "User"("referralCode");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_referralCode_idx" ON "User"("referralCode");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_ticketNumber_key" ON "Ticket"("ticketNumber");

-- CreateIndex
CREATE INDEX "Ticket_userId_idx" ON "Ticket"("userId");

-- CreateIndex
CREATE INDEX "Ticket_roundId_idx" ON "Ticket"("roundId");

-- CreateIndex
CREATE INDEX "Ticket_status_idx" ON "Ticket"("status");

-- CreateIndex
CREATE INDEX "Ticket_createdAt_idx" ON "Ticket"("createdAt");

-- CreateIndex
CREATE INDEX "Bet_ticketId_idx" ON "Bet"("ticketId");

-- CreateIndex
CREATE INDEX "Bet_type_number_idx" ON "Bet"("type", "number");

-- CreateIndex
CREATE INDEX "Transaction_userId_idx" ON "Transaction"("userId");

-- CreateIndex
CREATE INDEX "Transaction_type_idx" ON "Transaction"("type");

-- CreateIndex
CREATE INDEX "Transaction_status_idx" ON "Transaction"("status");

-- CreateIndex
CREATE INDEX "Transaction_createdAt_idx" ON "Transaction"("createdAt");
