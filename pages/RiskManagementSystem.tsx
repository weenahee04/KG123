import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle,
  Shield,
  TrendingUp,
  DollarSign,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  Settings,
  RefreshCw,
  Bell,
  Activity,
  BarChart3,
  Zap,
  Target,
  AlertCircle
} from 'lucide-react';

interface RiskConfig {
  initialCapital: number;
  totalSales: number;
  allocations: {
    '3top': number;
    '3tod': number;
    '2top': number;
    '2bottom': number;
    'run': number;
  };
  payouts: {
    '3top': { base: number; tier1: number; tier2: number };
    '3tod': { base: number; tier1: number; tier2: number };
    '2top': { base: number; tier1: number; tier2: number };
    '2bottom': { base: number; tier1: number; tier2: number };
    'run': { base: number; tier1: number; tier2: number };
  };
  thresholds: {
    warning: number;  // 70%
    danger: number;   // 85%
    reject: number;   // 100%
  };
}

interface NumberRisk {
  number: string;
  betType: '3top' | '3tod' | '2top' | '2bottom' | 'run';
  totalBet: number;
  maxLimit: number;
  usagePercent: number;
  status: 'safe' | 'warning' | 'danger' | 'blocked';
  currentPayout: number;
  potentialLoss: number;
  betCount: number;
  autoBlocked: boolean;
}

