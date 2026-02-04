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
  AlertCircle,
  Edit,
  Save,
  X,
  Grid3x3,
  Sliders
} from 'lucide-react';
import { riskAPI } from '../src/services/api';

// ============================================
// TYPE DEFINITIONS
// ============================================
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
    warning: number;
    danger: number;
    reject: number;
  };
  autoStepDown: boolean;
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
  manualPayout?: number;
}

export default function EnhancedRiskManagement() {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedBetType, setSelectedBetType] = useState<string>('2top');
  const [riskNumbers, setRiskNumbers] = useState<NumberRisk[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showManualControl, setShowManualControl] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Manual Control States
  const [manualNumber, setManualNumber] = useState('');
  const [manualAction, setManualAction] = useState<'close' | 'limit'>('close');
  const [manualPayout, setManualPayout] = useState('');
  
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
    },
    autoStepDown: true
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

  const loadRiskData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [numbers, configData] = await Promise.all([
        riskAPI.getNumbers(selectedBetType),
        riskAPI.getConfig()
      ]);

      // Update config from API
      setConfig({
        initialCapital: configData.initialCapital,
        totalSales: configData.currentCapital - configData.initialCapital,
        allocations: configData.allocations,
        payouts: configData.payouts,
        thresholds: {
          warning: configData.warningThreshold,
          danger: configData.dangerThreshold,
          reject: configData.rejectThreshold
        },
        autoStepDown: configData.autoStepDown
      });

      // Map API numbers to local format
      const mappedNumbers = numbers.map(n => ({
        number: n.number,
        betType: n.betType,
        totalBet: n.totalBet,
        maxLimit: n.maxLimit,
        usagePercent: n.usagePercent,
        status: n.status as 'safe' | 'warning' | 'danger' | 'blocked',
        currentPayout: n.currentPayout,
        potentialLoss: n.totalBet * n.currentPayout,
        betCount: 0, // Add to API if needed
        autoBlocked: n.manualClosed,
        manualPayout: n.manualLimit
      }));

      setRiskNumbers(mappedNumbers.sort((a, b) => b.usagePercent - a.usagePercent));
      setLoading(false);
    } catch (err) {
      console.error('Failed to load risk data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load risk data');
      setLoading(false);
    }
  };

  const handleCloseNumber = async (number: string) => {
    try {
      await riskAPI.closeNumber(number, selectedBetType);
      alert('ปิดรับเลขสำเร็จ!');
      await loadRiskData();
    } catch (err) {
      alert('เกิดข้อผิดพลาด: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleOpenNumber = async (number: string) => {
    try {
      await riskAPI.openNumber(number, selectedBetType);
      alert('เปิดรับเลขสำเร็จ!');
      await loadRiskData();
    } catch (err) {
      alert('เกิดข้อผิดพลาด: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleSetManualLimit = async () => {
    if (!manualNumber || !manualPayout) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    try {
      await riskAPI.setManualLimit(manualNumber, selectedBetType, parseFloat(manualPayout));
      alert('ตั้งลิมิตสำเร็จ!');
      setManualNumber('');
      setManualPayout('');
      setShowManualControl(false);
      await loadRiskData();
    } catch (err) {
      alert('เกิดข้อผิดพลาด: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleUpdateConfig = async () => {
    try {
      await riskAPI.updateConfig({
        initialCapital: config.initialCapital,
        warningThreshold: config.thresholds.warning,
        dangerThreshold: config.thresholds.danger,
        rejectThreshold: config.thresholds.reject,
        allocations: config.allocations,
        payouts: config.payouts,
        autoStepDown: config.autoStepDown
      });
      alert('อัพเดทการตั้งค่าสำเร็จ!');
      setShowSettings(false);
      await loadRiskData();
    } catch (err) {
      alert('เกิดข้อผิดพลาด: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
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

  const handleManualControl = () => {
    if (!manualNumber) {
      alert('กรุณากรอกเลข');
      return;
    }

    if (manualAction === 'close') {
      setRiskNumbers(prev => prev.map(risk => {
        if (risk.number === manualNumber) {
          return {
            ...risk,
            status: 'blocked',
            currentPayout: 0,
            autoBlocked: false
          };
        }
        return risk;
      }));
      alert(`ปิดรับเลข ${manualNumber} แล้ว`);
    } else {
      const newPayout = parseFloat(manualPayout);
      if (isNaN(newPayout) || newPayout < 0) {
        alert('กรุณากรอกอัตราจ่ายที่ถูกต้อง');
        return;
      }
      
      setRiskNumbers(prev => prev.map(risk => {
        if (risk.number === manualNumber) {
          return {
            ...risk,
            currentPayout: newPayout,
            manualPayout: newPayout,
            autoBlocked: false
          };
        }
        return risk;
      }));
      alert(`ตั้งอัตราจ่ายเลข ${manualNumber} เป็น ${newPayout}x แล้ว`);
    }

    setManualNumber('');
    setManualPayout('');
    setShowManualControl(false);
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

  const getHeatmapColor = (usagePercent: number) => {
    if (usagePercent === 0) return 'bg-gray-100';
    if (usagePercent >= 85) return 'bg-red-600';
    if (usagePercent >= 70) return 'bg-orange-500';
    if (usagePercent >= 50) return 'bg-yellow-400';
    if (usagePercent >= 30) return 'bg-green-400';
    return 'bg-green-200';
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
          <div className="flex gap-2 flex-wrap">
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
              onClick={() => setShowManualControl(!showManualControl)}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-purple-700 transition-all"
            >
              <Edit size={18} />
              สั่งการด้วยมือ
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

        {/* Manual Control Panel */}
        {showManualControl && (
          <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Edit size={24} className="text-purple-600" />
                <h2 className="text-xl font-bold text-gray-900">สั่งการด้วยมือ (Manual Control)</h2>
              </div>
              <button onClick={() => setShowManualControl(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">เลข</label>
                <input
                  type="text"
                  value={manualNumber}
                  onChange={(e) => setManualNumber(e.target.value)}
                  placeholder="กรอกเลข เช่น 123, 45"
                  className="w-full px-4 py-2 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">การกระทำ</label>
                <select
                  value={manualAction}
                  onChange={(e) => setManualAction(e.target.value as 'close' | 'limit')}
                  className="w-full px-4 py-2 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="close">ปิดรับ (Close Number)</option>
                  <option value="limit">อั้นจ่าย (Limit Payout)</option>
                </select>
              </div>

              {manualAction === 'limit' && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">อัตราจ่ายใหม่</label>
                  <input
                    type="number"
                    value={manualPayout}
                    onChange={(e) => setManualPayout(e.target.value)}
                    placeholder="เช่น 450"
                    className="w-full px-4 py-2 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              )}
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={handleManualControl}
                className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-700 transition-all"
              >
                <Save size={18} />
                ยืนยันการสั่งการ
              </button>
              <button
                onClick={() => {
                  setManualNumber('');
                  setManualPayout('');
                }}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-all"
              >
                ล้างข้อมูล
              </button>
            </div>

            <div className="mt-4 p-3 bg-purple-100 rounded-lg">
              <p className="text-sm text-purple-900">
                <strong>หมายเหตุ:</strong> การสั่งการด้วยมือจะ <strong>Override (ทับ)</strong> ระบบคำนวณอัตโนมัติ
              </p>
            </div>
          </div>
        )}

        {/* Risk Config Panel */}
        {showSettings && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sliders size={24} className="text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">ตั้งค่าสูตร Risk (Risk Config)</h2>
              </div>
              <button onClick={() => setShowSettings(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Capital Input */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">เงินทุนหน้าตัก (Initial Capital)</label>
                  <input
                    type="number"
                    value={config.initialCapital}
                    onChange={(e) => setConfig({...config, initialCapital: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">ยอดขายรวม (Total Sales)</label>
                  <input
                    type="number"
                    value={config.totalSales}
                    onChange={(e) => setConfig({...config, totalSales: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Allocation Sliders */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">สัดส่วนความเสี่ยง (Allocation %)</h3>
                <div className="space-y-3">
                  {Object.entries(config.allocations).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-sm font-bold text-gray-700">{getBetTypeLabel(key)}</label>
                        <span className="text-sm font-bold text-blue-600">{value}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={value}
                        onChange={(e) => setConfig({
                          ...config,
                          allocations: {...config.allocations, [key]: Number(e.target.value)}
                        })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Auto Step-Down Switch */}
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <p className="font-bold text-gray-900">ระบบ Auto Step-Down Payout</p>
                  <p className="text-sm text-gray-600">ปรับอัตราจ่ายอัตโนมัติตามความเสี่ยง</p>
                </div>
                <button
                  onClick={() => setConfig({...config, autoStepDown: !config.autoStepDown})}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    config.autoStepDown ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      config.autoStepDown ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Thresholds */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">เกณฑ์ความเสี่ยง (Thresholds)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-yellow-700 mb-2">เตือน (Warning %)</label>
                    <input
                      type="number"
                      value={config.thresholds.warning}
                      onChange={(e) => setConfig({
                        ...config,
                        thresholds: {...config.thresholds, warning: Number(e.target.value)}
                      })}
                      className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-orange-700 mb-2">อันตราย (Danger %)</label>
                    <input
                      type="number"
                      value={config.thresholds.danger}
                      onChange={(e) => setConfig({
                        ...config,
                        thresholds: {...config.thresholds, danger: Number(e.target.value)}
                      })}
                      className="w-full px-4 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-red-700 mb-2">ปิดรับ (Reject %)</label>
                    <input
                      type="number"
                      value={config.thresholds.reject}
                      onChange={(e) => setConfig({
                        ...config,
                        thresholds: {...config.thresholds, reject: Number(e.target.value)}
                      })}
                      className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bet Type Selector */}
        <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900">เลือกประเภทหวย</h3>
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`flex items-center gap-2 px-3 py-1 rounded-lg font-bold transition-all ${
                showHeatmap ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <Grid3x3 size={16} />
              Heatmap
            </button>
          </div>
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

        {/* Heatmap Grid (for 2-digit) */}
        {showHeatmap && selectedBetType.includes('2') && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">🔥 Heatmap Grid - {getBetTypeLabel(selectedBetType)}</h2>
            <div className="grid grid-cols-10 gap-1">
              {riskNumbers.map((risk) => (
                <div
                  key={risk.number}
                  className={`aspect-square flex flex-col items-center justify-center rounded cursor-pointer hover:scale-110 transition-transform ${getHeatmapColor(risk.usagePercent)} ${
                    risk.status === 'blocked' ? 'opacity-50' : ''
                  }`}
                  title={`${risk.number}: ${risk.usagePercent.toFixed(1)}% - ${risk.status}`}
                  onClick={() => toggleNumberBlock(risk.number)}
                >
                  <span className="text-xs font-bold text-white">{risk.number}</span>
                  {risk.totalBet > 0 && (
                    <span className="text-[8px] text-white">{risk.usagePercent.toFixed(0)}%</span>
                  )}
                  {risk.status === 'blocked' && <Lock size={10} className="text-white" />}
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-gray-100 rounded"></div>
                <span>0%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-green-200 rounded"></div>
                <span>&lt;30%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-green-400 rounded"></div>
                <span>30-50%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                <span>50-70%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                <span>70-85%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-red-600 rounded"></div>
                <span>&gt;85%</span>
              </div>
            </div>
          </div>
        )}

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
                        {risk.manualPayout && (
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Manual</span>
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
              <p className="font-bold text-blue-900 mb-1">ระบบทำงานอัตโนมัติ + สั่งการด้วยมือ:</p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>Auto Mode:</strong> ระบบปรับอัตราจ่ายอัตโนมัติตามเกณฑ์ที่ตั้งไว้</li>
                <li>• <strong>Manual Control:</strong> สั่งปิดรับหรืออั้นจ่ายเลขด้วยตัวเอง (Override ระบบอัตโนมัติ)</li>
                <li>• <strong>Heatmap:</strong> ดูภาพรวมความเสี่ยงแบบ 10x10 Grid (สำหรับ 2 ตัว)</li>
                <li>• <strong>Risk Config:</strong> ปรับทุน, สัดส่วน, เกณฑ์ได้ตามต้องการ</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
