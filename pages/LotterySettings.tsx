import React, { useState } from 'react';
import { 
  Settings, 
  DollarSign,
  Lock,
  Save,
  RotateCcw,
  AlertCircle,
  TrendingUp,
  Percent
} from 'lucide-react';

interface PayoutRate {
  betType: string;
  rate: number;
  minBet: number;
  maxBet: number;
  maxPayout: number;
}

interface NumberLimit {
  number: string;
  betType: string;
  currentAmount: number;
  limit: number;
  status: 'open' | 'closed';
}

export default function LotterySettings() {
  const [activeTab, setActiveTab] = useState<'payout' | 'limits' | 'general'>('payout');
  
  // Payout rates
  const [payoutRates, setPayoutRates] = useState<PayoutRate[]>([
    { betType: '3 ตัวบน', rate: 850, minBet: 1, maxBet: 10000, maxPayout: 8500000 },
    { betType: '3 ตัวโต๊ด', rate: 150, minBet: 1, maxBet: 10000, maxPayout: 1500000 },
    { betType: '3 ตัวหน้า', rate: 850, minBet: 1, maxBet: 10000, maxPayout: 8500000 },
    { betType: '2 ตัวบน', rate: 95, minBet: 1, maxBet: 10000, maxPayout: 950000 },
    { betType: '2 ตัวล่าง', rate: 95, minBet: 1, maxBet: 10000, maxPayout: 950000 },
    { betType: 'วิ่งบน', rate: 3.5, minBet: 1, maxBet: 10000, maxPayout: 35000 },
    { betType: 'วิ่งล่าง', rate: 4.5, minBet: 1, maxBet: 10000, maxPayout: 45000 },
  ]);

  // Number limits
  const [numberLimits, setNumberLimits] = useState<NumberLimit[]>([
    { number: '123', betType: '3บน', currentAmount: 45000, limit: 50000, status: 'open' },
    { number: '456', betType: '3บน', currentAmount: 50000, limit: 50000, status: 'closed' },
    { number: '88', betType: '2บน', currentAmount: 38000, limit: 40000, status: 'open' },
    { number: '99', betType: '2บน', currentAmount: 40000, limit: 40000, status: 'closed' },
    { number: '12', betType: '2ล่าง', currentAmount: 25000, limit: 40000, status: 'open' },
  ]);

  // General settings
  const [generalSettings, setGeneralSettings] = useState({
    minDeposit: 100,
    minWithdraw: 100,
    maxWithdraw: 100000,
    minBetPerBill: 10,
    maxBetPerBill: 100000,
    commissionRate: 2,
    autoCloseAtLimit: true,
    allowPartialBet: false,
  });

  const handleUpdatePayoutRate = (index: number, field: keyof PayoutRate, value: number) => {
    const updated = [...payoutRates];
    updated[index] = { ...updated[index], [field]: value };
    setPayoutRates(updated);
  };

  const handleSavePayoutRates = () => {
    alert('บันทึกอัตราจ่ายเรียบร้อย!');
  };

  const handleResetPayoutRates = () => {
    if (confirm('ต้องการรีเซ็ตอัตราจ่ายเป็นค่าเริ่มต้นใช่หรือไม่?')) {
      setPayoutRates([
        { betType: '3 ตัวบน', rate: 850, minBet: 1, maxBet: 10000, maxPayout: 8500000 },
        { betType: '3 ตัวโต๊ด', rate: 150, minBet: 1, maxBet: 10000, maxPayout: 1500000 },
        { betType: '3 ตัวหน้า', rate: 850, minBet: 1, maxBet: 10000, maxPayout: 8500000 },
        { betType: '2 ตัวบน', rate: 95, minBet: 1, maxBet: 10000, maxPayout: 950000 },
        { betType: '2 ตัวล่าง', rate: 95, minBet: 1, maxBet: 10000, maxPayout: 950000 },
        { betType: 'วิ่งบน', rate: 3.5, minBet: 1, maxBet: 10000, maxPayout: 35000 },
        { betType: 'วิ่งล่าง', rate: 4.5, minBet: 1, maxBet: 10000, maxPayout: 45000 },
      ]);
      alert('รีเซ็ตอัตราจ่ายเรียบร้อย!');
    }
  };

  const handleToggleNumberLimit = (index: number) => {
    const updated = [...numberLimits];
    updated[index].status = updated[index].status === 'open' ? 'closed' : 'open';
    setNumberLimits(updated);
  };

  const handleUpdateNumberLimit = (index: number, newLimit: number) => {
    const updated = [...numberLimits];
    updated[index].limit = newLimit;
    setNumberLimits(updated);
  };

  const handleSaveGeneralSettings = () => {
    alert('บันทึกการตั้งค่าทั่วไปเรียบร้อย!');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">⚙️ ตั้งค่าหวย</h1>
            <p className="text-gray-600 mt-1">จัดการอัตราจ่าย ลิมิต และการตั้งค่าต่างๆ</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('payout')}
            className={`px-6 py-3 font-bold transition-colors ${
              activeTab === 'payout'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <DollarSign size={20} />
              อัตราจ่าย
            </div>
          </button>
          <button
            onClick={() => setActiveTab('limits')}
            className={`px-6 py-3 font-bold transition-colors ${
              activeTab === 'limits'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Lock size={20} />
              ลิมิตเลข
            </div>
          </button>
          <button
            onClick={() => setActiveTab('general')}
            className={`px-6 py-3 font-bold transition-colors ${
              activeTab === 'general'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Settings size={20} />
              ตั้งค่าทั่วไป
            </div>
          </button>
        </div>

        {/* Payout Rates Tab */}
        {activeTab === 'payout' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-4 md:p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">อัตราจ่ายและขีดจำกัด</h2>
                <div className="flex gap-3">
                  <button
                    onClick={handleResetPayoutRates}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                  >
                    <RotateCcw size={18} />
                    รีเซ็ต
                  </button>
                  <button
                    onClick={handleSavePayoutRates}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
                  >
                    <Save size={18} />
                    บันทึก
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-blue-50 border-b-2 border-blue-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-bold text-gray-700">ประเภท</th>
                      <th className="px-4 py-3 text-center font-bold text-gray-700">อัตราจ่าย</th>
                      <th className="px-4 py-3 text-center font-bold text-gray-700">แทงขั้นต่ำ</th>
                      <th className="px-4 py-3 text-center font-bold text-gray-700">แทงสูงสุด</th>
                      <th className="px-4 py-3 text-center font-bold text-gray-700">จ่ายสูงสุด</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {payoutRates.map((rate, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <span className="font-bold text-gray-900">{rate.betType}</span>
                        </td>
                        <td className="px-4 py-4">
                          <input
                            type="number"
                            value={rate.rate}
                            onChange={(e) => handleUpdatePayoutRate(index, 'rate', parseFloat(e.target.value))}
                            className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-center font-bold focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-gray-600">เท่า</span>
                        </td>
                        <td className="px-4 py-4">
                          <input
                            type="number"
                            value={rate.minBet}
                            onChange={(e) => handleUpdatePayoutRate(index, 'minBet', parseInt(e.target.value))}
                            className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-center font-bold focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-gray-600">บาท</span>
                        </td>
                        <td className="px-4 py-4">
                          <input
                            type="number"
                            value={rate.maxBet}
                            onChange={(e) => handleUpdatePayoutRate(index, 'maxBet', parseInt(e.target.value))}
                            className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-center font-bold focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-gray-600">บาท</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="font-bold text-blue-600">
                            ฿{rate.maxPayout.toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                <div className="text-sm text-gray-700">
                  <p className="font-bold mb-1">คำแนะนำ:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>อัตราจ่ายมาตรฐาน: 3บน=850, 3โต๊ด=150, 2บน/2ล่าง=95</li>
                    <li>ควรตั้งแทงขั้นต่ำไม่ต่ำกว่า 1 บาท</li>
                    <li>จ่ายสูงสุดคำนวณจาก: แทงสูงสุด × อัตราจ่าย</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Number Limits Tab */}
        {activeTab === 'limits' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-4 md:p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">ลิมิตเลข (ปิดรับเลข)</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors">
                  <Lock size={18} />
                  ปิดรับทั้งหมด
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-blue-50 border-b-2 border-blue-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-bold text-gray-700">เลข</th>
                      <th className="px-4 py-3 text-left font-bold text-gray-700">ประเภท</th>
                      <th className="px-4 py-3 text-right font-bold text-gray-700">ยอดปัจจุบัน</th>
                      <th className="px-4 py-3 text-right font-bold text-gray-700">ลิมิต</th>
                      <th className="px-4 py-3 text-center font-bold text-gray-700">ใช้ไป</th>
                      <th className="px-4 py-3 text-center font-bold text-gray-700">สถานะ</th>
                      <th className="px-4 py-3 text-center font-bold text-gray-700">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {numberLimits.map((limit, index) => {
                      const percentage = (limit.currentAmount / limit.limit) * 100;
                      const isNearLimit = percentage >= 80;
                      const isFull = percentage >= 100;
                      
                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <span className="font-mono text-xl font-bold text-gray-900">{limit.number}</span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                              {limit.betType}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right font-bold text-gray-900">
                            ฿{limit.currentAmount.toLocaleString()}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <input
                              type="number"
                              value={limit.limit}
                              onChange={(e) => handleUpdateNumberLimit(index, parseInt(e.target.value))}
                              className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-right font-bold focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all ${
                                    isFull ? 'bg-gray-600' : isNearLimit ? 'bg-blue-400' : 'bg-blue-600'
                                  }`}
                                  style={{ width: `${Math.min(percentage, 100)}%` }}
                                />
                              </div>
                              <span className={`text-sm font-bold ${isFull ? 'text-gray-900' : 'text-blue-600'}`}>
                                {percentage.toFixed(0)}%
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              limit.status === 'open' ? 'bg-blue-100 text-blue-700' : 'bg-gray-300 text-gray-900'
                            }`}>
                              {limit.status === 'open' ? 'เปิดรับ' : 'ปิดรับ'}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <button
                              onClick={() => handleToggleNumberLimit(index)}
                              className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                                limit.status === 'open'
                                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                  : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}
                            >
                              {limit.status === 'open' ? 'ปิดรับ' : 'เปิดรับ'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                <div className="text-sm text-gray-700">
                  <p className="font-bold mb-1">คำแนะนำ:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>เมื่อยอดแทงถึงลิมิต ระบบจะปิดรับเลขนั้นอัตโนมัติ</li>
                    <li>สามารถเปิด-ปิดรับเลขด้วยตนเองได้</li>
                    <li>แถบสีน้ำเงินแสดงเปอร์เซ็นต์การใช้ลิมิต</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* General Settings Tab */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-4 md:p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">ตั้งค่าทั่วไป</h2>
                <button
                  onClick={handleSaveGeneralSettings}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
                >
                  <Save size={18} />
                  บันทึก
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <DollarSign size={20} className="text-blue-600" />
                    การฝาก-ถอน
                  </h3>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">ฝากขั้นต่ำ (บาท)</label>
                    <input
                      type="number"
                      value={generalSettings.minDeposit}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, minDeposit: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">ถอนขั้นต่ำ (บาท)</label>
                    <input
                      type="number"
                      value={generalSettings.minWithdraw}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, minWithdraw: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">ถอนสูงสุด (บาท)</label>
                    <input
                      type="number"
                      value={generalSettings.maxWithdraw}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, maxWithdraw: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <TrendingUp size={20} className="text-blue-600" />
                    การแทง
                  </h3>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">แทงขั้นต่ำต่อโพย (บาท)</label>
                    <input
                      type="number"
                      value={generalSettings.minBetPerBill}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, minBetPerBill: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">แทงสูงสุดต่อโพย (บาท)</label>
                    <input
                      type="number"
                      value={generalSettings.maxBetPerBill}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, maxBetPerBill: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">อัตราค่าคอม (%)</label>
                    <input
                      type="number"
                      value={generalSettings.commissionRate}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, commissionRate: parseFloat(e.target.value) })}
                      step="0.1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Settings size={20} className="text-blue-600" />
                  ตัวเลือกเพิ่มเติม
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={generalSettings.autoCloseAtLimit}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, autoCloseAtLimit: e.target.checked })}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">ปิดรับเลขอัตโนมัติเมื่อถึงลิมิต</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={generalSettings.allowPartialBet}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, allowPartialBet: e.target.checked })}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">อนุญาตให้แทงบางส่วนเมื่อเลขเต็ม</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
