import React, { useState } from 'react';
import { Calculator, Settings, RefreshCcw, AlertTriangle, CheckCircle, XCircle, TrendingUp, DollarSign, Percent, Target } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { simulateRiskCalculation, BetType, SimulationInput, MockSystemState, SimulationResult } from '../services/riskSimulator';

interface RiskSimulatorProps {
  onBack: () => void;
}

export const RiskSimulator: React.FC<RiskSimulatorProps> = ({ onBack }) => {
  const [input, setInput] = useState<SimulationInput>({
    betType: 'TOP3',
    number: '123',
    amount: 1000,
    hasReferrer: false,
  });

  const [mockState, setMockState] = useState<MockSystemState>({
    mockCapital: 500000,
    mockTotalSales: 200000,
    mockCurrentBetOnNumber: 5000,
  });

  const [result, setResult] = useState<SimulationResult | null>(null);

  const handleCalculate = () => {
    const calculationResult = simulateRiskCalculation(input, mockState);
    setResult(calculationResult);
  };

  const handleReset = () => {
    setInput({
      betType: 'TOP3',
      number: '123',
      amount: 1000,
      hasReferrer: false,
    });
    setMockState({
      mockCapital: 500000,
      mockTotalSales: 200000,
      mockCurrentBetOnNumber: 5000,
    });
    setResult(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg font-semibold">
            <CheckCircle size={20} />
            <span>ผ่าน - รับเดิมพัน</span>
          </div>
        );
      case 'WARNING':
        return (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg font-semibold">
            <AlertTriangle size={20} />
            <span>เตือน - ลดอัตราจ่าย</span>
          </div>
        );
      case 'REJECTED':
        return (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-lg font-semibold">
            <XCircle size={20} />
            <span>ปฏิเสธ - เกินลิมิต</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← กลับ
              </button>
              <Calculator className="text-blue-600" size={28} />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Risk Simulator Sandbox</h1>
                <p className="text-sm text-gray-500">ทดสอบระบบคำนวณความเสี่ยงและอัตราจ่าย</p>
              </div>
            </div>
            <Button onClick={handleReset} className="flex items-center gap-2">
              <RefreshCcw size={16} />
              รีเซ็ต
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: Simulation Input */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Target className="text-blue-600" size={24} />
              <h2 className="text-xl font-bold text-gray-900">ข้อมูลการแทง</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ประเภทการแทง
                </label>
                <select
                  value={input.betType}
                  onChange={(e) => setInput({ ...input, betType: e.target.value as BetType })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="TOP3">3 ตัวบน (TOP3)</option>
                  <option value="TOP2">2 ตัวบน (TOP2)</option>
                  <option value="TODE">โต๊ด (TODE)</option>
                  <option value="RUN_TOP">วิ่งบน (RUN_TOP)</option>
                  <option value="RUN_BOTTOM">วิ่งล่าง (RUN_BOTTOM)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  เลขที่แทง
                </label>
                <Input
                  type="text"
                  value={input.number}
                  onChange={(e) => setInput({ ...input, number: e.target.value })}
                  placeholder="เช่น 123"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  จำนวนเงิน (บาท)
                </label>
                <Input
                  type="number"
                  value={input.amount}
                  onChange={(e) => setInput({ ...input, amount: Number(e.target.value) })}
                  placeholder="1000"
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="hasReferrer"
                  checked={input.hasReferrer}
                  onChange={(e) => setInput({ ...input, hasReferrer: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="hasReferrer" className="text-sm font-medium text-gray-700">
                  มีผู้แนะนำ (หัก 8% ค่าคอมมิชชั่น)
                </label>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>เงินสุทธิ:</strong> {input.hasReferrer ? (input.amount * 0.92).toLocaleString() : input.amount.toLocaleString()} บาท</p>
                  <p><strong>ค่าคอมมิชชั่น:</strong> {input.hasReferrer ? (input.amount * 0.08).toLocaleString() : '0'} บาท</p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Configuration Overrides */}
          <div className="bg-white rounded-xl shadow-md border-2 border-orange-300 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Settings className="text-orange-600" size={24} />
              <h2 className="text-xl font-bold text-gray-900">ตั้งค่าจำลอง</h2>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-xs text-orange-800 font-medium">
                  ⚠️ ข้อมูลจำลอง - ไม่กระทบฐานข้อมูลจริง
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  เงินทุนจำลอง (Mock Capital)
                </label>
                <Input
                  type="number"
                  value={mockState.mockCapital}
                  onChange={(e) => setMockState({ ...mockState, mockCapital: Number(e.target.value) })}
                  placeholder="500000"
                />
                <p className="text-xs text-gray-500 mt-1">เงินทุนคงเหลือในระบบ</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ยอดขายรวม (Mock Total Sales)
                </label>
                <Input
                  type="number"
                  value={mockState.mockTotalSales}
                  onChange={(e) => setMockState({ ...mockState, mockTotalSales: Number(e.target.value) })}
                  placeholder="200000"
                />
                <p className="text-xs text-gray-500 mt-1">ยอดขายทั้งหมดในงวดนี้</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ยอดแทงปัจจุบันของเลขนี้
                </label>
                <Input
                  type="number"
                  value={mockState.mockCurrentBetOnNumber}
                  onChange={(e) => setMockState({ ...mockState, mockCurrentBetOnNumber: Number(e.target.value) })}
                  placeholder="5000"
                />
                <p className="text-xs text-gray-500 mt-1">ยอดที่มีคนแทงเลขนี้แล้ว</p>
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleCalculate}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 rounded-lg shadow-lg flex items-center justify-center gap-2"
                >
                  <Calculator size={20} />
                  คำนวณความเสี่ยง
                </Button>
              </div>
            </div>
          </div>

          {/* Column 3: Result Display - Table Format */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="text-blue-600" size={24} />
              <h2 className="text-xl font-bold text-gray-900">ผลการคำนวณ</h2>
            </div>

            {!result ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <Calculator size={48} className="mb-4 opacity-50" />
                <p className="text-center">กรุณากรอกข้อมูลและกดคำนวณ</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Status Badge */}
                <div className="mb-4">
                  {getStatusBadge(result.status)}
                </div>

                {/* Reason Box */}
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-900 font-medium">{result.reason}</p>
                </div>

                {/* Main Results Table */}
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">รายการ</th>
                        <th className="px-4 py-3 text-right font-semibold">ค่า</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr className="bg-purple-50 hover:bg-purple-100">
                        <td className="px-4 py-3 font-medium text-gray-700">
                          <div className="flex items-center gap-2">
                            <DollarSign size={16} className="text-purple-600" />
                            อัตราจ่ายสุดท้าย
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-2xl font-bold text-purple-700">{result.finalPayoutRate}</span>
                          <span className="text-xs text-gray-500 ml-2">(ปกติ: {result.basePayout})</span>
                        </td>
                      </tr>
                      <tr className="bg-white hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-700">เงินทุนรวม (Total Pot)</td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-900">{result.totalPot.toLocaleString()} บาท</td>
                      </tr>
                      <tr className="bg-gray-50 hover:bg-gray-100">
                        <td className="px-4 py-3 text-gray-700">% จัดสรร (Allocation)</td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-900">{(result.allocation * 100).toFixed(0)}%</td>
                      </tr>
                      <tr className="bg-white hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-700">อัตราจ่ายฐาน (Base Payout)</td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-900">{result.basePayout}</td>
                      </tr>
                      <tr className="bg-blue-50 hover:bg-blue-100">
                        <td className="px-4 py-3 font-medium text-blue-900">ลิมิตปัจจุบัน (Current Limit)</td>
                        <td className="px-4 py-3 text-right font-bold text-blue-700">{result.currentLimit.toLocaleString()} บาท</td>
                      </tr>
                      <tr className="bg-white hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-700">ยอดแทงปัจจุบัน</td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-900">{mockState.mockCurrentBetOnNumber.toLocaleString()} บาท</td>
                      </tr>
                      <tr className="bg-gray-50 hover:bg-gray-100">
                        <td className="px-4 py-3 text-gray-700">ยอดแทงใหม่ (+จำนวนที่แทง)</td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-900">{result.newTotalBet.toLocaleString()} บาท</td>
                      </tr>
                      <tr className="bg-yellow-50 hover:bg-yellow-100">
                        <td className="px-4 py-3 font-medium text-yellow-900">% การใช้งาน (Usage Ratio)</td>
                        <td className="px-4 py-3 text-right font-bold text-yellow-700">{result.usagePercent.toFixed(2)}%</td>
                      </tr>
                      <tr className={`hover:bg-opacity-80 ${result.remainingLimit < 0 ? 'bg-red-50' : 'bg-green-50'}`}>
                        <td className="px-4 py-3 font-medium text-gray-700">ลิมิตคงเหลือ (Remaining)</td>
                        <td className={`px-4 py-3 text-right font-bold ${result.remainingLimit < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {result.remainingLimit.toLocaleString()} บาท
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Money Breakdown Tables - Split into 2 tables */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {/* Table 1: WITHOUT Commission (100%) */}
                  <div className="overflow-hidden border-2 border-green-300 rounded-lg shadow-md">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 px-4 py-2 text-white">
                      <h3 className="font-bold text-sm flex items-center gap-2">
                        <CheckCircle size={16} />
                        กรณีไม่มีผู้แนะนำ (100%)
                      </h3>
                    </div>
                    <table className="w-full text-sm">
                      <tbody className="divide-y divide-gray-200">
                        <tr className="bg-white hover:bg-gray-50">
                          <td className="px-4 py-2 text-gray-700">จำนวนเงินที่แทง</td>
                          <td className="px-4 py-2 text-right font-semibold text-gray-900">{input.amount.toLocaleString()} บาท</td>
                        </tr>
                        <tr className="bg-gray-50 hover:bg-gray-100">
                          <td className="px-4 py-2 text-gray-700">ค่าคอมมิชชั่น</td>
                          <td className="px-4 py-2 text-right font-semibold text-gray-500">0 บาท</td>
                        </tr>
                        <tr className="bg-green-50 hover:bg-green-100">
                          <td className="px-4 py-2 font-bold text-green-800">เงินสุทธิเข้าพูล</td>
                          <td className="px-4 py-2 text-right font-bold text-green-700 text-lg">{input.amount.toLocaleString()} บาท</td>
                        </tr>
                        <tr className="bg-green-100">
                          <td className="px-4 py-2 font-medium text-green-900">% เข้าพูล</td>
                          <td className="px-4 py-2 text-right font-bold text-green-900">100%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Table 2: WITH Commission (92%) */}
                  <div className="overflow-hidden border-2 border-orange-300 rounded-lg shadow-md">
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 text-white">
                      <h3 className="font-bold text-sm flex items-center gap-2">
                        <AlertTriangle size={16} />
                        กรณีมีผู้แนะนำ (หัก 8%)
                      </h3>
                    </div>
                    <table className="w-full text-sm">
                      <tbody className="divide-y divide-gray-200">
                        <tr className="bg-white hover:bg-gray-50">
                          <td className="px-4 py-2 text-gray-700">จำนวนเงินที่แทง</td>
                          <td className="px-4 py-2 text-right font-semibold text-gray-900">{input.amount.toLocaleString()} บาท</td>
                        </tr>
                        <tr className="bg-orange-50 hover:bg-orange-100">
                          <td className="px-4 py-2 text-gray-700">ค่าคอมมิชชั่น (8%)</td>
                          <td className="px-4 py-2 text-right font-semibold text-orange-600">- {(input.amount * 0.08).toLocaleString()} บาท</td>
                        </tr>
                        <tr className="bg-green-50 hover:bg-green-100">
                          <td className="px-4 py-2 font-bold text-green-800">เงินสุทธิเข้าพูล</td>
                          <td className="px-4 py-2 text-right font-bold text-green-700 text-lg">{(input.amount * 0.92).toLocaleString()} บาท</td>
                        </tr>
                        <tr className="bg-orange-100">
                          <td className="px-4 py-2 font-medium text-orange-900">% เข้าพูล</td>
                          <td className="px-4 py-2 text-right font-bold text-orange-900">92%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Current Selection Indicator */}
                <div className={`mt-4 p-3 rounded-lg border-2 ${input.hasReferrer ? 'bg-orange-50 border-orange-300' : 'bg-green-50 border-green-300'}`}>
                  <p className="text-sm font-bold text-gray-800">
                    ✓ การคำนวณปัจจุบัน: 
                    <span className={`ml-2 ${input.hasReferrer ? 'text-orange-700' : 'text-green-700'}`}>
                      {input.hasReferrer ? 'มีผู้แนะนำ (หัก 8%)' : 'ไม่มีผู้แนะนำ (100%)'}
                    </span>
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    เงินที่เข้าพูลจริง: <span className="font-bold">{result.netAmount.toLocaleString()} บาท</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Panel */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
            <AlertTriangle size={20} />
            วิธีใช้งาน Risk Simulator
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• <strong>Column 1:</strong> กรอกข้อมูลการแทงที่ต้องการทดสอบ (ประเภท, เลข, จำนวนเงิน)</li>
            <li>• <strong>Column 2:</strong> ตั้งค่าสถานะระบบจำลอง (เงินทุน, ยอดขาย, ยอดแทงปัจจุบัน)</li>
            <li>• <strong>Column 3:</strong> ดูผลการคำนวณแบบเรียลไทม์ (สถานะ, อัตราจ่าย, ลิมิต)</li>
            <li>• <strong>Logic:</strong> ถ้าใช้ลิมิต {'>'} 100% = ปฏิเสธ | {'>'} 85% = ลดเป็น Tier 2 | {'>'} 70% = ลดเป็น Tier 1</li>
            <li>• <strong>หมายเหตุ:</strong> ข้อมูลทั้งหมดเป็นการจำลอง ไม่มีผลกับฐานข้อมูลจริง</li>
          </ul>
        </div>
      </main>
    </div>
  );
};
