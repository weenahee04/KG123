// API Service Layer for Backend Integration
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    // Check if response is HTML (backend not running)
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      throw new Error('Backend server is not running. Please start the backend server at http://localhost:3001');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ 
        message: `HTTP ${response.status}: ${response.statusText}` 
      }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Cannot connect to backend server. Please ensure backend is running at http://localhost:3001');
    }
    throw error;
  }
}

// ============================================
// DASHBOARD APIs
// ============================================

export interface DashboardStats {
  depositToday: number;
  withdrawToday: number;
  netProfit: number;
  currentLiability: number;
  totalMembers: number;
  activeMembers: number;
  totalBetsToday: number;
  totalTicketsToday: number;
}

export interface ActionItem {
  id: string;
  type: 'deposit' | 'withdraw' | 'risk';
  title: string;
  amount?: number;
  user?: string;
  time: Date;
  priority: 'high' | 'medium' | 'low';
}

export interface SystemHealth {
  bankingApi: 'online' | 'offline' | 'slow';
  lottoApi: 'online' | 'offline' | 'slow';
  database: 'online' | 'offline' | 'slow';
  lastCheck: Date;
}

export const dashboardAPI = {
  getStats: () => apiCall<DashboardStats>('/dashboard/stats'),
  getActionItems: () => apiCall<ActionItem[]>('/dashboard/actions'),
  getSystemHealth: () => apiCall<SystemHealth>('/dashboard/health'),
};

// ============================================
// RISK MANAGEMENT APIs
// ============================================

export interface RiskNumber {
  number: string;
  betType: '3top' | '3toad' | '2top' | '2bottom' | 'run';
  totalBet: number;
  maxLimit: number;
  usagePercent: number;
  status: 'safe' | 'warning' | 'danger' | 'closed';
  currentPayout: number;
  manualClosed: boolean;
  manualLimit?: number;
}

export interface RiskConfig {
  initialCapital: number;
  currentCapital: number;
  warningThreshold: number;
  dangerThreshold: number;
  rejectThreshold: number;
  allocations: {
    '3top': number;
    '3toad': number;
    '2top': number;
    '2bottom': number;
    'run': number;
  };
  payouts: {
    '3top': { base: number; tier1: number; tier2: number };
    '3toad': { base: number; tier1: number; tier2: number };
    '2top': { base: number; tier1: number; tier2: number };
    '2bottom': { base: number; tier1: number; tier2: number };
    'run': { base: number; tier1: number; tier2: number };
  };
  autoStepDown: boolean;
}

export const riskAPI = {
  getNumbers: (betType?: string) => 
    apiCall<RiskNumber[]>(`/risk/numbers${betType ? `?type=${betType}` : ''}`),
  getConfig: () => apiCall<RiskConfig>('/risk/config'),
  updateConfig: (config: Partial<RiskConfig>) => 
    apiCall<RiskConfig>('/risk/config', {
      method: 'PUT',
      body: JSON.stringify(config),
    }),
  closeNumber: (number: string, betType: string) =>
    apiCall<{ success: boolean }>('/risk/close', {
      method: 'POST',
      body: JSON.stringify({ number, betType }),
    }),
  openNumber: (number: string, betType: string) =>
    apiCall<{ success: boolean }>('/risk/open', {
      method: 'POST',
      body: JSON.stringify({ number, betType }),
    }),
  setManualLimit: (number: string, betType: string, limit: number) =>
    apiCall<{ success: boolean }>('/risk/limit', {
      method: 'POST',
      body: JSON.stringify({ number, betType, limit }),
    }),
};

// ============================================
// LOTTERY OPERATIONS APIs
// ============================================

export interface LotteryRound {
  id: string;
  roundNumber: string;
  lotteryType: 'GOVERNMENT' | 'YIKI' | 'HANOI' | 'LAOS' | 'STOCK';
  drawDate: Date;
  openTime: Date;
  closeTime: Date;
  status: 'WAITING' | 'OPEN' | 'CLOSED' | 'ANNOUNCED' | 'PAID';
  resultTop3?: string;
  resultToad3?: string;
  resultTop2?: string;
  resultBottom2?: string;
  resultRun?: string;
  totalBets?: number;
  totalPayout?: number;
  totalTickets?: number;
}

