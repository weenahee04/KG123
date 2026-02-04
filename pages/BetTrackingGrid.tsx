/**
 * Bet Tracking Grid Component
 * 
 * Visual grid showing bet amounts for each number
 * Based on handwritten notes showing grid-based tracking
 */

import React, { useState, useMemo } from 'react';
import { BetType } from '../src/config/risk-constants';
import {
  BetTrackingState,
  GridCell,
  BetStatistics,
} from '../src/types/bet-tracking';
import {
  generateGridData,
  calculateBetStatistics,
  initializeBetTrackingState,
} from '../src/services/betTrackingService';
import { Grid, TrendingUp, AlertTriangle, CheckCircle, XCircle, BarChart3 } from 'lucide-react';

interface BetTrackingGridProps {
  onBack: () => void;
}

export const BetTrackingGrid: React.FC<BetTrackingGridProps> = ({ onBack }) => {
  const [selectedBetType, setSelectedBetType] = useState<BetType>('TOP3');
  const [trackingState] = useState<BetTrackingState>(() => {
    // Initialize with mock data for demonstration
    const state = initializeBetTrackingState();
    // In real app, this would be loaded from backend/state management
    return state;
  });

  const gridData = useMemo(
    () => generateGridData(trackingState, selectedBetType),
    [trackingState, selectedBetType]
  );

  const statistics = useMemo(
    () => calculateBetStatistics(trackingState, selectedBetType),
    [trackingState, selectedBetType]
  );

  const getStatusColor = (status: GridCell['status']): string => {
    switch (status) {
      case 'empty':
        return 'bg-gray-100 text-gray-400 border-gray-200';
      case 'safe':
        return 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100';
      case 'warning':
        return 'bg-yellow-50 text-yellow-700 border-yellow-300 hover:bg-yellow-100';
      case 'danger':
        return 'bg-orange-50 text-orange-700 border-orange-300 hover:bg-orange-100';
      case 'critical':
        return 'bg-red-50 text-red-700 border-red-300 hover:bg-red-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getStatusIcon = (status: GridCell['status']) => {
    switch (status) {
      case 'safe':
        return <CheckCircle size={12} className="text-green-600" />;
      case 'warning':
        return <AlertTriangle size={12} className="text-yellow-600" />;
      case 'danger':
        return <AlertTriangle size={12} className="text-orange-600" />;
      case 'critical':
        return <XCircle size={12} className="text-red-600" />;
      default:
        return null;
    }
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
              <Grid className="text-blue-600" size={28} />
              <h1 className="text-2xl font-bold text-gray-900">ตารางเก็บยอดแทงแต่ละเลข</h1>
            </div>
          </div>
        </div>

        {/* Bet Type Selector */}
        <div className="flex gap-2 mb-4">
          {(['TOP3', 'TOAD3', 'TOP2', 'BOTTOM2'] as BetType[]).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedBetType(type)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedBetType === type
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {type === 'TOP3' && '3 ตัวบน'}
              {type === 'TOAD3' && '3 ตัวโต๊ด'}
              {type === 'TOP2' && '2 ตัวบน'}
              {type === 'BOTTOM2' && '2 ตัวล่าง'}
            </button>
          ))}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 size={16} className="text-blue-600" />
              <p className="text-xs text-gray-600">เลขที่มีการแทง</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{statistics.activeNumbers}</p>
            <p className="text-xs text-gray-500">จาก {statistics.totalNumbers} เลข</p>
          </div>

          <div className="bg-green-50 rounded-lg p-4 border border-green-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={16} className="text-green-600" />
              <p className="text-xs text-green-700">โซนปลอดภัย</p>
            </div>
            <p className="text-2xl font-bold text-green-700">{statistics.safeNumbers}</p>
            <p className="text-xs text-green-600">0-70%</p>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={16} className="text-yellow-600" />
              <p className="text-xs text-yellow-700">โซนเตือน</p>
            </div>
            <p className="text-2xl font-bold text-yellow-700">{statistics.warningNumbers}</p>
            <p className="text-xs text-yellow-600">71-85%</p>
          </div>

          <div className="bg-red-50 rounded-lg p-4 border border-red-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <XCircle size={16} className="text-red-600" />
              <p className="text-xs text-red-700">โซนอันตราย</p>
            </div>
            <p className="text-2xl font-bold text-red-700">
              {statistics.dangerNumbers + statistics.criticalNumbers}
            </p>
            <p className="text-xs text-red-600">{'>'}85%</p>
          </div>
        </div>
      </div>

      {/* Grid Display */}
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            ตารางยอดแทง - {selectedBetType === 'TOP3' && '3 ตัวบน'}
            {selectedBetType === 'TOAD3' && '3 ตัวโต๊ด'}
            {selectedBetType === 'TOP2' && '2 ตัวบน'}
            {selectedBetType === 'BOTTOM2' && '2 ตัวล่าง'}
          </h2>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded"></div>
              <span className="text-gray-600">ว่าง</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
              <span className="text-gray-600">ปลอดภัย</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-50 border border-yellow-300 rounded"></div>
              <span className="text-gray-600">เตือน</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-50 border border-red-300 rounded"></div>
              <span className="text-gray-600">อันตราย</span>
            </div>
          </div>
        </div>

        {/* Grid Table */}
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            {gridData.slice(0, 10).map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-1 mb-1">
                {row.map((cell) => (
                  <div
                    key={cell.number}
                    className={`
                      w-20 h-16 border rounded flex flex-col items-center justify-center
                      transition-all cursor-pointer text-xs
                      ${getStatusColor(cell.status)}
                    `}
                    title={`เลข: ${cell.number}\nยอด: ${cell.amount.toLocaleString()} บาท\nใช้: ${cell.usagePercent.toFixed(1)}%\nจำนวนเดิมพัน: ${cell.betCount}`}
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <span className="font-bold">{cell.number}</span>
                      {getStatusIcon(cell.status)}
                    </div>
                    {cell.amount > 0 && (
                      <>
                        <span className="text-[10px] font-semibold">
                          {cell.amount.toLocaleString()}
                        </span>
                        <span className="text-[9px] opacity-75">
                          {cell.usagePercent.toFixed(0)}%
                        </span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Summary Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-600">เลขที่แทงสูงสุด</p>
              <p className="text-lg font-bold text-gray-900">
                {statistics.highestBetNumber} 
                <span className="text-sm text-gray-600 ml-2">
                  ({statistics.highestBetAmount.toLocaleString()} บาท)
                </span>
              </p>
            </div>
            <div>
              <p className="text-gray-600">ค่าเฉลี่ยต่อเลข</p>
              <p className="text-lg font-bold text-gray-900">
                {statistics.averageBetPerNumber.toLocaleString()} บาท
              </p>
            </div>
            <div>
              <p className="text-gray-600">เลขว่าง</p>
              <p className="text-lg font-bold text-gray-900">
                {statistics.emptyNumbers} เลข
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <div className="max-w-7xl mx-auto mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <TrendingUp className="text-blue-600 mt-1" size={20} />
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">วิธีใช้งาน:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              <li>แต่ละช่องแสดงเลขและยอดแทงรวม</li>
              <li>สีเขียว = ปลอดภัย (0-70%), สีเหลือง = เตือน (71-85%), สีแดง = อันตราย ({'>'}85%)</li>
              <li>เลื่อนเมาส์ไปที่ช่องเพื่อดูรายละเอียด</li>
              <li>ในระบบจริงจะอัปเดตแบบ real-time เมื่อมีการแทง</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
