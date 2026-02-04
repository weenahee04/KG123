import React, { useState, useEffect } from 'react';
import { 
  Grid3x3,
  Search,
  Filter,
  Download,
  RefreshCw,
  TrendingUp,
  AlertCircle,
  Users,
  DollarSign
} from 'lucide-react';

interface NumberBet {
  number: string;
  betType: '3top' | '3tod' | '2top' | '2bottom' | 'run-top' | 'run-bottom';
  totalAmount: number;
  betCount: number;
  customers: {
    username: string;
    amount: number;
    time: string;
  }[];
}

interface GridStats {
  totalNumbers: number;
  totalAmount: number;
  totalBets: number;
  hotNumbers: number;
}

export default function LotteryNumberGrid() {
  const [selectedRound, setSelectedRound] = useState('16/02/2567');
  const [selectedType, setSelectedType] = useState<string>('3top');
  const [searchNumber, setSearchNumber] = useState('');
  const [filterAmount, setFilterAmount] = useState<string>('all');
  const [numberBets, setNumberBets] = useState<NumberBet[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<NumberBet | null>(null);

  useEffect(() => {
    loadNumberBets();
  }, [selectedRound, selectedType]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        loadNumberBets();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const loadNumberBets = () => {
    // Mock data - ตัวอย่างข้อมูลการแทง
    const mockBets: NumberBet[] = [];
    
    // สร้างข้อมูลตัวอย่าง 100 เลข (000-099)
    for (let i = 0; i < 100; i++) {
      const number = i.toString().padStart(3, '0');
      const betCount = Math.floor(Math.random() * 20);
      const totalAmount = betCount > 0 ? Math.floor(Math.random() * 50000) + 1000 : 0;
      
      const customers = [];
      for (let j = 0; j < betCount; j++) {
        customers.push({
          username: `user${Math.floor(Math.random() * 1000)}`,
          amount: Math.floor(Math.random() * 5000) + 100,
          time: `${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
        });
      }

      mockBets.push({
        number,
        betType: selectedType as any,
        totalAmount,
        betCount,
        customers
      });
    }

    setNumberBets(mockBets);
  };

  const filteredNumbers = numberBets.filter(bet => {
    const matchSearch = searchNumber === '' || bet.number.includes(searchNumber);
    let matchAmount = true;
    
    if (filterAmount === 'high') {
      matchAmount = bet.totalAmount > 10000;
    } else if (filterAmount === 'medium') {
      matchAmount = bet.totalAmount > 5000 && bet.totalAmount <= 10000;
    } else if (filterAmount === 'low') {
      matchAmount = bet.totalAmount > 0 && bet.totalAmount <= 5000;
    } else if (filterAmount === 'none') {
      matchAmount = bet.totalAmount === 0;
    }
    
    return matchSearch && matchAmount;
  });

  const stats: GridStats = {
    totalNumbers: numberBets.filter(b => b.totalAmount > 0).length,
    totalAmount: numberBets.reduce((sum, b) => sum + b.totalAmount, 0),
    totalBets: numberBets.reduce((sum, b) => sum + b.betCount, 0),
    hotNumbers: numberBets.filter(b => b.totalAmount > 10000).length
  };

  const getNumberColor = (amount: number) => {
    if (amount === 0) return 'bg-gray-100 text-gray-400 border-gray-200';
    if (amount > 20000) return 'bg-red-100 text-red-900 border-red-300 font-bold';
    if (amount > 10000) return 'bg-orange-100 text-orange-900 border-orange-300 font-bold';
    if (amount > 5000) return 'bg-yellow-100 text-yellow-900 border-yellow-300';
    return 'bg-gray-200 text-gray-900 border-gray-300';
  };

  const getBetTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      '3top': '3 ตัวบน',
      '3tod': '3 ตัวโต๊ด',
      '2top': '2 ตัวบน',
      '2bottom': '2 ตัวล่าง',
      'run-top': 'วิ่งบน',
      'run-bottom': 'วิ่งล่าง'
    };
    return labels[type] || type;
  };

  const handleNumberClick = (bet: NumberBet) => {
    if (bet.totalAmount > 0) {
      setSelectedNumber(bet);
      setShowDetailModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">📊 ตารางเลขแทง</h1>
            <p className="text-gray-600 mt-1">ดูภาพรวมการแทงของลูกค้าทั้งหมด</p>
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
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all">
              <Download size={18} />
              Export
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-3 md:p-4 border border-gray-200">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 md:p-3 bg-blue-100 rounded-lg">
                <Grid3x3 size={20} className="text-blue-600 md:w-6 md:h-6" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600">เลขที่มีคนแทง</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900">{stats.totalNumbers}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-3 md:p-4 border border-gray-200">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 md:p-3 bg-blue-100 rounded-lg">
                <Users size={20} className="text-blue-600 md:w-6 md:h-6" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600">โพยทั้งหมด</p>
                <p className="text-xl md:text-2xl font-bold text-blue-600">{stats.totalBets}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-3 md:p-4 border border-gray-200">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 md:p-3 bg-blue-100 rounded-lg">
                <DollarSign size={20} className="text-blue-600 md:w-6 md:h-6" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600">ยอดรวม</p>
                <p className="text-xl md:text-2xl font-bold text-blue-600">฿{stats.totalAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-3 md:p-4 border border-gray-200">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 md:p-3 bg-blue-100 rounded-lg">
                <TrendingUp size={20} className="text-blue-600 md:w-6 md:h-6" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600">เลขฮอต</p>
                <p className="text-xl md:text-2xl font-bold text-red-600">{stats.hotNumbers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-4 md:p-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">งวดหวย</label>
              <select
                value={selectedRound}
                onChange={(e) => setSelectedRound(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="16/02/2567">16/02/2567 - รัฐบาล</option>
                <option value="15/02/2567">15/02/2567 - ยี่กี รอบ 14:00</option>
                <option value="14/02/2567">14/02/2567 - ฮานอย</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">ประเภท</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="3top">3 ตัวบน</option>
                <option value="3tod">3 ตัวโต๊ด</option>
                <option value="2top">2 ตัวบน</option>
                <option value="2bottom">2 ตัวล่าง</option>
                <option value="run-top">วิ่งบน</option>
                <option value="run-bottom">วิ่งล่าง</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">ค้นหาเลข</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="ค้นหาเลข..."
                  value={searchNumber}
                  onChange={(e) => setSearchNumber(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">กรองตามยอด</label>
              <select
                value={filterAmount}
                onChange={(e) => setFilterAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">ทั้งหมด</option>
                <option value="high">สูง (&gt;10,000)</option>
                <option value="medium">ปานกลาง (5,000-10,000)</option>
                <option value="low">ต่ำ (&lt;5,000)</option>
                <option value="none">ไม่มีคนแทง</option>
              </select>
            </div>
          </div>

          {/* Color Legend */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm font-bold text-gray-700 mb-2">สีแสดงระดับยอดแทง:</p>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-100 border border-gray-200 rounded"></div>
                <span className="text-xs text-gray-600">ไม่มีคนแทง</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-200 border border-gray-300 rounded"></div>
                <span className="text-xs text-gray-600">&lt;5,000 บาท</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-yellow-100 border border-yellow-300 rounded"></div>
                <span className="text-xs text-gray-600">5,000-10,000 บาท</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-orange-100 border border-orange-300 rounded"></div>
                <span className="text-xs text-gray-600">10,000-20,000 บาท</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-red-100 border border-red-300 rounded"></div>
                <span className="text-xs text-gray-600">&gt;20,000 บาท (อันตราย!)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Number Grid */}
        <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-4 md:p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              ตารางเลข {getBetTypeLabel(selectedType)}
            </h2>
            <p className="text-sm text-gray-600">
              แสดง {filteredNumbers.length} เลข
            </p>
          </div>

          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {filteredNumbers.map((bet) => (
              <div
                key={bet.number}
                onClick={() => handleNumberClick(bet)}
                className={`relative border-2 rounded-lg p-3 cursor-pointer hover:shadow-lg hover:scale-105 transition-all ${getNumberColor(bet.totalAmount)}`}
                title={`เลข ${bet.number}\nยอดรวม: ${bet.totalAmount.toLocaleString()} บาท\nโพย: ${bet.betCount} ใบ\n${bet.totalAmount > 0 ? 'คลิกเพื่อดูรายละเอียด' : ''}`}
              >
                <div className="text-center">
                  <p className="text-lg md:text-xl font-bold">{bet.number}</p>
                  {bet.totalAmount > 0 && (
                    <>
                      <p className="text-xs mt-1">฿{(bet.totalAmount / 1000).toFixed(1)}K</p>
                      <p className="text-xs text-gray-600">{bet.betCount} โพย</p>
                    </>
                  )}
                </div>
                {bet.totalAmount > 20000 && (
                  <div className="absolute -top-1 -right-1">
                    <AlertCircle size={16} className="text-red-600" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredNumbers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">ไม่พบข้อมูลตามเงื่อนไขที่เลือก</p>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-blue-600 mt-0.5" />
            <div>
              <p className="font-bold text-blue-900 mb-1">คำแนะนำ:</p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• คลิกที่เลขเพื่อดูรายละเอียดการแทงของลูกค้า</li>
                <li>• สีแดง = เลขที่มียอดแทงสูงมาก ควระวัง!</li>
                <li>• เปิด Auto Refresh เพื่ออัพเดทข้อมูลทุก 5 วินาที</li>
                <li>• ใช้ตัวกรองเพื่อค้นหาเลขที่ต้องการตรวจสอบ</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Customer Detail Modal */}
        {showDetailModal && selectedNumber && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="bg-blue-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">เลข {selectedNumber.number}</h2>
                    <p className="text-blue-100 mt-1">{getBetTypeLabel(selectedNumber.betType)}</p>
                  </div>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-white hover:bg-blue-700 p-2 rounded-lg transition-colors"
                  >
                    ✕
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="bg-blue-700 rounded-lg p-3">
                    <p className="text-xs text-blue-200">ยอดรวม</p>
                    <p className="text-xl font-bold">฿{selectedNumber.totalAmount.toLocaleString()}</p>
                  </div>
                  <div className="bg-blue-700 rounded-lg p-3">
                    <p className="text-xs text-blue-200">จำนวนโพย</p>
                    <p className="text-xl font-bold">{selectedNumber.betCount} ใบ</p>
                  </div>
                  <div className="bg-blue-700 rounded-lg p-3">
                    <p className="text-xs text-blue-200">เฉลี่ย/โพย</p>
                    <p className="text-xl font-bold">฿{Math.round(selectedNumber.totalAmount / selectedNumber.betCount).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <h3 className="text-lg font-bold text-gray-900 mb-4">รายชื่อลูกค้าที่แทง ({selectedNumber.customers.length} คน)</h3>
                <div className="space-y-3">
                  {selectedNumber.customers.map((customer, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{customer.username}</p>
                          <p className="text-sm text-gray-500">{customer.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600">฿{customer.amount.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">แทง</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 p-4 border-t border-gray-200">
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                  >
                    ปิด
                  </button>
                  <button
                    onClick={() => alert('ฟีเจอร์ Export รายชื่อ')}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
                  >
                    <Download size={18} className="inline mr-2" />
                    Export รายชื่อ
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