export interface CreateRoundRequest {
  lotteryType: string;
  drawDate: string;
  openTime: string;
  closeTime: string;
}

export interface SubmitResultRequest {
  roundId: string;
  top3: string;
  toad3?: string;
  top2: string;
  bottom2: string;
  run?: string;
  confirmedBy: string[];
}

export const lotteryAPI = {
  getRounds: (status?: string) => 
    apiCall<LotteryRound[]>(`/lottery/rounds${status ? `?status=${status}` : ''}`),
  createRound: (data: CreateRoundRequest) =>
    apiCall<LotteryRound>('/lottery/rounds', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  autoGenYiki: (date: string) =>
    apiCall<LotteryRound[]>('/lottery/rounds/yiki/generate', {
      method: 'POST',
      body: JSON.stringify({ date }),
    }),
  submitResult: (data: SubmitResultRequest) =>
    apiCall<{ success: boolean }>('/lottery/results', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  fetchResultFromAPI: (roundId: string) =>
    apiCall<{ top3: string; toad3: string; top2: string; bottom2: string; run: string }>(
      `/lottery/results/fetch/${roundId}`
    ),
  processResults: (roundId: string) =>
    apiCall<{ success: boolean; totalPayout: number }>(`/lottery/results/process/${roundId}`, {
      method: 'POST',
    }),
  refundRound: (roundId: string) =>
    apiCall<{ success: boolean }>(`/lottery/rounds/${roundId}/refund`, {
      method: 'POST',
    }),
  rollbackResult: (roundId: string) =>
    apiCall<{ success: boolean }>(`/lottery/results/${roundId}/rollback`, {
      method: 'POST',
    }),
  deleteRound: (roundId: string) =>
    apiCall<{ success: boolean }>(`/lottery/rounds/${roundId}`, {
      method: 'DELETE',
    }),
};

// ============================================
// FINANCIAL APIs
// ============================================

export interface Transaction {
  id: string;
  userId: string;
  username: string;
  type: 'DEPOSIT' | 'WITHDRAW';
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSING';
  bankAccount: string;
  slipUrl?: string;
  note?: string;
  createdAt: Date;
  processedAt?: Date;
  processedBy?: string;
}

export const financialAPI = {
  getTransactions: (type?: string, status?: string) =>
    apiCall<Transaction[]>(
      `/financial/transactions?${type ? `type=${type}&` : ''}${status ? `status=${status}` : ''}`
    ),
  approveTransaction: (id: string, note?: string) =>
    apiCall<{ success: boolean }>(`/financial/transactions/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ note }),
    }),
  rejectTransaction: (id: string, reason: string) =>
    apiCall<{ success: boolean }>(`/financial/transactions/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),
  verifySlip: (slipUrl: string) =>
    apiCall<{ valid: boolean; amount: number; bankAccount: string }>('/financial/verify-slip', {
      method: 'POST',
      body: JSON.stringify({ slipUrl }),
    }),
};

// ============================================
// MEMBER APIs
// ============================================

export interface Member {
  id: string;
  username: string;
  fullName: string;
  phone: string;
  balance: number;
  status: 'ACTIVE' | 'SUSPENDED' | 'BANNED';
  createdAt: Date;
  lastLogin?: Date;
  totalDeposit: number;
  totalWithdraw: number;
  totalBets: number;
  referralCode: string;
  referredBy?: string;
}

export const memberAPI = {
  getMembers: (search?: string, status?: string) =>
    apiCall<Member[]>(
      `/members?${search ? `search=${search}&` : ''}${status ? `status=${status}` : ''}`
    ),
  getMember: (id: string) => apiCall<Member>(`/members/${id}`),
  updateMember: (id: string, data: Partial<Member>) =>
    apiCall<Member>(`/members/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  suspendMember: (id: string, reason: string) =>
    apiCall<{ success: boolean }>(`/members/${id}/suspend`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),
  unsuspendMember: (id: string) =>
    apiCall<{ success: boolean }>(`/members/${id}/unsuspend`, {
      method: 'POST',
    }),
  adjustBalance: (id: string, amount: number, reason: string) =>
    apiCall<{ success: boolean; newBalance: number }>(`/members/${id}/adjust-balance`, {
      method: 'POST',
      body: JSON.stringify({ amount, reason }),
    }),
};

// ============================================
// TICKET/BET APIs
// ============================================

export interface Ticket {
  id: string;
  userId: string;
  username: string;
  roundId: string;
  roundNumber: string;
  totalAmount: number;
  status: 'PENDING' | 'WIN' | 'LOSE' | 'CANCELLED' | 'REFUNDED';
  winAmount?: number;
  createdAt: Date;
  bets: Bet[];
}

export interface Bet {
  id: string;
  number: string;
  betType: '3top' | '3toad' | '2top' | '2bottom' | 'run';
  amount: number;
  payout: number;
  status: 'PENDING' | 'WIN' | 'LOSE';
  winAmount?: number;
}

export const ticketAPI = {
  getTickets: (roundId?: string, userId?: string, status?: string) =>
    apiCall<Ticket[]>(
      `/tickets?${roundId ? `roundId=${roundId}&` : ''}${userId ? `userId=${userId}&` : ''}${status ? `status=${status}` : ''}`
    ),
  getTicket: (id: string) => apiCall<Ticket>(`/tickets/${id}`),
  cancelTicket: (id: string, reason: string) =>
    apiCall<{ success: boolean }>(`/tickets/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),
  getBetsByNumber: (roundId: string, number: string, betType: string) =>
    apiCall<{ number: string; betType: string; totalBet: number; tickets: Ticket[] }>(
      `/tickets/by-number?roundId=${roundId}&number=${number}&betType=${betType}`
    ),
};

// ============================================
// REPORTS APIs
// ============================================

export interface ReportData {
  date: string;
  totalDeposit: number;
  totalWithdraw: number;
  totalBets: number;
  totalPayout: number;
  netProfit: number;
  newMembers: number;
  activeMembers: number;
}

export const reportAPI = {
  getDailyReport: (startDate: string, endDate: string) =>
    apiCall<ReportData[]>(`/reports/daily?start=${startDate}&end=${endDate}`),
  getMonthlyReport: (year: number, month: number) =>
    apiCall<ReportData>(`/reports/monthly?year=${year}&month=${month}`),
  getYearlyReport: (year: number) =>
    apiCall<ReportData>(`/reports/yearly?year=${year}`),
};

// ============================================
// SYSTEM APIs
// ============================================

export interface SystemConfig {
  id: string;
  initialCapital: number;
  affiliateRate: number;
  minDeposit: number;
  maxDeposit: number;
  minWithdraw: number;
  maxWithdraw: number;
  maintenanceMode: boolean;
  maintenanceMessage?: string;
}

export const systemAPI = {
  getConfig: () => apiCall<SystemConfig>('/system/config'),
  updateConfig: (config: Partial<SystemConfig>) =>
    apiCall<SystemConfig>('/system/config', {
      method: 'PUT',
      body: JSON.stringify(config),
    }),
};

// ============================================
// ADMIN APIs
// ============================================

export interface Admin {
  id: string;
  username: string;
  fullName: string;
  role: 'SUPER_ADMIN' | 'FINANCE_MANAGER' | 'LOTTERY_MANAGER' | 'RISK_CONTROLLER' | 'CUSTOMER_SUPPORT' | 'FRAUD_DETECTOR';
  permissions: string[];
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  lastLogin?: Date;
}

export const adminAPI = {
  getAdmins: () => apiCall<Admin[]>('/admins'),
  createAdmin: (data: Partial<Admin>) =>
    apiCall<Admin>('/admins', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateAdmin: (id: string, data: Partial<Admin>) =>
    apiCall<Admin>(`/admins/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteAdmin: (id: string) =>
    apiCall<{ success: boolean }>(`/admins/${id}`, {
      method: 'DELETE',
    }),
};

export default {
  dashboard: dashboardAPI,
  risk: riskAPI,
  lottery: lotteryAPI,
  financial: financialAPI,
  member: memberAPI,
  ticket: ticketAPI,
  report: reportAPI,
  system: systemAPI,
  admin: adminAPI,
};
