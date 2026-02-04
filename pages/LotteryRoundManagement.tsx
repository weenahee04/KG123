import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Plus,
  Edit,
  Trash2,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Download
} from 'lucide-react';

interface LotteryRound {
  id: string;
  lotteryType: 'government' | 'yiki' | 'hanoi' | 'laos' | 'stock';
  roundNumber: string;
  drawDate: Date;
  openTime: Date;
  closeTime: Date;
  status: 'waiting' | 'open' | 'closed' | 'announced' | 'paid';
  totalBets: number;
  totalAmount: number;
  totalPayout: number;
  result?: {
    top3: string;
    twoTop: string;
    twoBottom: string;
    threeTodd: string[];
    runTop: string;
    runBottom: string;
  };
}

export default function LotteryRoundManagement() {
  const [rounds, setRounds] = useState<LotteryRound[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedRound, setSelectedRound] = useState<LotteryRound | null>(null);

  // Form states
  const [formType, setFormType] = useState<string>('government');
  const [formRoundNumber, setFormRoundNumber] = useState('');
  const [formDrawDate, setFormDrawDate] = useState('');
  const [formOpenTime, setFormOpenTime] = useState('');
  const [formCloseTime, setFormCloseTime] = useState('');

  // Result form states
  const [resultTop3, setResultTop3] = useState('');
  const [resultTwoTop, setResultTwoTop] = useState('');
  const [resultTwoBottom, setResultTwoBottom] = useState('');
  const [resultRunTop, setResultRunTop] = useState('');
  const [resultRunBottom, setResultRunBottom] = useState('');

  useEffect(() => {
    loadRounds();
  }, []);

  const loadRounds = () => {
    const mockRounds: LotteryRound[] = [
      {
        id: '1',
        lotteryType: 'government',
        roundNumber: '16/02/2567',
        drawDate: new Date('2024-02-16'),
        openTime: new Date('2024-02-01 00:00'),
        closeTime: new Date('2024-02-16 14:30'),
        status: 'announced',
        totalBets: 8567,
        totalAmount: 2450000,
        totalPayout: 1850000,
        result: {
          top3: '123',
          twoTop: '23',
          twoBottom: '45',
          threeTodd: ['123', '132', '213', '231', '312', '321'],
          runTop: '3',
          runBottom: '5',
        },
      },
      {
        id: '2',
        lotteryType: 'yiki',
        roundNumber: 'รอบที่ 45',
        drawDate: new Date(),
        openTime: new Date(Date.now() - 3600000),
        closeTime: new Date(Date.now() + 300000),
        status: 'open',
        totalBets: 234,
        totalAmount: 45600,
        totalPayout: 0,
      },
      {
        id: '3',
        lotteryType: 'hanoi',
        roundNumber: '04/02/2567',
        drawDate: new Date(),
        openTime: new Date(Date.now() - 7200000),
        closeTime: new Date(Date.now() - 1800000),
        status: 'closed',
        totalBets: 1234,
        totalAmount: 567800,
        totalPayout: 0,
      },
      {
        id: '4',
        lotteryType: 'government',
        roundNumber: '01/03/2567',
        drawDate: new Date('2024-03-01'),
        openTime: new Date('2024-02-15 00:00'),
        closeTime: new Date('2024-03-01 14:30'),
        status: 'waiting',
        totalBets: 0,
        totalAmount: 0,
        totalPayout: 0,
      },
    ];
    setRounds(mockRounds);
  };

  const getLotteryTypeLabel = (type: string) => {
    const labels = {
      government: 'รัฐบาล',
      yiki: 'ยี่กี',
      hanoi: 'ฮานอย',
      laos: 'ลาว',
      stock: 'หุ้น',
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      waiting: 'bg-gray-100 text-gray-700',
      open: 'bg-blue-100 text-blue-700',
      closed: 'bg-gray-300 text-gray-900',
      announced: 'bg-blue-600 text-white',
      paid: 'bg-blue-100 text-blue-700',
    };
    const labels = {
      waiting: 'รอเปิด',
      open: 'เปิดรับ',
      closed: 'ปิดรับ',
      announced: 'ประกาศผล',
      paid: 'จ่ายแล้ว',
    };
    return { style: styles[status as keyof typeof styles] || styles.waiting, label: labels[status as keyof typeof labels] || status };
  };

  const handleAddRound = () => {
    if (!formRoundNumber || !formDrawDate || !formOpenTime || !formCloseTime) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    const newRound: LotteryRound = {
      id: String(rounds.length + 1),
      lotteryType: formType as any,
      roundNumber: formRoundNumber,
      drawDate: new Date(formDrawDate),
      openTime: new Date(formOpenTime),
      closeTime: new Date(formCloseTime),
      status: 'waiting',
      totalBets: 0,
      totalAmount: 0,
      totalPayout: 0,
    };

    setRounds([...rounds, newRound]);
    setShowAddModal(false);
    resetForm();
    alert('เพิ่มงวดใหม่เรียบร้อย!');
  };

  const handleOpenRound = (round: LotteryRound) => {
    setRounds(rounds.map(r => r.id === round.id ? { ...r, status: 'open' } : r));
    alert(`เปิดรับแทง ${round.roundNumber} แล้ว!`);
  };

  const handleCloseRound = (round: LotteryRound) => {
    setRounds(rounds.map(r => r.id === round.id ? { ...r, status: 'closed' } : r));
    alert(`ปิดรับแทง ${round.roundNumber} แล้ว!`);
  };

  const handleAnnounceResult = () => {
    if (!selectedRound || !resultTop3 || !resultTwoTop || !resultTwoBottom) {
      alert('กรุณากรอกผลรางวัลให้ครบถ้วน');
      return;
    }

    const threeTodd = generateThreeTodd(resultTop3);
    const result = {
      top3: resultTop3,
      twoTop: resultTwoTop,
      twoBottom: resultTwoBottom,
      threeTodd: threeTodd,
      runTop: resultRunTop || resultTop3.slice(-1),
      runBottom: resultRunBottom || resultTwoBottom.slice(-1),
    };

    setRounds(rounds.map(r => 
      r.id === selectedRound.id 
        ? { ...r, status: 'announced', result } 
        : r
    ));

    setShowResultModal(false);
    resetResultForm();
    alert('ประกาศผลรางวัลเรียบร้อย!');
  };

  const generateThreeTodd = (number: string) => {
    const digits = number.split('');
    const permutations: string[] = [];
    
    const permute = (arr: string[], m: string[] = []) => {
      if (arr.length === 0) {
        permutations.push(m.join(''));
      } else {
        for (let i = 0; i < arr.length; i++) {
          const curr = arr.slice();
          const next = curr.splice(i, 1);
          permute(curr.slice(), m.concat(next));
        }
      }
    };
    
    permute(digits);
    return [...new Set(permutations)];
  };

  const handleDeleteRound = (round: LotteryRound) => {
    if (round.status !== 'waiting') {
      alert('ไม่สามารถลบงวดที่เปิดรับแทงแล้ว');
      return;
    }
    if (confirm(`ต้องการลบงวด ${round.roundNumber} ใช่หรือไม่?`)) {
      setRounds(rounds.filter(r => r.id !== round.id));
      alert('ลบงวดเรียบร้อย!');
    }
  };

  const resetForm = () => {
    setFormType('government');
    setFormRoundNumber('');
    setFormDrawDate('');
    setFormOpenTime('');
    setFormCloseTime('');
  };

  const resetResultForm = () => {
    setResultTop3('');
    setResultTwoTop('');
    setResultTwoBottom('');
    setResultRunTop('');
    setResultRunBottom('');
    setSelectedRound(null);
  };

  const filteredRounds = rounds.filter(round => {
    const matchSearch = round.roundNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === 'all' || round.lotteryType === filterType;
    const matchStatus = filterStatus === 'all' || round.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  const stats = {
    total: rounds.length,
    open: rounds.filter(r => r.status === 'open').length,
    closed: rounds.filter(r => r.status === 'closed').length,
    announced: rounds.filter(r => r.status === 'announced').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">🎰 จัดการงวดหวย</h1>
            <p className="text-gray-600 mt-1">สร้างและจัดการงวดหวยทุกประเภท</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold hover:bg-blue-700 transition-all"
          >
            <Plus size={20} />
            เพิ่มงวดใหม่
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-3 md:p-4 border border-gray-200">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 md:p-3 bg-blue-100 rounded-lg">
                <Calendar size={20} className="text-blue-600 md:w-6 md:h-6" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600">งวดทั้งหมด</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-3 md:p-4 border border-gray-200">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 md:p-3 bg-blue-100 rounded-lg">
                <Unlock size={20} className="text-blue-600 md:w-6 md:h-6" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600">เปิดรับ</p>
                <p className="text-xl md:text-2xl font-bold text-blue-600">{stats.open}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-3 md:p-4 border border-gray-200">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 md:p-3 bg-blue-100 rounded-lg">
                <Lock size={20} className="text-blue-600 md:w-6 md:h-6" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600">ปิดรับ</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900">{stats.closed}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-3 md:p-4 border border-gray-200">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 md:p-3 bg-blue-100 rounded-lg">
                <CheckCircle size={20} className="text-blue-600 md:w-6 md:h-6" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600">ประกาศผล</p>
                <p className="text-xl md:text-2xl font-bold text-blue-600">{stats.announced}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-4 md:p-6 border border-gray-200">
          <div className="flex flex-col gap-3 md:gap-4 mb-4 md:mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="ค้นหางวด..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">ประเภททั้งหมด</option>
              <option value="government">รัฐบาล</option>
              <option value="yiki">ยี่กี</option>
              <option value="hanoi">ฮานอย</option>
              <option value="laos">ลาว</option>
              <option value="stock">หุ้น</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">สถานะทั้งหมด</option>
              <option value="waiting">รอเปิด</option>
              <option value="open">เปิดรับ</option>
              <option value="closed">ปิดรับ</option>
              <option value="announced">ประกาศผล</option>
              <option value="paid">จ่ายแล้ว</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-50 border-b-2 border-blue-200">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">ประเภท</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">งวด</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">วันที่ออก</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">เวลาเปิด-ปิด</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-700">สถานะ</th>
                  <th className="px-4 py-3 text-right font-bold text-gray-700">โพย</th>
                  <th className="px-4 py-3 text-right font-bold text-gray-700">ยอดรวม</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-700">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRounds.map((round) => {
                  const statusBadge = getStatusBadge(round.status);
                  return (
                    <tr key={round.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          {getLotteryTypeLabel(round.lotteryType)}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-bold text-gray-900">{round.roundNumber}</td>
                      <td className="px-4 py-4 text-gray-600">
                        {round.drawDate.toLocaleDateString('th-TH')}
                      </td>
                      <td className="px-4 py-4 text-gray-600 text-sm">
                        {round.openTime.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} - 
                        {round.closeTime.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadge.style}`}>
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right font-bold text-gray-900">
                        {round.totalBets.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-right font-bold text-blue-600">
                        ฿{round.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {round.status === 'waiting' && (
                            <button
                              onClick={() => handleOpenRound(round)}
                              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                              title="เปิดรับแทง"
                            >
                              <Unlock size={18} />
                            </button>
                          )}
                          {round.status === 'open' && (
                            <button
                              onClick={() => handleCloseRound(round)}
                              className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                              title="ปิดรับแทง"
                            >
                              <Lock size={18} />
                            </button>
                          )}
                          {round.status === 'closed' && (
                            <button
                              onClick={() => {
                                setSelectedRound(round);
                                setShowResultModal(true);
                              }}
                              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                              title="ประกาศผล"
                            >
                              <CheckCircle size={18} />
                            </button>
                          )}
                          {round.status === 'waiting' && (
                            <button
                              onClick={() => handleDeleteRound(round)}
                              className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                              title="ลบ"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Round Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">เพิ่มงวดใหม่</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">ประเภทหวย</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="government">รัฐบาล</option>
                  <option value="yiki">ยี่กี</option>
                  <option value="hanoi">ฮานอย</option>
                  <option value="laos">ลาว</option>
                  <option value="stock">หุ้น</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">งวดที่</label>
                <input
                  type="text"
                  value={formRoundNumber}
                  onChange={(e) => setFormRoundNumber(e.target.value)}
                  placeholder="เช่น 16/02/2567 หรือ รอบที่ 45"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">วันที่ออกรางวัล</label>
                <input
                  type="date"
                  value={formDrawDate}
                  onChange={(e) => setFormDrawDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">เวลาเปิดรับ</label>
                  <input
                    type="datetime-local"
                    value={formOpenTime}
                    onChange={(e) => setFormOpenTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">เวลาปิดรับ</label>
                  <input
                    type="datetime-local"
                    value={formCloseTime}
                    onChange={(e) => setFormCloseTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleAddRound}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all"
              >
                เพิ่มงวด
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Announce Result Modal */}
      {showResultModal && selectedRound && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">ประกาศผลรางวัล</h2>
              <p className="text-gray-600 mt-1">{selectedRound.roundNumber}</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">3 ตัวบน</label>
                <input
                  type="text"
                  value={resultTop3}
                  onChange={(e) => setResultTop3(e.target.value.slice(0, 3))}
                  placeholder="123"
                  maxLength={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-center text-2xl font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">2 ตัวบน</label>
                  <input
                    type="text"
                    value={resultTwoTop}
                    onChange={(e) => setResultTwoTop(e.target.value.slice(0, 2))}
                    placeholder="23"
                    maxLength={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-center text-2xl font-bold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">2 ตัวล่าง</label>
                  <input
                    type="text"
                    value={resultTwoBottom}
                    onChange={(e) => setResultTwoBottom(e.target.value.slice(0, 2))}
                    placeholder="45"
                    maxLength={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-center text-2xl font-bold"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">วิ่งบน (ถ้ามี)</label>
                  <input
                    type="text"
                    value={resultRunTop}
                    onChange={(e) => setResultRunTop(e.target.value.slice(0, 1))}
                    placeholder="3"
                    maxLength={1}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-center text-2xl font-bold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">วิ่งล่าง (ถ้ามี)</label>
                  <input
                    type="text"
                    value={resultRunBottom}
                    onChange={(e) => setResultRunBottom(e.target.value.slice(0, 1))}
                    placeholder="5"
                    maxLength={1}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-center text-2xl font-bold"
                  />
                </div>
              </div>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">3 ตัวโต๊ด (สร้างอัตโนมัติ):</p>
                {resultTop3.length === 3 && (
                  <div className="flex flex-wrap gap-2">
                    {generateThreeTodd(resultTop3).map((num, idx) => (
                      <span key={idx} className="px-3 py-1 bg-white border border-blue-300 rounded text-sm font-bold">
                        {num}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setShowResultModal(false);
                  resetResultForm();
                }}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleAnnounceResult}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all"
              >
                ประกาศผล
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
