import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  DollarSign, 
  Activity,
  ArrowUp,
  ArrowDown,
  Clock,
  Award,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Bell,
  Zap,
  Shield,
  Database,
  Wifi,
  WifiOff,
  CreditCard,
  Wallet,
  Target,
  XCircle
} from 'lucide-react';

// ============================================
// TYPE DEFINITIONS
// ============================================
interface LiveStats {
  depositToday: number;
  depositYesterday: number;
  depositCount: number;
  withdrawToday: number;
  withdrawYesterday: number;
  withdrawCount: number;
  netCashProfit: number;
  netBettingProfit: number;
  currentLiability: number;
  totalBetsToday: number;
  totalPayoutsToday: number;
}

interface ActionItem {
  id: string;
  type: 'deposit' | 'withdrawal' | 'risk';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: Date;
  amount?: number;
}

interface SystemHealth {
  bankingAPI: 'online' | 'offline' | 'degraded';
  lottoAPI: 'online' | 'offline' | 'degraded';
  lastUpdate: Date;
}

export default function EnhancedAdminDashboard() {
  const [liveStats, setLiveStats] = useState<LiveStats>({
    depositToday: 0,
    depositYesterday: 0,
    depositCount: 0,
    withdrawToday: 0,
    withdrawYesterday: 0,
    withdrawCount: 0,
    netCashProfit: 0,
    netBettingProfit: 0,
    currentLiability: 0,
    totalBetsToday: 0,
    totalPayoutsToday: 0,
  });

  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    bankingAPI: 'online',
    lottoAPI: 'online',
    lastUpdate: new Date(),
  });

  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadDashboardData();
    if (autoRefresh) {
      const interval = setInterval(loadDashboardData, 5000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const loadDashboardData = () => {
    // Mock data - replace with real API calls
    setLiveStats({
      depositToday: 1250000,
      depositYesterday: 1085000,
      depositCount: 234,
      withdrawToday: 850000,
      withdrawYesterday: 920000,
      withdrawCount: 156,
      netCashProfit: 400000, // depositToday - withdrawToday
      netBettingProfit: 185000, // totalBetsToday - totalPayoutsToday
      currentLiability: 2350000, // ยอดแทงค้างที่รอผลออก
      totalBetsToday: 3250000,
      totalPayoutsToday: 3065000,
    });

    setActionItems([
      {
        id: '1',
        type: 'deposit',
        title: 'รอตรวจสลิปฝาก',
        description: '15 รายการ รอการอนุมัติ',
        priority: 'high',
        timestamp: new Date(),
        amount: 125000
      },
      {
        id: '2',
        type: 'withdrawal',
        title: 'รออนุมัติถอน',
        description: '8 รายการ รอการอนุมัติ',
        priority: 'high',
        timestamp: new Date(),
        amount: 85000
      },
      {
        id: '3',
        type: 'risk',
        title: 'เลขเสี่ยงสูง',
        description: '12 เลข ใช้ลิมิตเกิน 85%',
        priority: 'medium',
        timestamp: new Date()
      }
    ]);

    setSystemHealth({
      bankingAPI: Math.random() > 0.1 ? 'online' : 'degraded',
      lottoAPI: Math.random() > 0.05 ? 'online' : 'offline',
      lastUpdate: new Date(),
    });
  };

  const calculatePercentChange = (today: number, yesterday: number) => {
    if (yesterday === 0) return 0;
    return ((today - yesterday) / yesterday) * 100;
  };

  const depositChange = calculatePercentChange(liveStats.depositToday, liveStats.depositYesterday);
  const withdrawChange = calculatePercentChange(liveStats.withdrawToday, liveStats.withdrawYesterday);

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">📊 Dashboard</h1>
            <p className="text-gray-600 mt-1">ภาพรวมระบบแบบเรียลไทม์</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
                autoRefresh 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              <RefreshCw size={18} className={autoRefresh ? 'animate-spin' : ''} />
              Auto Refresh
            </button>
          </div>
        </div>

        {/* Live Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Deposit Today */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp size={20} className="text-green-600" />
                </div>
                <span className="text-sm font-bold text-gray-600">ฝากวันนี้</span>
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${
                depositChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {depositChange >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                {Math.abs(depositChange).toFixed(1)}%
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              ฿{liveStats.depositToday.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">
              {liveStats.depositCount} รายการ
            </p>
          </div>

          {/* Withdraw Today */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-600">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-red-100 rounded-lg">
                  <TrendingDown size={20} className="text-red-600" />
                </div>
                <span className="text-sm font-bold text-gray-600">ถอนวันนี้</span>
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${
                withdrawChange <= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {withdrawChange <= 0 ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
                {Math.abs(withdrawChange).toFixed(1)}%
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              ฿{liveStats.withdrawToday.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">
              {liveStats.withdrawCount} รายการ
            </p>
          </div>

          {/* Net Profit */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign size={20} className="text-blue-600" />
              </div>
              <span className="text-sm font-bold text-gray-600">กำไรสุทธิ</span>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-500">เงินสด (ฝาก-ถอน)</p>
                <p className={`text-xl font-bold ${
                  liveStats.netCashProfit >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {liveStats.netCashProfit >= 0 ? '+' : ''}฿{liveStats.netCashProfit.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">หน้าเสื่อ (แทง-จ่าย)</p>
                <p className={`text-xl font-bold ${
                  liveStats.netBettingProfit >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {liveStats.netBettingProfit >= 0 ? '+' : ''}฿{liveStats.netBettingProfit.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Current Liability */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-600">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle size={20} className="text-orange-600" />
              </div>
              <span className="text-sm font-bold text-gray-600">ยอดค้าง</span>
            </div>
            <p className="text-2xl font-bold text-orange-600 mb-1">
              ฿{liveStats.currentLiability.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">
              ยอดแทงรอผลออก
            </p>
            <button className="mt-2 text-xs text-blue-600 hover:underline font-bold">
              → ดูหน้า Risk
            </button>
          </div>
        </div>

        {/* Action Center */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Bell size={20} className="text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">ศูนย์รวมงานด่วน</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {actionItems.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-lg border-2 cursor-pointer hover:shadow-md transition-all ${
                  item.priority === 'high' 
                    ? 'border-red-300 bg-red-50' 
                    : item.priority === 'medium'
                    ? 'border-yellow-300 bg-yellow-50'
                    : 'border-gray-300 bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {item.type === 'deposit' && <CreditCard size={18} className="text-green-600" />}
                    {item.type === 'withdrawal' && <Wallet size={18} className="text-red-600" />}
                    {item.type === 'risk' && <Shield size={18} className="text-orange-600" />}
                    <span className="font-bold text-gray-900">{item.title}</span>
                  </div>
                  {item.priority === 'high' && (
                    <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">
                      ด่วน!
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                {item.amount && (
                  <p className="text-lg font-bold text-blue-600">
                    ฿{item.amount.toLocaleString()}
                  </p>
                )}
                <button className="mt-2 text-sm text-blue-600 hover:underline font-bold">
                  ดูรายละเอียด →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={20} className="text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">สุขภาพระบบ</h2>
            <span className="text-xs text-gray-500 ml-auto">
              อัพเดท: {systemHealth.lastUpdate.toLocaleTimeString('th-TH')}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Banking API */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <Database size={24} className="text-gray-600" />
                <div>
                  <p className="font-bold text-gray-900">Banking API</p>
                  <p className="text-xs text-gray-500">ระบบดึงยอดธนาคาร</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {systemHealth.bankingAPI === 'online' && (
                  <>
                    <Wifi size={20} className="text-green-600" />
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-bold rounded-full">
                      ออนไลน์
                    </span>
                  </>
                )}
                {systemHealth.bankingAPI === 'degraded' && (
                  <>
                    <AlertCircle size={20} className="text-yellow-600" />
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-bold rounded-full">
                      ช้า
                    </span>
                  </>
                )}
                {systemHealth.bankingAPI === 'offline' && (
                  <>
                    <WifiOff size={20} className="text-red-600" />
                    <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-bold rounded-full">
                      ออฟไลน์
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Lotto API */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <Target size={24} className="text-gray-600" />
                <div>
                  <p className="font-bold text-gray-900">Lotto API</p>
                  <p className="text-xs text-gray-500">ระบบดึงผลหวย</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {systemHealth.lottoAPI === 'online' && (
                  <>
                    <Wifi size={20} className="text-green-600" />
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-bold rounded-full">
                      ออนไลน์
                    </span>
                  </>
                )}
                {systemHealth.lottoAPI === 'degraded' && (
                  <>
                    <AlertCircle size={20} className="text-yellow-600" />
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-bold rounded-full">
                      ช้า
                    </span>
                  </>
                )}
                {systemHealth.lottoAPI === 'offline' && (
                  <>
                    <WifiOff size={20} className="text-red-600" />
                    <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-bold rounded-full">
                      ออฟไลน์
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">ยอดแทงวันนี้</p>
            <p className="text-xl font-bold text-blue-600">
              ฿{liveStats.totalBetsToday.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">จ่ายรางวัลวันนี้</p>
            <p className="text-xl font-bold text-purple-600">
              ฿{liveStats.totalPayoutsToday.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Win Rate</p>
            <p className="text-xl font-bold text-orange-600">
              {((liveStats.totalPayoutsToday / liveStats.totalBetsToday) * 100).toFixed(1)}%
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">House Edge</p>
            <p className="text-xl font-bold text-green-600">
              {(((liveStats.totalBetsToday - liveStats.totalPayoutsToday) / liveStats.totalBetsToday) * 100).toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Zap size={20} className="text-blue-600 mt-0.5" />
            <div>
              <p className="font-bold text-blue-900 mb-1">ข้อมูลอัพเดทแบบเรียลไทม์</p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• ข้อมูลอัพเดททุก 5 วินาที (เปิด Auto Refresh)</li>
                <li>• คลิกที่การ์ดเพื่อดูรายละเอียดเพิ่มเติม</li>
                <li>• ยอดค้างสูง = ควรเช็คหน้า Risk Management</li>
                <li>• ระบบแจ้งเตือนอัตโนมัติเมื่อมีงานด่วน</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