export default function RiskManagementSystem() {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedBetType, setSelectedBetType] = useState<string>('3top');
  const [riskNumbers, setRiskNumbers] = useState<NumberRisk[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  
  // Risk Configuration
  const [config, setConfig] = useState<RiskConfig>({
    initialCapital: 10000000,
    totalSales: 2500000,
    allocations: {
      '3top': 30,
      '3tod': 20,
      '2top': 25,
      '2bottom': 20,
      'run': 5
    },
    payouts: {
      '3top': { base: 850, tier1: 750, tier2: 650 },
      '3tod': { base: 150, tier1: 130, tier2: 110 },
      '2top': { base: 90, tier1: 80, tier2: 70 },
      '2bottom': { base: 90, tier1: 80, tier2: 70 },
      'run': { base: 3.2, tier1: 3.0, tier2: 2.8 }
    },
    thresholds: {
      warning: 70,
      danger: 85,
      reject: 100
    }
  });

  useEffect(() => {
    loadRiskData();
  }, [selectedBetType, config]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        loadRiskData();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, selectedBetType, config]);

  const loadRiskData = () => {
    const mockRisks: NumberRisk[] = [];
    const currentCapital = config.initialCapital + config.totalSales;
    const allocation = config.allocations[selectedBetType as keyof typeof config.allocations];
    const payout = config.payouts[selectedBetType as keyof typeof config.payouts];
    
    const typePot = (currentCapital * allocation) / 100;
    const maxLimit = typePot / payout.base;

    // Generate 100 numbers with varying risk levels
    for (let i = 0; i < 100; i++) {
      const number = i.toString().padStart(selectedBetType === 'run' ? 1 : (selectedBetType.includes('2') ? 2 : 3), '0');
      
      // Random bet amount with some numbers having high risk
      const randomFactor = Math.random();
      let totalBet = 0;
      
      if (randomFactor > 0.95) {
        // 5% chance of very high risk
        totalBet = maxLimit * (0.9 + Math.random() * 0.3);
      } else if (randomFactor > 0.85) {
        // 10% chance of high risk
        totalBet = maxLimit * (0.7 + Math.random() * 0.2);
      } else if (randomFactor > 0.6) {
        // 25% chance of medium risk
        totalBet = maxLimit * (0.3 + Math.random() * 0.4);
      } else if (randomFactor > 0.3) {
        // 30% chance of low risk
        totalBet = maxLimit * (0.05 + Math.random() * 0.25);
      }
      // 30% chance of no bets (totalBet = 0)

      const usagePercent = (totalBet / maxLimit) * 100;
      const betCount = totalBet > 0 ? Math.floor(Math.random() * 20) + 1 : 0;

      let status: 'safe' | 'warning' | 'danger' | 'blocked' = 'safe';
      let currentPayout = payout.base;
      let autoBlocked = false;

      if (usagePercent >= config.thresholds.reject) {
        status = 'blocked';
        currentPayout = 0;
        autoBlocked = true;
      } else if (usagePercent >= config.thresholds.danger) {
        status = 'danger';
        currentPayout = payout.tier2;
      } else if (usagePercent >= config.thresholds.warning) {
        status = 'warning';
        currentPayout = payout.tier1;
      }

      const potentialLoss = totalBet * currentPayout;

      mockRisks.push({
        number,
        betType: selectedBetType as any,
        totalBet,
        maxLimit,
        usagePercent,
        status,
        currentPayout,
        potentialLoss,
        betCount,
        autoBlocked
      });
    }

    setRiskNumbers(mockRisks.sort((a, b) => b.usagePercent - a.usagePercent));
  };

  const stats = {
    total: riskNumbers.length,
    safe: riskNumbers.filter(r => r.status === 'safe' && r.totalBet > 0).length,
    warning: riskNumbers.filter(r => r.status === 'warning').length,
    danger: riskNumbers.filter(r => r.status === 'danger').length,
    blocked: riskNumbers.filter(r => r.status === 'blocked').length,
    totalExposure: riskNumbers.reduce((sum, r) => sum + r.potentialLoss, 0),
    avgUsage: riskNumbers.filter(r => r.totalBet > 0).reduce((sum, r) => sum + r.usagePercent, 0) / 
              (riskNumbers.filter(r => r.totalBet > 0).length || 1)
  };

  const getStatusColor = (status: string) => {
    const colors = {
      safe: 'bg-green-100 text-green-800 border-green-300',
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      danger: 'bg-orange-100 text-orange-800 border-orange-300',
      blocked: 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[status as keyof typeof colors] || colors.safe;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'safe': return <CheckCircle size={16} />;
      case 'warning': return <AlertTriangle size={16} />;
      case 'danger': return <AlertCircle size={16} />;
      case 'blocked': return <Lock size={16} />;
      default: return <CheckCircle size={16} />;
    }
  };

  const toggleNumberBlock = (number: string) => {
    setRiskNumbers(prev => prev.map(risk => {
      if (risk.number === number) {
        const newStatus = risk.status === 'blocked' ? 'safe' : 'blocked';
        return {
          ...risk,
          status: newStatus,
          currentPayout: newStatus === 'blocked' ? 0 : config.payouts[risk.betType].base,
          autoBlocked: false
        };
      }
      return risk;
    }));
  };

  const blockAllDanger = () => {
    setRiskNumbers(prev => prev.map(risk => {
      if (risk.status === 'danger' || risk.usagePercent >= config.thresholds.danger) {
        return {
          ...risk,
          status: 'blocked',
          currentPayout: 0,
          autoBlocked: false
        };
      }
      return risk;
    }));
    alert(`ปิดรับเลขอันตรายทั้งหมดแล้ว!`);
  };

  const getBetTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      '3top': '3 ตัวบน',
      '3tod': '3 ตัวโต๊ด',
      '2top': '2 ตัวบน',
      '2bottom': '2 ตัวล่าง',
      'run': 'วิ่ง'
    };
    return labels[type] || type;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">🛡️ จัดการความเสี่ยง</h1>
            <p className="text-gray-600 mt-1">ระบบคำนวณและควบคุมความเสี่ยงอัตโนมัติ</p>
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
              Auto
            </button>
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-2 bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg font-bold hover:bg-gray-50 transition-all"
            >
              <Settings size={18} />
              ตั้งค่า
            </button>
            <button 
              onClick={blockAllDanger}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition-all"
            >
              <Lock size={18} />
              ปิดเลขอันตราย
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4">
          <div className="bg-white rounded-lg shadow-lg p-3 md:p-4 border-l-4 border-blue-600">
            <div className="flex items-center gap-2 mb-1">
              <Target size={16} className="text-blue-600" />
              <p className="text-xs text-gray-600">ทั้งหมด</p>
            </div>
            <p className="text-xl md:text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-3 md:p-4 border-l-4 border-green-600">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle size={16} className="text-green-600" />
              <p className="text-xs text-gray-600">ปลอดภัย</p>
            </div>
            <p className="text-xl md:text-2xl font-bold text-green-600">{stats.safe}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-3 md:p-4 border-l-4 border-yellow-600">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle size={16} className="text-yellow-600" />
              <p className="text-xs text-gray-600">เตือน</p>
            </div>
            <p className="text-xl md:text-2xl font-bold text-yellow-600">{stats.warning}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-3 md:p-4 border-l-4 border-orange-600">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle size={16} className="text-orange-600" />
              <p className="text-xs text-gray-600">อันตราย</p>
            </div>
            <p className="text-xl md:text-2xl font-bold text-orange-600">{stats.danger}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-3 md:p-4 border-l-4 border-red-600">
            <div className="flex items-center gap-2 mb-1">
              <Lock size={16} className="text-red-600" />
              <p className="text-xs text-gray-600">ปิดรับ</p>
            </div>
            <p className="text-xl md:text-2xl font-bold text-red-600">{stats.blocked}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-3 md:p-4 border-l-4 border-purple-600">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign size={16} className="text-purple-600" />
              <p className="text-xs text-gray-600">ความเสี่ยง</p>
            </div>
            <p className="text-lg md:text-xl font-bold text-purple-600">฿{(stats.totalExposure / 1000000).toFixed(1)}M</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-3 md:p-4 border-l-4 border-blue-600">
            <div className="flex items-center gap-2 mb-1">
              <Activity size={16} className="text-blue-600" />
              <p className="text-xs text-gray-600">ใช้เฉลี่ย</p>
            </div>
            <p className="text-xl md:text-2xl font-bold text-blue-600">{stats.avgUsage.toFixed(0)}%</p>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">⚙️ ตั้งค่าระบบ Risk</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">ทุนเริ่มต้น</label>
                <input
                  type="number"
                  value={config.initialCapital}
                  onChange={(e) => setConfig({...config, initialCapital: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">ยอดขายรวม</label>
                <input
                  type="number"
                  value={config.totalSales}
                  onChange={(e) => setConfig({...config, totalSales: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">เกณฑ์เตือน (%)</label>
                <input
                  type="number"
                  value={config.thresholds.warning}
                  onChange={(e) => setConfig({
                    ...config, 
                    thresholds: {...config.thresholds, warning: Number(e.target.value)}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        )}

        {/* Bet Type Selector */}
        <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
          <div className="flex gap-2 overflow-x-auto">
            {['3top', '3tod', '2top', '2bottom', 'run'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedBetType(type)}
                className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap transition-all ${
                  selectedBetType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {getBetTypeLabel(type)}
              </button>
            ))}
          </div>
        </div>

        {/* Risk Numbers Table */}
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              รายการเลข {getBetTypeLabel(selectedBetType)}
            </h2>
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-yellow-600" />
              <span className="text-sm text-gray-600">อัพเดทอัตโนมัติ</span>
            </div>
          </div>

          <div className="overflow-x-auto -mx-4 md:mx-0">
            <table className="w-full min-w-[800px]">
              <thead className="bg-blue-50 border-b-2 border-blue-200">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">เลข</th>
                  <th className="px-4 py-3 text-right font-bold text-gray-700">ยอดแทง</th>
                  <th className="px-4 py-3 text-right font-bold text-gray-700">ลิมิต</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-700">ใช้ไป</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-700">สถานะ</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-700">อัตราจ่าย</th>
                  <th className="px-4 py-3 text-right font-bold text-gray-700">ความเสี่ยง</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-700">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {riskNumbers.filter(r => r.totalBet > 0 || r.status === 'blocked').slice(0, 50).map((risk) => (
                  <tr key={risk.number} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">{risk.number}</span>
                        {risk.autoBlocked && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Auto</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900">
                      ฿{risk.totalBet.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      ฿{risk.maxLimit.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              risk.usagePercent >= 85 ? 'bg-red-600' :
                              risk.usagePercent >= 70 ? 'bg-orange-600' :
                              risk.usagePercent >= 50 ? 'bg-yellow-600' :
                              'bg-green-600'
                            }`}
                            style={{ width: `${Math.min(risk.usagePercent, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-bold">{risk.usagePercent.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border ${getStatusColor(risk.status)}`}>
                        {getStatusIcon(risk.status)}
                        <span className="text-xs font-bold">
                          {risk.status === 'safe' ? 'ปลอดภัย' :
                           risk.status === 'warning' ? 'เตือน' :
                           risk.status === 'danger' ? 'อันตราย' :
                           'ปิดรับ'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-bold ${
                        risk.currentPayout === 0 ? 'text-red-600' :
                        risk.currentPayout < config.payouts[risk.betType].base ? 'text-orange-600' :
                        'text-green-600'
                      }`}>
                        {risk.currentPayout === 0 ? 'ปิด' : `${risk.currentPayout}x`}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-bold text-purple-600">
                        ฿{(risk.potentialLoss / 1000).toFixed(0)}K
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleNumberBlock(risk.number)}
                        className={`p-2 rounded-lg transition-colors ${
                          risk.status === 'blocked'
                            ? 'bg-green-100 text-green-600 hover:bg-green-200'
                            : 'bg-red-100 text-red-600 hover:bg-red-200'
                        }`}
                        title={risk.status === 'blocked' ? 'เปิดรับ' : 'ปิดรับ'}
                      >
                        {risk.status === 'blocked' ? <Unlock size={18} /> : <Lock size={18} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Shield size={20} className="text-blue-600 mt-0.5" />
            <div>
              <p className="font-bold text-blue-900 mb-1">ระบบทำงานอัตโนมัติ:</p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>เขียว (ปลอดภัย)</strong> = ใช้ไป &lt;70% - จ่ายเต็มอัตรา</li>
                <li>• <strong>เหลือง (เตือน)</strong> = ใช้ไป 70-85% - ลดอัตราจ่าย Tier 1</li>
                <li>• <strong>ส้ม (อันตราย)</strong> = ใช้ไป 85-100% - ลดอัตราจ่าย Tier 2</li>
                <li>• <strong>แดง (ปิดรับ)</strong> = ใช้ไปเกิน 100% - ปิดรับอัตโนมัติ</li>
                <li>• คลิกไอคอนกุญแจเพื่อเปิด/ปิดรับเลขด้วยตัวเอง</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
