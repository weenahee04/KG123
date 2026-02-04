/**
 * Bot Simulation Dashboard
 * 
 * Interface for configuring and running bot simulations
 */

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings, Activity, TrendingUp, Users, DollarSign, AlertTriangle, Clock } from 'lucide-react';
import { BotSimulationEngine } from '../src/services/botSimulationEngine';
import { BotSimulationConfig, DEFAULT_BOT_CONFIG, SimulationStats, SimulationEvent } from '../src/types/bot-simulation';
import { initializeBetTrackingState, generateGridData } from '../src/services/betTrackingService';
import { BetTrackingState, GridCell, NumberBetSummary, GRID_CONFIGS } from '../src/types/bet-tracking';
import { BetType } from '../src/config/risk-constants';

interface BotSimulatorProps {
  onBack: () => void;
}

export const BotSimulator: React.FC<BotSimulatorProps> = ({ onBack }) => {
  const [config, setConfig] = useState<BotSimulationConfig>(DEFAULT_BOT_CONFIG);
  const [stats, setStats] = useState<SimulationStats | null>(null);
  const [events, setEvents] = useState<SimulationEvent[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [simulatedTime, setSimulatedTime] = useState<Date>(new Date());
  const [trackingState, setTrackingState] = useState<BetTrackingState | null>(null);
  const [selectedBetType, setSelectedBetType] = useState<BetType>('TOP3');
  const [mockCapital, setMockCapital] = useState<number>(10000000);
  const [currentCapital, setCurrentCapital] = useState<number>(10000000);
  const [totalNetSales, setTotalNetSales] = useState<number>(0);
  
  const engineRef = useRef<BotSimulationEngine | null>(null);
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize engine
  useEffect(() => {
    const trackingState = initializeBetTrackingState();
    engineRef.current = new BotSimulationEngine(config, trackingState, mockCapital);
    
    return () => {
      if (engineRef.current) {
        engineRef.current.stop();
      }
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, []);

  // Update UI periodically
  useEffect(() => {
    if (isRunning && engineRef.current) {
      updateIntervalRef.current = setInterval(() => {
        if (engineRef.current) {
          setStats(engineRef.current.getStats());
          setEvents(engineRef.current.getEvents(10));
          setSimulatedTime(engineRef.current.getSimulatedTime());
          setTrackingState(engineRef.current.getTrackingState());
          setCurrentCapital(engineRef.current.getCurrentCapital());
          setTotalNetSales(engineRef.current.getTotalNetSales());
        }
      }, 500);
    } else {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    }

    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, [isRunning]);

  const handleStart = () => {
    if (engineRef.current) {
      engineRef.current.start();
      setIsRunning(true);
    }
  };

  const handleStop = () => {
    if (engineRef.current) {
      engineRef.current.stop();
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    if (engineRef.current) {
      const trackingState = initializeBetTrackingState();
      engineRef.current.reset(trackingState);
      setStats(null);
      setEvents([]);
      setIsRunning(false);
      setSimulatedTime(new Date());
      setCurrentCapital(mockCapital);
      setTotalNetSales(0);
    }
  };

  const handleConfigUpdate = () => {
    if (engineRef.current) {
      engineRef.current.updateConfig(config);
      engineRef.current.updateInitialCapital(mockCapital);
      setCurrentCapital(mockCapital);
      setShowConfig(false);
    }
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}ชม ${minutes}นาที ${secs}วิ`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              ← กลับ
            </button>
            <div className="flex items-center gap-2">
              <Activity className="text-purple-600" size={28} />
              <h1 className="text-2xl font-bold text-gray-900">Bot Simulation - ทดสอบ Risk แบบอัตโนมัติ</h1>
            </div>
          </div>
          
          {/* Control Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
            >
              <Settings size={18} />
              ตั้งค่า
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition flex items-center gap-2"
              disabled={isRunning}
            >
              <RotateCcw size={18} />
              รีเซ็ต
            </button>
            {!isRunning ? (
              <button
                onClick={handleStart}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 font-bold"
              >
                <Play size={18} />
                เริ่มจำลอง
              </button>
            ) : (
              <button
                onClick={handleStop}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2 font-bold"
              >
                <Pause size={18} />
                หยุด
              </button>
            )}
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="font-semibold text-gray-700">
              {isRunning ? '🟢 กำลังจำลอง...' : '⚪ พร้อมเริ่มต้น'}
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-blue-600" />
              <span className="text-gray-600">เวลาจำลอง:</span>
              <span className="font-bold text-gray-900">{formatTime(simulatedTime)}</span>
            </div>
            {stats && (
              <div className="flex items-center gap-2">
                <span className="text-gray-600">เวลาผ่านไป:</span>
                <span className="font-bold text-gray-900">{formatDuration(stats.elapsedTime)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Configuration Panel */}
      {showConfig && (
        <div className="max-w-7xl mx-auto mb-6 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">⚙️ การตั้งค่า Bot Simulation</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  💰 เงินทุนจำลอง (บาท)
                </label>
                <input
                  type="number"
                  value={mockCapital}
                  onChange={(e) => setMockCapital(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 font-bold"
                  step="1000000"
                  min="1000000"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {mockCapital.toLocaleString()} บาท (ใช้คำนวณลิมิต)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">จำนวน Bots</label>
                <input
                  type="number"
                  value={config.numberOfBots}
                  onChange={(e) => setConfig({ ...config, numberOfBots: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  min="1"
                  max="1000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ยอดเป้าหมายต่อวัน (บาท)
                </label>
                <input
                  type="number"
                  value={config.dailyTargetVolume}
                  onChange={(e) => setConfig({ ...config, dailyTargetVolume: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  step="100000"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {config.dailyTargetVolume.toLocaleString()} บาท
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ความเร็ว (x{config.speedMultiplier})
                </label>
                <input
                  type="range"
                  value={config.speedMultiplier}
                  onChange={(e) => setConfig({ ...config, speedMultiplier: parseInt(e.target.value) })}
                  className="w-full"
                  min="1"
                  max="3600"
                  step="1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  1 ชั่วโมงจริง = {(60 / config.speedMultiplier).toFixed(1)} นาที
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  % ที่มีผู้แนะนำ (หัก 8%)
                </label>
                <input
                  type="number"
                  value={config.referrerRate}
                  onChange={(e) => setConfig({ ...config, referrerRate: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  การกระจายพฤติกรรม (%)
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-24 text-sm text-gray-600">Conservative:</span>
                    <input
                      type="number"
                      value={config.behaviorDistribution.conservative}
                      onChange={(e) => setConfig({
                        ...config,
                        behaviorDistribution: { ...config.behaviorDistribution, conservative: parseInt(e.target.value) || 0 }
                      })}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                      min="0"
                      max="100"
                    />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-24 text-sm text-gray-600">Moderate:</span>
                    <input
                      type="number"
                      value={config.behaviorDistribution.moderate}
                      onChange={(e) => setConfig({
                        ...config,
                        behaviorDistribution: { ...config.behaviorDistribution, moderate: parseInt(e.target.value) || 0 }
                      })}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                      min="0"
                      max="100"
                    />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-24 text-sm text-gray-600">Aggressive:</span>
                    <input
                      type="number"
                      value={config.behaviorDistribution.aggressive}
                      onChange={(e) => setConfig({
                        ...config,
                        behaviorDistribution: { ...config.behaviorDistribution, aggressive: parseInt(e.target.value) || 0 }
                      })}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                      min="0"
                      max="100"
                    />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-24 text-sm text-gray-600">Whale:</span>
                    <input
                      type="number"
                      value={config.behaviorDistribution.whale}
                      onChange={(e) => setConfig({
                        ...config,
                        behaviorDistribution: { ...config.behaviorDistribution, whale: parseInt(e.target.value) || 0 }
                      })}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                      min="0"
                      max="100"
                    />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={() => setShowConfig(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleConfigUpdate}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              บันทึก
            </button>
          </div>
        </div>
      )}

      {/* Statistics Dashboard */}
      {stats && (
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Dynamic Capital Card */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border-2 border-yellow-300 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-yellow-500 text-white rounded-full p-3">
                <DollarSign size={28} />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">💰 เงินทุนปัจจุบัน (ไดนามิก)</p>
                <p className="text-4xl font-black text-gray-900">{currentCapital.toLocaleString()} บาท</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-white rounded-lg p-3 border border-blue-200">
                <p className="text-xs text-gray-500 mb-1">เงินทุนเริ่มต้น</p>
                <p className="text-lg font-bold text-blue-700">{mockCapital.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-green-200">
                <p className="text-xs text-gray-500 mb-1">+ ยอดขายสุทธิสะสม</p>
                <p className="text-lg font-bold text-green-700">{totalNetSales.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-purple-200">
                <p className="text-xs text-gray-500 mb-1">= เงินทุนรวม</p>
                <p className="text-lg font-bold text-purple-700">{currentCapital.toLocaleString()}</p>
              </div>
            </div>

            {/* Detailed Limits Box */}
            <div className="bg-white rounded-lg p-4 border-2 border-orange-300 shadow-sm">
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <TrendingUp size={16} className="text-orange-600" />
                ลิมิตปัจจุบัน (คำนวณจากเงินทุนไดนามิก)
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* 3 ตัวบน */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-300">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-blue-900">3 ตัวบน</p>
                    <span className="text-[10px] bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full font-bold">TOP3</span>
                  </div>
                  <p className="text-xl font-black text-blue-700 mb-1">
                    {((currentCapital * 0.30) / 800).toLocaleString('th-TH', { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-[10px] text-blue-600">บาท/เลข</p>
                  <div className="mt-2 pt-2 border-t border-blue-200 text-[10px] text-blue-700">
                    <p>จ่าย: 800 เท่า</p>
                    <p>สัดส่วน: 30%</p>
                  </div>
                </div>

                {/* 3 ตัวโต๊ด */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-300">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-purple-900">3 ตัวโต๊ด</p>
                    <span className="text-[10px] bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full font-bold">TOAD3</span>
                  </div>
                  <p className="text-xl font-black text-purple-700 mb-1">
                    {((currentCapital * 0.20) / 150).toLocaleString('th-TH', { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-[10px] text-purple-600">บาท/เลข</p>
                  <div className="mt-2 pt-2 border-t border-purple-200 text-[10px] text-purple-700">
                    <p>จ่าย: 150 เท่า</p>
                    <p>สัดส่วน: 20%</p>
                  </div>
                </div>

                {/* 2 ตัวบน */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-300">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-green-900">2 ตัวบน</p>
                    <span className="text-[10px] bg-green-200 text-green-800 px-2 py-0.5 rounded-full font-bold">TOP2</span>
                  </div>
                  <p className="text-xl font-black text-green-700 mb-1">
                    {((currentCapital * 0.20) / 90).toLocaleString('th-TH', { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-[10px] text-green-600">บาท/เลข</p>
                  <div className="mt-2 pt-2 border-t border-green-200 text-[10px] text-green-700">
                    <p>จ่าย: 90 เท่า</p>
                    <p>สัดส่วน: 20%</p>
                  </div>
                </div>

                {/* 2 ตัวล่าง */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 border border-orange-300">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-orange-900">2 ตัวล่าง</p>
                    <span className="text-[10px] bg-orange-200 text-orange-800 px-2 py-0.5 rounded-full font-bold">BTM2</span>
                  </div>
                  <p className="text-xl font-black text-orange-700 mb-1">
                    {((currentCapital * 0.30) / 90).toLocaleString('th-TH', { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-[10px] text-orange-600">บาท/เลข</p>
                  <div className="mt-2 pt-2 border-t border-orange-200 text-[10px] text-orange-700">
                    <p>จ่าย: 90 เท่า</p>
                    <p>สัดส่วน: 30%</p>
                  </div>
                </div>
              </div>

              {/* Formula Explanation */}
              <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-200">
                <p className="text-xs text-gray-600 font-medium mb-1">📐 สูตรคำนวณ:</p>
                <p className="text-xs text-gray-700 font-mono">
                  ลิมิต/เลข = (เงินทุนปัจจุบัน × สัดส่วน%) ÷ อัตราจ่าย
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Users size={16} className="text-blue-600" />
                <p className="text-xs text-gray-600">Bots ทั้งหมด</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBots}</p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Activity size={16} className="text-green-600" />
                <p className="text-xs text-gray-600">การแทงทั้งหมด</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBets.toLocaleString()}</p>
              <p className="text-xs text-gray-500">{stats.betsPerMinute.toFixed(1)} bets/min</p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign size={16} className="text-purple-600" />
                <p className="text-xs text-gray-600">ยอดรวม</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">{(stats.totalVolume / 1000).toFixed(0)}K</p>
              <p className="text-xs text-gray-500">เฉลี่ย {stats.averageBetSize.toFixed(0)} บาท</p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={16} className="text-orange-600" />
                <p className="text-xs text-gray-600">เลขเสี่ยง</p>
              </div>
              <p className="text-2xl font-bold text-orange-600">{stats.riskMetrics.numbersAtRisk}</p>
              <p className="text-xs text-gray-500">ปฏิเสธ {stats.riskMetrics.rejectedBets}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-900">ความคืบหน้ายอดวันนี้</h3>
              <span className="text-sm text-gray-600">
                {stats.currentDailyVolume.toLocaleString()} / {stats.targetDailyVolume.toLocaleString()} บาท
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-purple-600 h-full transition-all duration-500"
                style={{ width: `${Math.min(stats.progressPercent, 100)}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">{stats.progressPercent.toFixed(1)}% ของเป้าหมาย</p>
          </div>

          {/* Risk Metrics */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">📊 Risk Metrics</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">เลขที่ใช้สูงสุด</p>
                <p className="text-xl font-bold text-red-600">{stats.riskMetrics.highestUsageNumber}</p>
                <p className="text-xs text-gray-500">{stats.riskMetrics.highestUsagePercent.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">เลขในโซนเสี่ยง</p>
                <p className="text-xl font-bold text-orange-600">{stats.riskMetrics.numbersAtRisk}</p>
                <p className="text-xs text-gray-500">{'>'}70% usage</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">ค่าคอมรวม</p>
                <p className="text-xl font-bold text-green-600">{stats.totalCommission.toLocaleString()}</p>
                <p className="text-xs text-gray-500">บาท</p>
              </div>
            </div>
          </div>

          {/* Bet Tracking Grid */}
          {trackingState && (
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">📊 ตารางเก็บยอดแทง (Real-time)</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedBetType('TOP3')}
                    className={`px-3 py-1 rounded text-sm font-bold transition ${
                      selectedBetType === 'TOP3' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    3 ตัวบน
                  </button>
                  <button
                    onClick={() => setSelectedBetType('TOAD3')}
                    className={`px-3 py-1 rounded text-sm font-bold transition ${
                      selectedBetType === 'TOAD3' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    3 ตัวโต๊ด
                  </button>
                  <button
                    onClick={() => setSelectedBetType('TOP2')}
                    className={`px-3 py-1 rounded text-sm font-bold transition ${
                      selectedBetType === 'TOP2' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    2 ตัวบน
                  </button>
                  <button
                    onClick={() => setSelectedBetType('BOTTOM2')}
                    className={`px-3 py-1 rounded text-sm font-bold transition ${
                      selectedBetType === 'BOTTOM2' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    2 ตัวล่าง
                  </button>
                </div>
              </div>

              {/* Grid Display */}
              <div className="overflow-x-auto">
                <div className="inline-block min-w-full">
                  {(() => {
                    const gridData = generateGridData(trackingState, selectedBetType);
                    const table = trackingState.tables[selectedBetType];
                    const gridConfig = GRID_CONFIGS[selectedBetType];
                    const flatGrid = gridData.flat();
                    const numbersArray: NumberBetSummary[] = Array.from(table.numbers.values());
                    
                    return (
                      <div className="space-y-4">
                        {/* Stats Summary */}
                        <div className="grid grid-cols-4 gap-3 mb-4">
                          <div className="bg-green-50 p-3 rounded border border-green-200">
                            <p className="text-xs text-green-700 mb-1">ปลอดภัย (0-70%)</p>
                            <p className="text-lg font-bold text-green-800">
                              {numbersArray.filter((n: NumberBetSummary) => n.usagePercent <= 70).length}
                            </p>
                          </div>
                          <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                            <p className="text-xs text-yellow-700 mb-1">เตือน (71-85%)</p>
                            <p className="text-lg font-bold text-yellow-800">
                              {numbersArray.filter((n: NumberBetSummary) => n.usagePercent > 70 && n.usagePercent <= 85).length}
                            </p>
                          </div>
                          <div className="bg-orange-50 p-3 rounded border border-orange-200">
                            <p className="text-xs text-orange-700 mb-1">อันตราย (86-100%)</p>
                            <p className="text-lg font-bold text-orange-800">
                              {numbersArray.filter((n: NumberBetSummary) => n.usagePercent > 85 && n.usagePercent <= 100).length}
                            </p>
                          </div>
                          <div className="bg-red-50 p-3 rounded border border-red-200">
                            <p className="text-xs text-red-700 mb-1">วิกฤต (&gt;100%)</p>
                            <p className="text-lg font-bold text-red-800">
                              {numbersArray.filter((n: NumberBetSummary) => n.usagePercent > 100).length}
                            </p>
                          </div>
                        </div>

                        {/* Grid */}
                        <div className="grid gap-1" style={{ 
                          gridTemplateColumns: `repeat(${gridConfig.cols}, minmax(0, 1fr))` 
                        }}>
                          {flatGrid.map((cellData: GridCell, idx: number) => {
                            const getColorClass = (usage: number) => {
                              if (usage > 100) return 'bg-red-600 text-white';
                              if (usage > 85) return 'bg-orange-500 text-white';
                              if (usage > 70) return 'bg-yellow-400 text-gray-900';
                              if (usage > 0) return 'bg-green-100 text-green-900';
                              return 'bg-gray-50 text-gray-400';
                            };

                            return (
                              <div
                                key={idx}
                                className={`p-2 rounded text-center text-xs font-bold transition-colors ${getColorClass(cellData.usagePercent)}`}
                                title={`${cellData.number}: ${cellData.amount.toLocaleString()} บาท (${cellData.usagePercent.toFixed(1)}%)`}
                              >
                                <div className="font-mono">{cellData.number}</div>
                                {cellData.amount > 0 && (
                                  <div className="text-[10px] mt-0.5">
                                    {cellData.usagePercent.toFixed(0)}%
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Legend */}
                        <div className="flex items-center gap-4 text-xs mt-4 pt-4 border-t">
                          <span className="font-bold text-gray-700">สีแสดงความเสี่ยง:</span>
                          <div className="flex items-center gap-1">
                            <div className="w-4 h-4 bg-gray-50 border rounded"></div>
                            <span className="text-gray-600">ไม่มียอด</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-4 h-4 bg-green-100 rounded"></div>
                            <span className="text-gray-600">ปลอดภัย</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                            <span className="text-gray-600">เตือน</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-4 h-4 bg-orange-500 rounded"></div>
                            <span className="text-gray-600">อันตราย</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-4 h-4 bg-red-600 rounded"></div>
                            <span className="text-gray-600">วิกฤต</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* Event Log */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">📝 Event Log (ล่าสุด)</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {events.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">ยังไม่มี events</p>
              ) : (
                events.map((event, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm p-2 hover:bg-gray-50 rounded">
                    <span className="text-xs text-gray-400 w-20">
                      {event.timestamp.toLocaleTimeString('th-TH')}
                    </span>
                    <span className={`w-2 h-2 rounded-full mt-1 ${
                      event.type === 'bet_placed' ? 'bg-green-500' :
                      event.type === 'bet_rejected' ? 'bg-red-500' :
                      event.type === 'limit_reached' ? 'bg-orange-500' :
                      'bg-blue-500'
                    }`}></span>
                    <span className="flex-1 text-gray-700">{event.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Initial State */}
      {!stats && (
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-12 border border-gray-200 text-center">
            <Activity size={64} className="mx-auto text-purple-600 mb-4 opacity-50" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">พร้อมเริ่มการจำลอง</h2>
            <p className="text-gray-600 mb-6">
              กดปุ่ม "เริ่มจำลอง" เพื่อเริ่มทดสอบระบบ Risk ด้วย Bot อัตโนมัติ
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="font-bold text-yellow-900 mb-1">💰 {(mockCapital / 1000000).toFixed(0)}M</p>
                <p className="text-xs text-yellow-700">เงินทุนจำลอง</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="font-bold text-blue-900 mb-1">🤖 {config.numberOfBots} Bots</p>
                <p className="text-xs text-blue-700">จำลองผู้เล่นจริง</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="font-bold text-green-900 mb-1">🎯 {(config.dailyTargetVolume / 1000000).toFixed(1)}M</p>
                <p className="text-xs text-green-700">เป้าหมายต่อวัน</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="font-bold text-purple-900 mb-1">⚡ x{config.speedMultiplier}</p>
                <p className="text-xs text-purple-700">ความเร็วจำลอง</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
