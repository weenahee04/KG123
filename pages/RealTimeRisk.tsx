import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  Shield,
  DollarSign,
  Percent,
  Target,
  Zap
} from 'lucide-react';

interface NumberRisk {
  number: string;
  betType: string;
  totalBets: number;
  totalAmount: number;
  currentLimit: number;
  usagePercent: number;
  riskLevel: 'safe' | 'warning' | 'danger' | 'critical';
  currentPayout: number;
  potentialPayout: number;
}

export default function RealTimeRisk() {
  const [riskData, setRiskData] = useState<NumberRisk[]>([]);
  const [filterRiskLevel, setFilterRiskLevel] = useState<string>('all');
  const [filterBetType, setFilterBetType] = useState<string>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadRiskData();
    
    if (autoRefresh) {
      const interval = setInterval(() => {
        loadRiskData();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const loadRiskData = () => {
    const mockData: NumberRisk[] = [
      {
        number: '123',
        betType: '3ตัวบน',
        totalBets: 45,
        totalAmount: 125000,
        currentLimit: 150000,
        usagePercent: 83.3,
        riskLevel: 'warning',
        currentPayout: 850,
        potentialPayout: 106250000,
      },
      {
        number: '456',
        betType: '3ตัวบน',
        totalBets: 78,
        totalAmount: 185000,
        currentLimit: 200000,
        usagePercent: 92.5,
        riskLevel: 'danger',
        currentPayout: 750,
        potentialPayout: 138750000,
      },
      {
        number: '789',
        betType: '3ตัวบน',
        totalBets: 12,
        totalAmount: 35000,
        currentLimit: 150000,
        usagePercent: 23.3,
        riskLevel: 'safe',
        currentPayout: 900,
        potentialPayout: 31500000,
      },
      {
        number: '12',
        betType: '2ตัวบน',
        totalBets: 156,
        totalAmount: 245000,
        currentLimit: 250000,
        usagePercent: 98.0,
        riskLevel: 'critical',
        currentPayout: 70,
        potentialPayout: 17150000,
      },
      {
        number: '34',
        betType: '2ตัวบน',
        totalBets: 89,
        totalAmount: 125000,
        currentLimit: 200000,
        usagePercent: 62.5,
        riskLevel: 'safe',
        currentPayout: 90,
        potentialPayout: 11250000,
      },
      {
        number: '56',
        betType: '2ตัวล่าง',
        totalBets: 134,
        totalAmount: 198000,
        currentLimit: 220000,
        usagePercent: 90.0,
        riskLevel: 'danger',
        currentPayout: 75,
        potentialPayout: 14850000,
      },
      {
        number: '78',
        betType: '2ตัวล่าง',
        totalBets: 67,
        totalAmount: 89000,
        currentLimit: 200000,
        usagePercent: 44.5,
        riskLevel: 'safe',
        currentPayout: 90,
        potentialPayout: 8010000,
      },
    ];
    setRiskData(mockData);
  };

  const filteredData = riskData.filter(item => {
    const matchRisk = filterRiskLevel === 'all' || item.riskLevel === filterRiskLevel;
    const matchType = filterBetType === 'all' || item.betType === filterBetType;
    return matchRisk && matchType;
  });

  const getRiskBadge = (level: string) => {
    const styles = {
      safe: { bg: 'bg-green-100', text: 'text-green-700', icon: <Shield size={14} />, label: 'ปลอดภัย' },
      warning: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <AlertTriangle size={14} />, label: 'เตือน' },
      danger: { bg: 'bg-orange-100', text: 'text-orange-700', icon: <AlertTriangle size={14} />, label: 'อันตราย' },
      critical: { bg: 'bg-red-100', text: 'text-red-700', icon: <AlertTriangle size={14} />, label: 'วิกฤต' },
    };
    const style = styles[level as keyof typeof styles] || styles.safe;
    return (
      <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${style.bg} ${style.text}`}>
        {style.icon}
        {style.label}
      </span>
    );
  };

  const getProgressBarColor = (level: string) => {
    const colors = {
      safe: 'bg-green-500',
      warning: 'bg-yellow-500',
      danger: 'bg-orange-500',
      critical: 'bg-red-500',
    };
    return colors[level as keyof typeof colors] || colors.safe;
  };

  const stats = {
    totalNumbers: riskData.length,
    criticalCount: riskData.filter(d => d.riskLevel === 'critical').length,
    dangerCount: riskData.filter(d => d.riskLevel === 'danger').length,
    warningCount: riskData.filter(d => d.riskLevel === 'warning').length,
    totalExposure: riskData.reduce((sum, d) => sum + d.potentialPayout, 0),
    totalBets: riskData.reduce((sum, d) => sum + d.totalAmount, 0),
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">⚡ Risk Management Real-time</h1>
            <p className="text-gray-600 mt-1">ติดตามความเสี่ยงแบบเรียลไทม์</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-lg shadow border border-gray-200">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-4 h-4"
              />
              <Activity size={18} className={autoRefresh ? 'text-green-500' : 'text-gray-400'} />
              <span className="text-sm font-bold text-gray-700">Auto Refresh (3s)</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle size={24} className="text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">วิกฤต</p>
                <p className="text-2xl font-bold text-red-600">{stats.criticalCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <AlertTriangle size={24} className="text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">อันตราย</p>
                <p className="text-2xl font-bold text-orange-600">{stats.dangerCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <AlertTriangle size={24} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">เตือน</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.warningCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <DollarSign size={24} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Exposure รวม</p>
                <p className="text-lg font-bold text-purple-600">฿{(stats.totalExposure / 1000000).toFixed(1)}M</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <select
              value={filterRiskLevel}
              onChange={(e) => setFilterRiskLevel(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            >
              <option value="all">ระดับความเสี่ยงทั้งหมด</option>
              <option value="critical">🔴 วิกฤต</option>
              <option value="danger">🟠 อันตราย</option>
              <option value="warning">🟡 เตือน</option>
              <option value="safe">🟢 ปลอดภัย</option>
            </select>
            <select
              value={filterBetType}
              onChange={(e) => setFilterBetType(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            >
              <option value="all">ประเภททั้งหมด</option>
              <option value="3ตัวบน">3ตัวบน</option>
              <option value="3ตัวโต๊ด">3ตัวโต๊ด</option>
              <option value="2ตัวบน">2ตัวบน</option>
              <option value="2ตัวล่าง">2ตัวล่าง</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-red-100 to-orange-100 border-b-2 border-red-300">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">เลข</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">ประเภท</th>
                  <th className="px-4 py-3 text-right font-bold text-gray-700">ยอดแทง</th>
                  <th className="px-4 py-3 text-right font-bold text-gray-700">ลิมิต</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-700">การใช้งาน</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-700">อัตราจ่าย</th>
                  <th className="px-4 py-3 text-right font-bold text-gray-700">Exposure</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-700">ระดับเสี่ยง</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-red-50 transition-colors">
                    <td className="px-4 py-4">
                      <span className="font-mono text-2xl font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded">
                        {item.number}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">
                        {item.betType}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <p className="font-bold text-gray-900">฿{item.totalAmount.toLocaleString()}</p>
                      <p className="text-xs text-gray-600">{item.totalBets} โพย</p>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <p className="font-bold text-blue-600">฿{item.currentLimit.toLocaleString()}</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="w-full">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-gray-700">{item.usagePercent.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div 
                            className={`h-full ${getProgressBarColor(item.riskLevel)} transition-all duration-300`}
                            style={{ width: `${Math.min(item.usagePercent, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Zap size={16} className="text-yellow-500" />
                        <span className="font-bold text-lg text-gray-900">{item.currentPayout}x</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <p className="font-bold text-red-600">฿{(item.potentialPayout / 1000000).toFixed(2)}M</p>
                    </td>
                    <td className="px-4 py-4 text-center">
                      {getRiskBadge(item.riskLevel)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Target size={20} className="text-red-600" />
              เลขเสี่ยงสูงสุด Top 5
            </h3>
            <div className="space-y-3">
              {[...riskData]
                .sort((a, b) => b.usagePercent - a.usagePercent)
                .slice(0, 5)
                .map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-gray-400">#{idx + 1}</span>
                      <div>
                        <p className="font-mono text-xl font-bold text-gray-900">{item.number}</p>
                        <p className="text-xs text-gray-600">{item.betType}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-600">{item.usagePercent.toFixed(1)}%</p>
                      {getRiskBadge(item.riskLevel)}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-purple-600" />
              Exposure สูงสุด Top 5
            </h3>
            <div className="space-y-3">
              {[...riskData]
                .sort((a, b) => b.potentialPayout - a.potentialPayout)
                .slice(0, 5)
                .map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-gray-400">#{idx + 1}</span>
                      <div>
                        <p className="font-mono text-xl font-bold text-gray-900">{item.number}</p>
                        <p className="text-xs text-gray-600">{item.betType}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-purple-600">฿{(item.potentialPayout / 1000000).toFixed(2)}M</p>
                      <p className="text-xs text-gray-600">อัตรา {item.currentPayout}x</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl shadow-lg p-6 border-2 border-red-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Shield size={20} className="text-red-600" />
            สรุปภาพรวมความเสี่ยง
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign size={18} className="text-blue-600" />
                <p className="text-sm text-gray-600">ยอดแทงรวม</p>
              </div>
              <p className="text-2xl font-bold text-blue-600">฿{stats.totalBets.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={18} className="text-purple-600" />
                <p className="text-sm text-gray-600">Exposure รวม</p>
              </div>
              <p className="text-2xl font-bold text-purple-600">฿{(stats.totalExposure / 1000000).toFixed(1)}M</p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Percent size={18} className="text-green-600" />
                <p className="text-sm text-gray-600">Exposure Ratio</p>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {((stats.totalExposure / stats.totalBets) * 100).toFixed(0)}x
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
