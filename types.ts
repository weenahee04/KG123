export interface User {
  username: string;
  isLoggedIn: boolean;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export type PageView = 'landing' | 'login' | 'register' | 'dashboard' | 'add-bank' | 'profile' | 'help' | 'affiliate' | 'deposit' | 'withdraw' | 'betting' | 'results' | 'contact' | 'poy' | 'jackpot' | 'games' | 'number-sets' | 'invite_friend' | 'admin' | 'risk-simulator' | 'bet-tracking' | 'bot-simulator' | 'risk-logic-simulator' | 'admin-dashboard-v2' | 'member-management' | 'bet-management' | 'deposit-withdrawal' | 'result-announcement' | 'realtime-risk' | 'reports-analytics' | 'notification-system' | 'advanced-features' | 'integration-settings' | 'modern-admin' | 'clean-admin' | 'lottery-rounds' | 'lottery-settings' | 'agent-management' | 'bank-accounts' | 'admin-roles' | 'fraud-detection' | 'system-settings' | 'lottery-number-grid' | 'risk-management-system' | 'enhanced-admin-dashboard' | 'enhanced-risk-management' | 'lottery-operations';

export interface LuckyNumberResponse {
  mainNumber: string;
  secondaryNumbers: string[];
  reasoning: string;
}