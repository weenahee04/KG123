/**
 * Risk Logic Simulator
 * 
 * Interactive tool for testing and tweaking the Dynamic Risk Formula
 * Allows admins to customize budget allocations and see real-time impacts
 */

import React, { useState, useEffect, useRef } from 'react';
import { Calculator, TrendingUp, AlertTriangle, CheckCircle, XCircle, Settings, DollarSign, Percent, Play, Pause, RotateCcw, Bot } from 'lucide-react';
import { BotSimulationEngine } from '../src/services/botSimulationEngine';
import { SimulationStats, SimulationEvent, BotSimulationConfig } from '../src/types/bot-simulation';
import { BetTrackingState, GRID_CONFIGS } from '../src/types/bet-tracking';
import { BetType as TrackingBetType } from '../src/config/risk-constants';
import { initializeBetTrackingState, generateGridData } from '../src/services/betTrackingService';

interface RiskLogicSimulatorProps {
  onBack: () => void;
}

type BetType = 'TOP3' | 'TOAD3' | 'TOP2' | 'BOTTOM2';

interface AllocationConfig {
  TOP3: number;
  TOAD3: number;
  TOP2: number;
  BOTTOM2: number;
}

interface PayoutConfig {
  TOP3: { base: number; tier1: number; tier2: number };
  TOAD3: { base: number; tier1: number; tier2: number };
  TOP2: { base: number; tier1: number; tier2: number };
  BOTTOM2: { base: number; tier1: number; tier2: number };
}

interface SimulationResult {
  typePot: number;
  maxLimit: number;
  totalBetOnNumber: number;
  usageRatio: number;
  usagePercent: number;
  status: 'safe' | 'warning' | 'danger' | 'rejected';
  decision: 'ACCEPTED' | 'REJECTED';
  actualPayout: number;
  potentialWinnings: number;
  message: string;
}

