import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity,
  ArrowUp,
  ArrowDown,
  Clock,
  Award,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface DashboardStats {
  todaySales: number;
  todayProfit: number;
  totalMembers: number;
  onlineUsers: number;
  todayBets: number;
  pendingWithdrawals: number;
  salesGrowth: number;
  profitGrowth: number;
}

interface TopNumber {
  number: string;
  betType: string;
  totalAmount: number;
  betCount: number;
  risk: 'high' | 'medium' | 'low';
}

interface RecentBet {
  id: string;
  username: string;
  betType: string;
  number: string;
  amount: number;
  timestamp: Date;
  status: 'pending' | 'won' | 'lost';
}

export default function AdminDashboardV2() {
  const [stats, setStats] = useState<DashboardStats>({
    todaySales: 0,
    todayProfit: 0,
    totalMembers: 0,
    onlineUsers: 0,
    todayBets: 0,
    pendingWithdrawals: 0,
    salesGrowth: 0,
    profitGrowth: 0,
  });

  const [topNumbers, setTopNumbers] = useState<TopNumber[]>([]);
  const [recentBets, setRecentBets] = useState<RecentBet[]>([]);
  const [hourlyData, setHourlyData] = useState<number[]>([]);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = () => {
    setStats({
      todaySales: 1250000,
      todayProfit: 185000,
      totalMembers: 1547,
      onlineUsers: 89,
      todayBets: 3421,
      pendingWithdrawals: 12,
      salesGrowth: 15.3,
      profitGrowth: 8.7,
    });

    setTopNumbers([
      { number: '123', betType: '3ตัวบน', totalAmount: 45000, betCount: 89, risk: 'high' },
      { number: '456', betType: '3ตัวบน', totalAmount: 38000, betCount: 76, risk: 'high' },
      { number: '789', betType: '3ตัวบน', totalAmount: 32000, betCount: 64, risk: 'medium' },
      { number: '12', betType: '2ตัวบน', totalAmount: 28000, betCount: 112, risk: 'medium' },
      { number: '34', betType: '2ตัวล่าง', totalAmount: 25000, betCount: 98, risk: 'low' },
    ]);

    setRecentBets([
      { id: '1', username: 'user001', betType: '3ตัวบน', number: '123', amount: 500, timestamp: new Date(), status: 'pending' },
      { id: '2', username: 'user042', betType: '2ตัวบน', number: '45', amount: 300, timestamp: new Date(), status: 'pending' },
      { id: '3', username: 'user089', betType: '3ตัวโต๊ด', number: '456', amount: 200, timestamp: new Date(), status: 'pending' },
    ]);

    setHourlyData([12000, 15000, 18000, 22000, 28000, 35000, 42000, 48000, 55000, 62000, 68000, 75000]);
  };

  const StatCard = ({ icon: Icon, title, value, growth, color }: any) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
        {growth !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-bold ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {growth >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
            {Math.abs(growth)}%
          </div>
        )}
      </div>
      <h3 className="text-gray-600 text-sm mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📊 Dashboard Real-time</h1>
            <p className="text-gray-600 mt-1">ภาพรวมระบบแบบเรียลไทม์</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock size={16} />
            <span>อัปเดตล่าสุด: {new Date().toLocaleTimeString('th-TH')}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={DollarSign}
            title="ยอดขายวันนี้"
            value={`฿${stats.todaySales.toLocaleString()}`}
            growth={stats.salesGrowth}
            color="bg-blue-600"
          />
          <StatCard
            icon={TrendingUp}
            title="กำไรวันนี้"
            value={`฿${stats.todayProfit.toLocaleString()}`}
            growth={stats.profitGrowth}
            color="bg-blue-600"
          />
          <StatCard
            icon={Users}
            title="สมาชิกทั้งหมด"
            value={stats.totalMembers.toLocaleString()}
            growth={undefined}
            color="bg-blue-600"
          />
          <StatCard
            icon={Activity}
            title="ออนไลน์ตอนนี้"
            value={stats.onlineUsers.toLocaleString()}
            growth={undefined}
            color="bg-blue-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">📈 ยอดขายรายชั่วโมง</h3>
            <div className="flex items-end justify-between gap-2 h-48">
              {hourlyData.map((value, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-lg transition-all hover:opacity-80"
                    style={{ height: `${(value / Math.max(...hourlyData)) * 100}%` }}
                  />
                  <span className="text-xs text-gray-600">{idx}:00</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">🎯 สถิติวันนี้</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-gray-700">จำนวนโพย</span>
                <span className="text-lg font-bold text-blue-600">{stats.todayBets.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <span className="text-sm text-gray-700">รอถอนเงิน</span>
                <span className="text-lg font-bold text-orange-600">{stats.pendingWithdrawals}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-700">อัตรากำไร</span>
                <span className="text-lg font-bold text-green-600">
                  {((stats.todayProfit / stats.todaySales) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">🔥 เลขยอดนิยม Top 5</h3>
            <div className="space-y-3">
              {topNumbers.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white font-bold rounded-full">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xl font-bold text-gray-900">{item.number}</span>
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">{item.betType}</span>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {item.betCount} โพย • ฿{item.totalAmount.toLocaleString()}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    item.risk === 'high' ? 'bg-red-100 text-red-700' :
                    item.risk === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {item.risk === 'high' ? '⚠️ สูง' : item.risk === 'medium' ? '⚡ ปานกลาง' : '✓ ต่ำ'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">⚡ การแทงล่าสุด (Real-time)</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {recentBets.map((bet) => (
                <div key={bet.id} className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900">{bet.username}</span>
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">{bet.betType}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-mono font-bold text-lg text-gray-900">{bet.number}</span>
                      <span className="text-gray-600">•</span>
                      <span className="font-bold text-green-600">฿{bet.amount.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {bet.timestamp.toLocaleTimeString('th-TH')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">🎉 ระบบทำงานปกติ</h3>
              <p className="text-purple-100">ทุกอย่างเรียบร้อย • อัปเดตทุก 5 วินาที</p>
            </div>
            <CheckCircle size={48} className="text-white opacity-80" />
          </div>
        </div>
      </div>
    </div>
  );
}
