import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Calendar, 
  Search, 
  Save,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  DollarSign,
  FileText
} from 'lucide-react';

interface LotteryDraw {
  id: string;
  drawNumber: string;
  drawDate: Date;
  type: string;
  status: 'pending' | 'announced' | 'paid';
  results?: {
    threeDigitTop?: string;
    twoDigitTop?: string;
    twoDigitBottom?: string;
  };
  stats?: {
    totalBets: number;
    totalAmount: number;
    totalWinners: number;
    totalPayout: number;
  };
}

export default function ResultAnnouncement() {
  const [draws, setDraws] = useState<LotteryDraw[]>([]);
  const [selectedDraw, setSelectedDraw] = useState<LotteryDraw | null>(null);
  const [threeDigitTop, setThreeDigitTop] = useState('');
  const [twoDigitTop, setTwoDigitTop] = useState('');
  const [twoDigitBottom, setTwoDigitBottom] = useState('');
  const [showResultModal, setShowResultModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);

  useEffect(() => {
    loadDraws();
  }, []);

  const loadDraws = () => {
    const mockDraws: LotteryDraw[] = [
      {
        id: '1',
        drawNumber: 'DRAW20240216001',
        drawDate: new Date('2024-02-16'),
        type: 'หวยรัฐบาลไทย',
        status: 'pending',
      },
      {
        id: '2',
        drawNumber: 'DRAW20240201001',
        drawDate: new Date('2024-02-01'),
        type: 'หวยรัฐบาลไทย',
        status: 'announced',
        results: {
          threeDigitTop: '123',
          twoDigitTop: '45',
          twoDigitBottom: '67',
        },
        stats: {
          totalBets: 1250,
          totalAmount: 485000,
          totalWinners: 45,
          totalPayout: 1250000,
        },
      },
      {
        id: '3',
        drawNumber: 'DRAW20240116001',
        drawDate: new Date('2024-01-16'),
        type: 'หวยรัฐบาลไทย',
        status: 'paid',
        results: {
          threeDigitTop: '789',
          twoDigitTop: '12',
          twoDigitBottom: '34',
        },
        stats: {
          totalBets: 980,
          totalAmount: 320000,
          totalWinners: 28,
          totalPayout: 890000,
        },
      },
    ];
    setDraws(mockDraws);
  };

  const handleAnnounceResult = (draw: LotteryDraw) => {
    setSelectedDraw(draw);
    setThreeDigitTop('');
    setTwoDigitTop('');
    setTwoDigitBottom('');
    setShowResultModal(true);
  };

  const handleViewStats = (draw: LotteryDraw) => {
    setSelectedDraw(draw);
    setShowStatsModal(true);
  };

  const confirmAnnounce = () => {
    if (selectedDraw && threeDigitTop && twoDigitTop && twoDigitBottom) {
      const mockStats = {
        totalBets: Math.floor(Math.random() * 2000) + 500,
        totalAmount: Math.floor(Math.random() * 500000) + 200000,
        totalWinners: Math.floor(Math.random() * 100) + 20,
        totalPayout: Math.floor(Math.random() * 2000000) + 500000,
      };

      setDraws(draws.map(d => 
        d.id === selectedDraw.id 
          ? { 
              ...d, 
              status: 'announced' as const,
              results: {
                threeDigitTop,
                twoDigitTop,
                twoDigitBottom,
              },
              stats: mockStats,
            } 
          : d
      ));
      setShowResultModal(false);
      setSelectedDraw(null);
      setThreeDigitTop('');
      setTwoDigitTop('');
      setTwoDigitBottom('');
    }
  };

  const handlePayWinners = (draw: LotteryDraw) => {
    setDraws(draws.map(d => 
      d.id === draw.id 
        ? { ...d, status: 'paid' as const } 
        : d
    ));
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <AlertCircle size={14} />, label: 'รอประกาศผล' },
      announced: { bg: 'bg-blue-100', text: 'text-blue-700', icon: <Award size={14} />, label: 'ประกาศผลแล้ว' },
      paid: { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle size={14} />, label: 'จ่ายเงินแล้ว' },
    };
    const style = styles[status as keyof typeof styles] || styles.pending;
    return (
      <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${style.bg} ${style.text}`}>
        {style.icon}
        {style.label}
      </span>
    );
  };

  const stats = {
    pendingDraws: draws.filter(d => d.status === 'pending').length,
    announcedDraws: draws.filter(d => d.status === 'announced').length,
    totalPayout: draws.filter(d => d.stats).reduce((sum, d) => sum + (d.stats?.totalPayout || 0), 0),
    totalWinners: draws.filter(d => d.stats).reduce((sum, d) => sum + (d.stats?.totalWinners || 0), 0),
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🏆 ประกาศผลรางวัล</h1>
            <p className="text-gray-600 mt-1">ประกาศผลและจ่ายเงินรางวัล</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Calendar size={24} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">รอประกาศผล</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingDraws}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Award size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">ประกาศแล้ว</p>
                <p className="text-2xl font-bold text-blue-600">{stats.announcedDraws}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">ผู้ถูกรางวัล</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalWinners}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <DollarSign size={24} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">ยอดจ่ายรวม</p>
                <p className="text-xl font-bold text-purple-600">฿{stats.totalPayout.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">รายการงวดหวย</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-yellow-100 to-orange-100 border-b-2 border-orange-300">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">เลขงวด</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">ประเภท</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">วันที่ออก</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-700">ผลรางวัล</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-700">สถานะ</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-700">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {draws.map((draw) => (
                  <tr key={draw.id} className="hover:bg-yellow-50 transition-colors">
                    <td className="px-4 py-4">
                      <p className="font-mono font-bold text-gray-900">{draw.drawNumber}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
                        {draw.type}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-900">{draw.drawDate.toLocaleDateString('th-TH')}</p>
                    </td>
                    <td className="px-4 py-4">
                      {draw.results ? (
                        <div className="flex flex-col items-center gap-1">
                          <div className="flex gap-2">
                            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-lg font-mono font-bold text-lg shadow-lg">
                              {draw.results.threeDigitTop}
                            </span>
                          </div>
                          <div className="flex gap-2 text-xs">
                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-mono font-bold">
                              2บน: {draw.results.twoDigitTop}
                            </span>
                            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-mono font-bold">
                              2ล่าง: {draw.results.twoDigitBottom}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-center text-gray-400 text-sm">ยังไม่ประกาศ</p>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center">
                      {getStatusBadge(draw.status)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {draw.status === 'pending' && (
                          <button
                            onClick={() => handleAnnounceResult(draw)}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition-colors flex items-center gap-2"
                          >
                            <Award size={16} />
                            ประกาศผล
                          </button>
                        )}
                        {draw.status === 'announced' && (
                          <>
                            <button
                              onClick={() => handleViewStats(draw)}
                              className="px-4 py-2 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition-colors flex items-center gap-2"
                            >
                              <FileText size={16} />
                              ดูสถิติ
                            </button>
                            <button
                              onClick={() => handlePayWinners(draw)}
                              className="px-4 py-2 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition-colors flex items-center gap-2"
                            >
                              <CheckCircle size={16} />
                              จ่ายเงิน
                            </button>
                          </>
                        )}
                        {draw.status === 'paid' && (
                          <button
                            onClick={() => handleViewStats(draw)}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg font-bold hover:bg-gray-600 transition-colors flex items-center gap-2"
                          >
                            <FileText size={16} />
                            ดูสถิติ
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showResultModal && selectedDraw && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">ประกาศผลรางวัล</h3>
              <button
                onClick={() => setShowResultModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <AlertCircle size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-sm text-gray-600 mb-1">งวดวันที่</p>
                <p className="font-bold text-xl text-gray-900">{selectedDraw.drawDate.toLocaleDateString('th-TH')}</p>
                <p className="text-sm text-gray-600 mt-1">{selectedDraw.drawNumber}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    🥇 3 ตัวบน (3 หลัก)
                  </label>
                  <input
                    type="text"
                    value={threeDigitTop}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 3);
                      setThreeDigitTop(val);
                    }}
                    placeholder="000"
                    maxLength={3}
                    className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg text-center text-3xl font-mono font-bold focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      🥈 2 ตัวบน (2 หลัก)
                    </label>
                    <input
                      type="text"
                      value={twoDigitTop}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 2);
                        setTwoDigitTop(val);
                      }}
                      placeholder="00"
                      maxLength={2}
                      className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg text-center text-2xl font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      🥉 2 ตัวล่าง (2 หลัก)
                    </label>
                    <input
                      type="text"
                      value={twoDigitBottom}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 2);
                        setTwoDigitBottom(val);
                      }}
                      placeholder="00"
                      maxLength={2}
                      className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg text-center text-2xl font-mono font-bold focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  ⚠️ <strong>คำเตือน:</strong> การประกาศผลจะทำการคำนวณและจ่ายเงินรางวัลให้ผู้ถูกรางวัลทันที กรุณาตรวจสอบตัวเลขให้ถูกต้องก่อนกดยืนยัน
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowResultModal(false)}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={confirmAnnounce}
                  disabled={!threeDigitTop || !twoDigitTop || !twoDigitBottom || threeDigitTop.length !== 3 || twoDigitTop.length !== 2 || twoDigitBottom.length !== 2}
                  className="flex-1 py-3 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  ยืนยันประกาศผล
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showStatsModal && selectedDraw && selectedDraw.stats && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-3xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">สถิติงวด</h3>
              <button
                onClick={() => setShowStatsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <AlertCircle size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-sm text-gray-600 mb-1">งวดวันที่</p>
                <p className="font-bold text-xl text-gray-900">{selectedDraw.drawDate.toLocaleDateString('th-TH')}</p>
                <p className="text-sm text-gray-600 mt-1">{selectedDraw.drawNumber}</p>
              </div>

              {selectedDraw.results && (
                <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-2 border-orange-300">
                  <p className="text-sm text-gray-600 mb-3 text-center">ผลรางวัล</p>
                  <div className="flex justify-center gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">3 ตัวบน</p>
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-3 rounded-lg font-mono font-bold text-3xl shadow-lg inline-block">
                        {selectedDraw.results.threeDigitTop}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-center gap-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">2 ตัวบน</p>
                      <span className="bg-blue-500 text-white px-4 py-2 rounded-lg font-mono font-bold text-xl shadow inline-block">
                        {selectedDraw.results.twoDigitTop}
                      </span>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">2 ตัวล่าง</p>
                      <span className="bg-green-500 text-white px-4 py-2 rounded-lg font-mono font-bold text-xl shadow inline-block">
                        {selectedDraw.results.twoDigitBottom}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText size={20} className="text-blue-600" />
                    <p className="text-sm text-gray-600">จำนวนโพยทั้งหมด</p>
                  </div>
                  <p className="text-3xl font-bold text-blue-600">{selectedDraw.stats.totalBets.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign size={20} className="text-purple-600" />
                    <p className="text-sm text-gray-600">ยอดแทงรวม</p>
                  </div>
                  <p className="text-3xl font-bold text-purple-600">฿{selectedDraw.stats.totalAmount.toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Users size={20} className="text-green-600" />
                    <p className="text-sm text-gray-600">ผู้ถูกรางวัล</p>
                  </div>
                  <p className="text-3xl font-bold text-green-600">{selectedDraw.stats.totalWinners.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={20} className="text-red-600" />
                    <p className="text-sm text-gray-600">ยอดจ่ายรางวัล</p>
                  </div>
                  <p className="text-3xl font-bold text-red-600">฿{selectedDraw.stats.totalPayout.toLocaleString()}</p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-gray-700">กำไรสุทธิ</p>
                  <p className={`text-2xl font-bold ${selectedDraw.stats.totalAmount - selectedDraw.stats.totalPayout >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedDraw.stats.totalAmount - selectedDraw.stats.totalPayout >= 0 ? '+' : ''}฿{(selectedDraw.stats.totalAmount - selectedDraw.stats.totalPayout).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