export const RiskLogicSimulator: React.FC<RiskLogicSimulatorProps> = ({ onBack }) => {
  // Configuration State
  const [initialCapital, setInitialCapital] = useState<number>(500000);
  const [totalSales, setTotalSales] = useState<number>(0);
  
  // Allocation Settings (%)
  const [allocations, setAllocations] = useState<AllocationConfig>({
    TOP3: 30,
    TOAD3: 20,
    TOP2: 20,
    BOTTOM2: 30,
  });

  // Payout Rates
  const [payouts, setPayouts] = useState<PayoutConfig>({
    TOP3: { base: 800, tier1: 650, tier2: 500 },
    TOAD3: { base: 150, tier1: 120, tier2: 90 },
    TOP2: { base: 90, tier1: 75, tier2: 60 },
    BOTTOM2: { base: 90, tier1: 75, tier2: 60 },
  });

  // Test Input State
  const [selectedBetType, setSelectedBetType] = useState<BetType>('TOP3');
  const [betNumber, setBetNumber] = useState<string>('123');
  const [betAmount, setBetAmount] = useState<number>(1000);
  const [currentBetOnNumber, setCurrentBetOnNumber] = useState<number>(0);

  // Result State
  const [result, setResult] = useState<SimulationResult | null>(null);

  // Bot Simulation State
  const [botConfig, setBotConfig] = useState({
    numberOfBots: 10,
    betIntervalMs: 500,
    behaviorProfile: 'mixed' as 'conservative' | 'moderate' | 'aggressive' | 'whale' | 'mixed',
  });
  const [botStats, setBotStats] = useState<SimulationStats>({
    totalBots: 0,
    activeBots: 0,
    totalBets: 0,
    totalVolume: 0,
    totalCommission: 0,
    averageBetSize: 0,
    betsPerMinute: 0,
    currentDailyVolume: 0,
    targetDailyVolume: 0,
    progressPercent: 0,
    riskMetrics: {
      numbersAtRisk: 0,
      highestUsagePercent: 0,
      highestUsageNumber: '',
      rejectedBets: 0,
    },
    startTime: new Date(),
    elapsedTime: 0,
  });
  const [botEvents, setBotEvents] = useState<SimulationEvent[]>([]);
  const [recentBets, setRecentBets] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showBotPanel, setShowBotPanel] = useState(false);
  const [betTracking, setBetTracking] = useState<BetTrackingState>(initializeBetTrackingState());
  const [selectedTrackingType, setSelectedTrackingType] = useState<TrackingBetType>('TOP3');
  const [dynamicCapital, setDynamicCapital] = useState<number>(initialCapital);
  const [netSales, setNetSales] = useState<number>(0);

  const engineRef = useRef<BotSimulationEngine | null>(null);
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate total allocation
  const totalAllocation = Object.values(allocations).reduce((sum: number, val: number) => sum + val, 0);

  // Calculate Simulation
  const calculateSimulation = (): SimulationResult => {
    const currentCapital = initialCapital + totalSales;
    const allocationRate = allocations[selectedBetType];
    const payoutConfig = payouts[selectedBetType];

    // Step 1: Calculate Type Pot
    const typePot = (currentCapital * allocationRate) / 100;

    // Step 2: Calculate Max Limit
    const maxLimit = typePot / payoutConfig.base;

    // Step 3: Calculate Usage
    const totalBetOnNumber = currentBetOnNumber + betAmount;
    const usageRatio = totalBetOnNumber / maxLimit;
    const usagePercent = usageRatio * 100;

    // Step 4: Determine Status & Actual Payout
    let status: 'safe' | 'warning' | 'danger' | 'rejected';
    let decision: 'ACCEPTED' | 'REJECTED';
    let actualPayout: number;
    let message: string;

    if (usageRatio > 1.0) {
      status = 'rejected';
      decision = 'REJECTED';
      actualPayout = 0;
      message = `เกินลิมิต! ยอดแทงรวม ${totalBetOnNumber.toLocaleString()} บาท เกินลิมิตสูงสุด ${maxLimit.toLocaleString()} บาท`;
    } else if (usageRatio > 0.85) {
      status = 'danger';
      decision = 'ACCEPTED';
      actualPayout = payoutConfig.tier2;
      message = `รับแทงได้ แต่ลดอัตราจ่ายเหลือ ${actualPayout} เท่า (โซนอันตราย ${usagePercent.toFixed(1)}%)`;
    } else if (usageRatio > 0.70) {
      status = 'warning';
      decision = 'ACCEPTED';
      actualPayout = payoutConfig.tier1;
      message = `รับแทงได้ แต่ลดอัตราจ่ายเหลือ ${actualPayout} เท่า (โซนเตือน ${usagePercent.toFixed(1)}%)`;
    } else {
      status = 'safe';
      decision = 'ACCEPTED';
      actualPayout = payoutConfig.base;
      message = `รับแทงได้เต็มอัตรา ${actualPayout} เท่า (โซนปลอดภัย ${usagePercent.toFixed(1)}%)`;
    }

    const potentialWinnings = betAmount * actualPayout;

    return {
      typePot,
      maxLimit,
      totalBetOnNumber,
      usageRatio,
      usagePercent,
      status,
      decision,
      actualPayout,
      potentialWinnings,
      message,
    };
  };

  // Recalculate on any input change
  useEffect(() => {
    setResult(calculateSimulation());
  }, [initialCapital, totalSales, allocations, payouts, selectedBetType, betAmount, currentBetOnNumber]);

  const updateAllocation = (type: BetType, value: number) => {
    setAllocations(prev => ({ ...prev, [type]: value }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'danger': return 'bg-orange-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getBetTypeLabel = (type: BetType) => {
    switch (type) {
      case 'TOP3': return '3 ตัวบน';
      case 'TOAD3': return '3 ตัวโต๊ด';
      case 'TOP2': return '2 ตัวบน';
      case 'BOTTOM2': return '2 ตัวล่าง';
    }
  };

  // Initialize bot engine
  useEffect(() => {
    if (!engineRef.current) {
      const defaultConfig: BotSimulationConfig = {
        enabled: false,
        numberOfBots: botConfig.numberOfBots,
        dailyTargetVolume: 1000000,
        speedMultiplier: 60,
        behaviorDistribution: { conservative: 40, moderate: 35, aggressive: 20, whale: 5 },
        referrerRate: 60,
        betTypeDistribution: { TOP3: 30, TOAD3: 20, TOP2: 25, BOTTOM2: 25 },
        peakHours: [12, 18, 20, 21],
      };
      engineRef.current = new BotSimulationEngine(defaultConfig, initializeBetTrackingState(), initialCapital);
    }
  }, []);

  // Update engine when capital changes
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.updateInitialCapital(initialCapital);
    }
  }, [initialCapital]);

  // Poll for updates when running
  useEffect(() => {
    if (isRunning && engineRef.current) {
      updateIntervalRef.current = setInterval(() => {
        const stats = engineRef.current!.getStats();
        const events = engineRef.current!.getEvents();
        const tracking = engineRef.current!.getTrackingState();
        const capital = engineRef.current!.getCurrentCapital();
        const sales = engineRef.current!.getTotalNetSales();
        const bets = engineRef.current!.getRecentBets(50);

        setBotStats(stats);
        setBotEvents(events.slice(-50)); // Keep last 50 events
        setRecentBets(bets);
        setBetTracking(tracking);
        setDynamicCapital(capital);
        setNetSales(sales);
        setTotalSales(sales); // Update main simulator
      }, 200);
    } else {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
        updateIntervalRef.current = null;
      }
    }

    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, [isRunning]);

  const handleBotStart = () => {
    if (engineRef.current) {
      engineRef.current.start();
      setIsRunning(true);
    }
  };

  const handleBotStop = () => {
    if (engineRef.current) {
      engineRef.current.stop();
      setIsRunning(false);
    }
  };

  const handleBotReset = () => {
    if (engineRef.current) {
      engineRef.current.stop();
      setIsRunning(false);
    }
    const defaultConfig: BotSimulationConfig = {
      enabled: false,
      numberOfBots: botConfig.numberOfBots,
      dailyTargetVolume: 1000000,
      speedMultiplier: 60,
      behaviorDistribution: { conservative: 40, moderate: 35, aggressive: 20, whale: 5 },
      referrerRate: 60,
      betTypeDistribution: { TOP3: 30, TOAD3: 20, TOP2: 25, BOTTOM2: 25 },
      peakHours: [12, 18, 20, 21],
    };
    engineRef.current = new BotSimulationEngine(defaultConfig, initializeBetTrackingState(), initialCapital);
    setBotStats({
      totalBots: 0,
      activeBots: 0,
      totalBets: 0,
      totalVolume: 0,
      totalCommission: 0,
      averageBetSize: 0,
      betsPerMinute: 0,
      currentDailyVolume: 0,
      targetDailyVolume: 0,
      progressPercent: 0,
      riskMetrics: {
        numbersAtRisk: 0,
        highestUsagePercent: 0,
        highestUsageNumber: '',
        rejectedBets: 0,
      },
      startTime: new Date(),
      elapsedTime: 0,
    });
    setBotEvents([]);
    setRecentBets([]);
    setDynamicCapital(initialCapital);
    setNetSales(0);
    setTotalSales(0);
  };

  const handleBotConfigUpdate = (key: string, value: any) => {
    setBotConfig(prev => ({ ...prev, [key]: value }));
    if (engineRef.current) {
      if (key === 'numberOfBots') {
        engineRef.current.updateConfig({ numberOfBots: value });
      } else if (key === 'betIntervalMs') {
        engineRef.current.updateConfig({ betIntervalMs: value });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={onBack}
              className="text-purple-600 hover:text-purple-800 mb-2 flex items-center gap-2"
            >
              ← กลับ
            </button>
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
              <Calculator size={32} className="text-purple-600" />
              Risk Logic Simulator
            </h1>
            <p className="text-gray-600 mt-1">ทดสอบและปรับแต่งสูตรบริหารความเสี่ยงแบบเรียลไทม์</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel A: Configuration */}
        <div className="lg:col-span-1 space-y-4">
          {/* Capital Settings */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign size={20} className="text-green-600" />
              เงินทุนและยอดขาย
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  เงินทุนเริ่มต้น (บาท)
                </label>
                <input
                  type="number"
                  value={initialCapital}
                  onChange={(e) => setInitialCapital(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 font-bold"
                  step="10000"
                />
                <p className="text-xs text-gray-500 mt-1">{initialCapital.toLocaleString()} บาท</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ยอดขายสุทธิสะสม (บาท)
                </label>
                <input
                  type="number"
                  value={totalSales}
                  onChange={(e) => setTotalSales(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 font-bold"
                  step="10000"
                />
                <p className="text-xs text-gray-500 mt-1">{totalSales.toLocaleString()} บาท</p>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-600">เงินทุนปัจจุบัน (รวม)</p>
                <p className="text-2xl font-black text-purple-700">
                  {(initialCapital + totalSales).toLocaleString()} บาท
                </p>
              </div>
            </div>
          </div>

          {/* Allocation Settings */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Percent size={20} className="text-blue-600" />
              สัดส่วนเงินทุน (Allocation)
            </h2>

            <div className="space-y-4">
              {/* 3 Digits Section */}
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs font-bold text-blue-900 mb-3">3 หลัก</p>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-sm font-medium text-gray-700">3 ตัวบน</label>
                      <span className="text-sm font-bold text-blue-700">{allocations.TOP3}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={allocations.TOP3}
                      onChange={(e) => updateAllocation('TOP3', Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-sm font-medium text-gray-700">3 ตัวโต๊ด</label>
                      <span className="text-sm font-bold text-purple-700">{allocations.TOAD3}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={allocations.TOAD3}
                      onChange={(e) => updateAllocation('TOAD3', Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* 2 Digits Section */}
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-xs font-bold text-green-900 mb-3">2 หลัก</p>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-sm font-medium text-gray-700">2 ตัวบน</label>
                      <span className="text-sm font-bold text-green-700">{allocations.TOP2}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={allocations.TOP2}
                      onChange={(e) => updateAllocation('TOP2', Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-sm font-medium text-gray-700">2 ตัวล่าง</label>
                      <span className="text-sm font-bold text-orange-700">{allocations.BOTTOM2}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={allocations.BOTTOM2}
                      onChange={(e) => updateAllocation('BOTTOM2', Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Total Allocation */}
              <div className={`p-3 rounded-lg border-2 ${
                totalAllocation === 100 ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
              }`}>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">รวมทั้งหมด:</span>
                  <span className={`text-xl font-black ${
                    totalAllocation === 100 ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {totalAllocation}%
                  </span>
                </div>
                {totalAllocation !== 100 && (
                  <p className="text-xs text-red-600 mt-1">⚠️ ควรรวมเป็น 100%</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Panel B & C: Test Form and Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Test Input Form */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Settings size={20} className="text-purple-600" />
              ทดสอบการแทง
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ประเภทการแทง</label>
                <select
                  value={selectedBetType}
                  onChange={(e) => setSelectedBetType(e.target.value as BetType)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="TOP3">3 ตัวบน (TOP3)</option>
                  <option value="TOAD3">3 ตัวโต๊ด (TOAD3)</option>
                  <option value="TOP2">2 ตัวบน (TOP2)</option>
                  <option value="BOTTOM2">2 ตัวล่าง (BOTTOM2)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">เลข</label>
                <input
                  type="text"
                  value={betNumber}
                  onChange={(e) => setBetNumber(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 font-bold text-center text-xl"
                  placeholder="123"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ยอดแทง (บาท)</label>
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 font-bold"
                  step="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ยอดแทงเดิมบนเลขนี้ (บาท)
                </label>
                <input
                  type="number"
                  value={currentBetOnNumber}
                  onChange={(e) => setCurrentBetOnNumber(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 font-bold"
                  step="100"
                />
              </div>
            </div>
          </div>

          {/* Results Dashboard */}
          {result && (
            <div className="space-y-4">
              {/* Decision Badge */}
              <div className={`rounded-xl shadow-lg p-6 border-2 ${
                result.decision === 'ACCEPTED' 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-500' 
                  : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-500'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {result.decision === 'ACCEPTED' ? (
                      <CheckCircle size={32} className="text-green-600" />
                    ) : (
                      <XCircle size={32} className="text-red-600" />
                    )}
                    <div>
                      <p className="text-sm text-gray-600">ผลการตัดสิน</p>
                      <p className={`text-3xl font-black ${
                        result.decision === 'ACCEPTED' ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {result.decision}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">อัตราจ่าย</p>
                    <p className={`text-3xl font-black ${
                      result.decision === 'ACCEPTED' ? 'text-green-700' : 'text-gray-400'
                    }`}>
                      {result.actualPayout}x
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-700">{result.message}</p>
                </div>
              </div>

              {/* Detailed Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <p className="text-xs text-gray-500 mb-1">กระเป๋าเงินประเภทนี้</p>
                  <p className="text-2xl font-bold text-blue-700">{result.typePot.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">บาท</p>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <p className="text-xs text-gray-500 mb-1">ลิมิตสูงสุด/เลข</p>
                  <p className="text-2xl font-bold text-purple-700">{result.maxLimit.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">บาท</p>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <p className="text-xs text-gray-500 mb-1">ยอดแทงรวมบนเลขนี้</p>
                  <p className="text-2xl font-bold text-orange-700">{result.totalBetOnNumber.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">บาท</p>
                </div>
              </div>

              {/* Usage Bar */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <TrendingUp size={20} className="text-purple-600" />
                    การใช้งานลิมิต
                  </h3>
                  <span className={`text-2xl font-black ${
                    result.status === 'safe' ? 'text-green-600' :
                    result.status === 'warning' ? 'text-yellow-600' :
                    result.status === 'danger' ? 'text-orange-600' :
                    'text-red-600'
                  }`}>
                    {result.usagePercent.toFixed(1)}%
                  </span>
                </div>

                <div className="relative w-full h-8 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${getStatusColor(result.status)}`}
                    style={{ width: `${Math.min(result.usagePercent, 100)}%` }}
                  />
                  
                  {/* Threshold Markers */}
                  <div className="absolute top-0 left-[70%] w-0.5 h-full bg-yellow-300 opacity-50" />
                  <div className="absolute top-0 left-[85%] w-0.5 h-full bg-orange-400 opacity-50" />
                  <div className="absolute top-0 left-[100%] w-0.5 h-full bg-red-500 opacity-50" />
                </div>

                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>0%</span>
                  <span>70%</span>
                  <span>85%</span>
                  <span>100%</span>
                </div>

                <div className="grid grid-cols-4 gap-2 mt-4">
                  <div className="text-center p-2 bg-green-50 rounded border border-green-200">
                    <p className="text-xs text-green-700 font-bold">ปลอดภัย</p>
                    <p className="text-[10px] text-green-600">0-70%</p>
                  </div>
                  <div className="text-center p-2 bg-yellow-50 rounded border border-yellow-200">
                    <p className="text-xs text-yellow-700 font-bold">เตือน</p>
                    <p className="text-[10px] text-yellow-600">71-85%</p>
                  </div>
                  <div className="text-center p-2 bg-orange-50 rounded border border-orange-200">
                    <p className="text-xs text-orange-700 font-bold">อันตราย</p>
                    <p className="text-[10px] text-orange-600">86-100%</p>
                  </div>
                  <div className="text-center p-2 bg-red-50 rounded border border-red-200">
                    <p className="text-xs text-red-700 font-bold">วิกฤต</p>
                    <p className="text-[10px] text-red-600">&gt;100%</p>
                  </div>
                </div>
              </div>

              {/* Potential Winnings */}
              {result.decision === 'ACCEPTED' && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-lg p-6 border-2 border-purple-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">เงินที่ต้องจ่ายหากถูกรางวัล</p>
                      <p className="text-4xl font-black text-purple-700">
                        {result.potentialWinnings.toLocaleString()} บาท
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {betAmount.toLocaleString()} × {result.actualPayout}
                      </p>
                    </div>
                    <AlertTriangle size={48} className="text-purple-400" />
                  </div>
                </div>
              )}

              {/* Formula Display */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-sm font-bold text-gray-800 mb-3">📐 สูตรที่ใช้คำนวณ:</h3>
                <div className="space-y-2 text-xs font-mono text-gray-700">
                  <p>1. TypePot = ({initialCapital.toLocaleString()} + {totalSales.toLocaleString()}) × {allocations[selectedBetType]}% = <span className="font-bold text-blue-600">{result.typePot.toLocaleString()}</span></p>
                  <p>2. MaxLimit = {result.typePot.toLocaleString()} ÷ {payouts[selectedBetType].base} = <span className="font-bold text-purple-600">{result.maxLimit.toLocaleString()}</span></p>
                  <p>3. TotalBet = {currentBetOnNumber.toLocaleString()} + {betAmount.toLocaleString()} = <span className="font-bold text-orange-600">{result.totalBetOnNumber.toLocaleString()}</span></p>
                  <p>4. Usage = {result.totalBetOnNumber.toLocaleString()} ÷ {result.maxLimit.toLocaleString()} = <span className="font-bold text-red-600">{result.usagePercent.toFixed(1)}%</span></p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bot Simulation Section */}
      <div className="max-w-7xl mx-auto mt-6">
        <button
          onClick={() => setShowBotPanel(!showBotPanel)}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-between mb-4"
        >
          <div className="flex items-center gap-3">
            <Bot size={24} />
            <span className="font-bold text-lg">🤖 Bot Simulation Testing</span>
          </div>
          <span className="text-sm">{showBotPanel ? '▼ ซ่อน' : '▶ แสดง'}</span>
        </button>

        {showBotPanel && (
          <div className="space-y-6">
            {/* Event Log (ล่าสุด) */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6 border-2 border-blue-300">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                📋 Event Log (ล่าสุด)
                {botEvents.length > 0 && (
                  <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full font-bold">
                    {botEvents.length}
                  </span>
                )}
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto bg-white rounded-lg p-3 border border-blue-200">
                {botEvents.slice(-10).reverse().map((event, idx) => {
                  const eventColors = {
                    'bet_placed': 'bg-green-50 border-green-200 text-green-800',
                    'bet_rejected': 'bg-red-50 border-red-200 text-red-800',
                    'limit_reached': 'bg-orange-50 border-orange-200 text-orange-800',
                    'bot_created': 'bg-blue-50 border-blue-200 text-blue-800',
                    'simulation_started': 'bg-purple-50 border-purple-200 text-purple-800',
                    'simulation_stopped': 'bg-gray-50 border-gray-200 text-gray-800',
                  };
                  
                  const eventIcons = {
                    'bet_placed': '✓',
                    'bet_rejected': '✗',
                    'limit_reached': '⚠️',
                    'bot_created': '🤖',
                    'simulation_started': '▶️',
                    'simulation_stopped': '⏸️',
                  };

                  return (
                    <div 
                      key={idx} 
                      className={`text-xs p-3 rounded-lg border ${eventColors[event.type] || 'bg-gray-50 border-gray-200'} transition-all hover:shadow-md`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-lg">{eventIcons[event.type] || '•'}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-xs uppercase">{event.type.replace(/_/g, ' ')}</span>
                            <span className="text-[10px] text-gray-500">
                              {new Date(event.timestamp).toLocaleTimeString('th-TH')}
                            </span>
                          </div>
                          <p className="text-xs">{event.message}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {botEvents.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-400 text-sm">ยังไม่มี Event</p>
                    <p className="text-gray-300 text-xs mt-1">กดปุ่ม "เริ่มจำลอง" เพื่อเริ่มต้น</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bot Controls */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Settings size={20} className="text-purple-600" />
                การตั้งค่าบอท
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    จำนวนบอท
                  </label>
                  <input
                    type="number"
                    value={botConfig.numberOfBots}
                    onChange={(e) => handleBotConfigUpdate('numberOfBots', Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    min="1"
                    max="100"
                    disabled={isRunning}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ความเร็ว (ms)
                  </label>
                  <input
                    type="number"
                    value={botConfig.betIntervalMs}
                    onChange={(e) => handleBotConfigUpdate('betIntervalMs', Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    min="100"
                    max="5000"
                    step="100"
                    disabled={isRunning}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    พฤติกรรม
                  </label>
                  <select
                    value={botConfig.behaviorProfile}
                    onChange={(e) => handleBotConfigUpdate('behaviorProfile', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    disabled={isRunning}
                  >
                    <option value="conservative">Conservative</option>
                    <option value="moderate">Moderate</option>
                    <option value="aggressive">Aggressive</option>
                    <option value="whale">Whale</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleBotStart}
                  disabled={isRunning}
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Play size={20} />
                  เริ่มจำลอง
                </button>
                <button
                  onClick={handleBotStop}
                  disabled={!isRunning}
                  className="flex-1 bg-orange-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Pause size={20} />
                  หยุดชั่วคราว
                </button>
                <button
                  onClick={handleBotReset}
                  className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-red-700 flex items-center justify-center gap-2"
                >
                  <RotateCcw size={20} />
                  รีเซ็ต
                </button>
              </div>
            </div>

            {/* Bot Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
                <p className="text-sm text-gray-600">การแทงทั้งหมด</p>
                <p className="text-2xl font-black text-blue-600">{botStats.totalBets}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
                <p className="text-sm text-gray-600">ยอดรวม</p>
                <p className="text-2xl font-black text-green-600">฿{botStats.totalVolume.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
                <p className="text-sm text-gray-600">ถูกปฏิเสธ</p>
                <p className="text-2xl font-black text-red-600">{botStats.riskMetrics.rejectedBets}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
                <p className="text-sm text-gray-600">Usage สูงสุด</p>
                <p className="text-2xl font-black text-orange-600">{botStats.riskMetrics.highestUsagePercent.toFixed(1)}%</p>
              </div>
            </div>

            {/* Current Limits (Dynamic Capital) */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-lg p-6 border-2 border-purple-300">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={20} className="text-purple-600" />
                <h3 className="text-lg font-bold text-gray-900">ลิมิตปัจจุบัน (คำนวณจากเงินทุนไดนามิก)</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-lg p-3 border border-purple-200">
                  <p className="text-xs text-gray-600">เงินทุนเริ่มต้น</p>
                  <p className="text-lg font-bold text-gray-800">฿{initialCapital.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-purple-200">
                  <p className="text-xs text-gray-600">ยอดขายสุทธิสะสม</p>
                  <p className="text-lg font-bold text-green-600">฿{netSales.toLocaleString()}</p>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-3 md:col-span-2">
                  <p className="text-xs opacity-90">เงินทุนไดนามิก (เริ่มต้น + ยอดขาย)</p>
                  <p className="text-2xl font-black">฿{dynamicCapital.toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(['TOP3', 'TOAD3', 'TOP2', 'BOTTOM2'] as BetType[]).map((type) => {
                  const allocationRate = allocations[type];
                  const payoutBase = payouts[type].base;
                  const typePot = (dynamicCapital * allocationRate) / 100;
                  const maxLimit = typePot / payoutBase;

                  return (
                    <div key={type} className="bg-white rounded-lg p-3 border border-gray-200 hover:border-purple-400 transition-colors">
                      <p className="text-xs font-bold text-purple-600 mb-1">{getBetTypeLabel(type)}</p>
                      <p className="text-xs text-gray-500 mb-1">Pot: ฿{typePot.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                      <p className="text-lg font-black text-gray-800">฿{maxLimit.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                      <p className="text-[10px] text-gray-400">ลิมิตต่อเลข</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bet Tracking Grid */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">ตารางติดตามยอดแทง</h3>
                <div className="flex gap-2">
                  {(['TOP3', 'TOAD3', 'TOP2', 'BOTTOM2'] as TrackingBetType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedTrackingType(type)}
                      className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
                        selectedTrackingType === type
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {getBetTypeLabel(type as BetType)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                {(() => {
                  if (!betTracking || !betTracking.tables || !betTracking.tables[selectedTrackingType]) {
                    return (
                      <div className="text-center py-8 text-gray-400">
                        <p>กำลังโหลดข้อมูล...</p>
                      </div>
                    );
                  }

                  const gridData = generateGridData(betTracking, selectedTrackingType);
                  const config = GRID_CONFIGS[selectedTrackingType];
                  const flatGrid = gridData.flat();

                  return (
                    <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${config.columns}, minmax(0, 1fr))` }}>
                      {flatGrid.map((cell, idx) => {
                        const summary = cell as any;
                        const bgColor = 
                          summary.usagePercent >= 100 ? 'bg-red-500 text-white' :
                          summary.usagePercent >= 85 ? 'bg-orange-400 text-white' :
                          summary.usagePercent >= 70 ? 'bg-yellow-300' :
                          summary.usagePercent > 0 ? 'bg-green-200' : 'bg-gray-100';

                        return (
                          <div
                            key={idx}
                            className={`${bgColor} p-2 rounded text-center text-xs font-bold border border-gray-300`}
                            title={`เลข: ${summary.number}\nยอดแทง: ${summary.amount?.toLocaleString() || 0} บาท\nUsage: ${summary.usagePercent?.toFixed(1) || 0}%`}
                          >
                            <div>{summary.number}</div>
                            <div className="text-[10px]">{summary.usagePercent?.toFixed(0) || 0}%</div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Bet Tracking Table (Real-time) */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                📊 ตารางเก็บยอดแทง (Real-time)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gradient-to-r from-purple-100 to-pink-100 border-b-2 border-purple-300">
                    <tr>
                      <th className="px-3 py-2 text-left font-bold text-gray-700">เวลา</th>
                      <th className="px-3 py-2 text-left font-bold text-gray-700">ผู้แทง</th>
                      <th className="px-3 py-2 text-left font-bold text-gray-700">ประเภท</th>
                      <th className="px-3 py-2 text-center font-bold text-gray-700">เลข</th>
                      <th className="px-3 py-2 text-right font-bold text-gray-700">ยอดแทง</th>
                      <th className="px-3 py-2 text-right font-bold text-gray-700">ค่าคอม</th>
                      <th className="px-3 py-2 text-right font-bold text-gray-700">ยอดสุทธิ</th>
                      <th className="px-3 py-2 text-center font-bold text-gray-700">สถานะ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentBets.slice().reverse().map((bet, idx) => (
                      <tr key={idx} className="hover:bg-purple-50 transition-colors">
                        <td className="px-3 py-2 text-xs text-gray-600">
                          {new Date(bet.timestamp).toLocaleTimeString('th-TH')}
                        </td>
                        <td className="px-3 py-2 text-xs font-medium text-gray-800">
                          {bet.username}
                          {bet.hasReferrer && <span className="ml-1 text-[10px] bg-blue-100 text-blue-600 px-1 rounded">👥</span>}
                        </td>
                        <td className="px-3 py-2 text-xs">
                          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded font-bold">
                            {getBetTypeLabel(bet.betType as BetType)}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span className="font-mono font-bold text-lg text-gray-900">
                            {bet.number}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-right font-bold text-gray-800">
                          ฿{bet.amount.toLocaleString()}
                        </td>
                        <td className="px-3 py-2 text-right text-xs text-orange-600">
                          ฿{bet.commission.toLocaleString()}
                        </td>
                        <td className="px-3 py-2 text-right font-bold text-green-600">
                          ฿{bet.netAmount.toLocaleString()}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span className={`text-xs px-2 py-1 rounded font-bold ${
                            bet.status === 'accepted' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {bet.status === 'accepted' ? '✓ รับ' : '✗ ปฏิเสธ'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {recentBets.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-3 py-8 text-center text-gray-400">
                          ยังไม่มีการแทง - กดปุ่ม "เริ่มจำลอง" เพื่อเริ่มต้น
                        </td>
                      </tr>
                    )}
                  </tbody>
                  {recentBets.length > 0 && (
                    <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                      <tr>
                        <td colSpan={4} className="px-3 py-2 text-sm font-bold text-gray-700">
                          รวม ({recentBets.length} รายการ)
                        </td>
                        <td className="px-3 py-2 text-right font-bold text-gray-800">
                          ฿{recentBets.reduce((sum, bet) => sum + bet.amount, 0).toLocaleString()}
                        </td>
                        <td className="px-3 py-2 text-right font-bold text-orange-600">
                          ฿{recentBets.reduce((sum, bet) => sum + bet.commission, 0).toLocaleString()}
                        </td>
                        <td className="px-3 py-2 text-right font-bold text-green-600">
                          ฿{recentBets.reduce((sum, bet) => sum + bet.netAmount, 0).toLocaleString()}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
