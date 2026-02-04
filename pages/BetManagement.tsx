import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Filter,
  Edit,
  X,
  Eye,
  Download,
  Calendar,
  Award,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { ticketAPI } from '../src/services/api';

interface Bet {
  id: string;
  betNumber: string;
  username: string;
  betType: string;
  numbers: Array<{ number: string; amount: number }>;
  totalAmount: number;
  discount: number;
  netAmount: number;
  drawDate: Date;
  betDate: Date;
  status: 'pending' | 'won' | 'lost' | 'cancelled';
  winAmount?: number;
}

export default function BetManagement() {
  const [bets, setBets] = useState<Bet[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterBetType, setFilterBetType] = useState<string>('all');
  const [selectedBet, setSelectedBet] = useState<Bet | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBets();
  }, []);

  const loadBets = async () => {
    try {
      setLoading(true);
      setError(null);

      const statusFilter = filterStatus === 'all' ? undefined : filterStatus.toUpperCase();
      const data = await ticketAPI.getTickets(undefined, undefined, statusFilter);

      const mappedBets = data.map(t => ({
        id: t.id,
        betNumber: t.id,
        username: t.username,
        betType: t.bets[0]?.betType || 'unknown',
        numbers: t.bets.map(b => ({ number: b.number, amount: b.amount })),
        totalAmount: t.totalAmount,
        discount: 0,
        netAmount: t.totalAmount,
        drawDate: new Date(),
        betDate: new Date(t.createdAt),
        status: t.status.toLowerCase() as 'pending' | 'won' | 'lost' | 'cancelled',
        winAmount: t.winAmount
      }));

      setBets(mappedBets);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load bets:', err);
      setError(err instanceof Error ? err.message : 'Failed to load bets');
      setLoading(false);
    }
  };

  const filteredBets = bets.filter(bet => {
    const matchSearch = bet.betNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       bet.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       bet.numbers.some(n => n.number.includes(searchTerm));
    const matchStatus = filterStatus === 'all' || bet.status === filterStatus;
    const matchBetType = filterBetType === 'all' || bet.betType === filterBetType;
    return matchSearch && matchStatus && matchBetType;
  });

  const handleViewDetail = (bet: Bet) => {
    setSelectedBet(bet);
    setShowDetailModal(true);
  };

  const handleCancelBet = (bet: Bet) => {
    setSelectedBet(bet);
    setShowCancelModal(true);
  };

  const confirmCancelBet = async () => {
    if (!selectedBet) return;

    const reason = prompt('ระบุเหตุผลในการยกเลิก:');
    if (!reason) return;

    try {
      await ticketAPI.cancelTicket(selectedBet.id, reason);
      alert('ยกเลิกโพยสำเร็จ!');
      setShowCancelModal(false);
      setSelectedBet(null);
      await loadBets();
    } catch (err) {
      alert('เกิดข้อผิดพลาด: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <Clock size={14} />, label: 'รอออกผล' },
      won: { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle size={14} />, label: 'ถูกรางวัล' },
      lost: { bg: 'bg-gray-100', text: 'text-gray-700', icon: <XCircle size={14} />, label: 'ไม่ถูก' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-700', icon: <X size={14} />, label: 'ยกเลิก' },
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
    total: bets.length,
    pending: bets.filter(b => b.status === 'pending').length,
    won: bets.filter(b => b.status === 'won').length,
    lost: bets.filter(b => b.status === 'lost').length,
    totalAmount: bets.reduce((sum, b) => sum + b.netAmount, 0),
    totalWin: bets.filter(b => b.status === 'won').reduce((sum, b) => sum + (b.winAmount || 0), 0),
  };

  if (loading && bets.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw size={48} className="animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-bold">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md">
          <AlertCircle size={48} className="text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">เกิดข้อผิดพลาด</h2>
          <p className="text-gray-600 text-center mb-4">{error}</p>
          <button
            onClick={() => loadBets()}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700"
          >
            ลองใหม่
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📋 จัดการโพย</h1>
            <p className="text-gray-600 mt-1">ดูและจัดการโพยทั้งหมด</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">โพยทั้งหมด</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock size={24} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">รอออกผล</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Award size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">ถูกรางวัล</p>
                <p className="text-2xl font-bold text-gray-900">{stats.won}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FileText size={24} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">มูลค่ารวม</p>
                <p className="text-xl font-bold text-gray-900">฿{stats.totalAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="ค้นหา (เลขโพย, ผู้แทง, เลข)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">สถานะทั้งหมด</option>
              <option value="pending">รอออกผล</option>
              <option value="won">ถูกรางวัล</option>
              <option value="lost">ไม่ถูก</option>
              <option value="cancelled">ยกเลิก</option>
            </select>
            <select
              value={filterBetType}
              onChange={(e) => setFilterBetType(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">ประเภททั้งหมด</option>
              <option value="3ตัวบน">3ตัวบน</option>
              <option value="3ตัวโต๊ด">3ตัวโต๊ด</option>
              <option value="2ตัวบน">2ตัวบน</option>
              <option value="2ตัวล่าง">2ตัวล่าง</option>
            </select>
            <button className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600 transition-colors">
              <Download size={20} />
              Export
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-100 to-pink-100 border-b-2 border-purple-300">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">เลขโพย</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">ผู้แทง</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">ประเภท</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-700">เลข</th>
                  <th className="px-4 py-3 text-right font-bold text-gray-700">ยอดเงิน</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">วันที่แทง</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-700">สถานะ</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-700">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBets.map((bet) => (
                  <tr key={bet.id} className="hover:bg-purple-50 transition-colors">
                    <td className="px-4 py-4">
                      <p className="font-mono font-bold text-gray-900">{bet.betNumber}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-bold text-gray-900">{bet.username}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">
                        {bet.betType}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {bet.numbers.slice(0, 3).map((n, idx) => (
                          <span key={idx} className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                            {n.number}
                          </span>
                        ))}
                        {bet.numbers.length > 3 && (
                          <span className="text-xs text-gray-600">+{bet.numbers.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <p className="font-bold text-gray-900">฿{bet.totalAmount.toLocaleString()}</p>
                      <p className="text-xs text-gray-600">สุทธิ: ฿{bet.netAmount.toLocaleString()}</p>
                      {bet.winAmount && (
                        <p className="text-xs text-green-600 font-bold">ถูก: ฿{bet.winAmount.toLocaleString()}</p>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-900">{bet.betDate.toLocaleDateString('th-TH')}</p>
                      <p className="text-xs text-gray-600">{bet.betDate.toLocaleTimeString('th-TH')}</p>
                    </td>
                    <td className="px-4 py-4 text-center">
                      {getStatusBadge(bet.status)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewDetail(bet)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                          title="ดูรายละเอียด"
                        >
                          <Eye size={16} />
                        </button>
                        {bet.status === 'pending' && (
                          <button
                            onClick={() => handleCancelBet(bet)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                            title="ยกเลิกโพย"
                          >
                            <X size={16} />
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

      {showDetailModal && selectedBet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">รายละเอียดโพย</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">เลขโพย</p>
                  <p className="font-mono font-bold text-gray-900">{selectedBet.betNumber}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">สถานะ</p>
                  {getStatusBadge(selectedBet.status)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">ผู้แทง</p>
                  <p className="font-bold text-gray-900">{selectedBet.username}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">ประเภท</p>
                  <p className="font-bold text-gray-900">{selectedBet.betType}</p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-3">รายการแทง</p>
                <div className="space-y-2">
                  {selectedBet.numbers.map((n, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                      <span className="font-mono text-xl font-bold text-gray-900">{n.number}</span>
                      <span className="font-bold text-green-600">฿{n.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">ยอดรวม</p>
                  <p className="text-xl font-bold text-green-600">฿{selectedBet.totalAmount.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">ส่วนลด</p>
                  <p className="text-xl font-bold text-orange-600">฿{selectedBet.discount.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">ยอดสุทธิ</p>
                  <p className="text-xl font-bold text-blue-600">฿{selectedBet.netAmount.toLocaleString()}</p>
                </div>
              </div>

              {selectedBet.winAmount && (
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-300">
                  <p className="text-sm text-gray-600 mb-1">ยอดถูกรางวัล</p>
                  <p className="text-3xl font-bold text-green-600">฿{selectedBet.winAmount.toLocaleString()}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">วันที่แทง</p>
                  <p className="font-bold text-gray-900">
                    {selectedBet.betDate.toLocaleDateString('th-TH')} {selectedBet.betDate.toLocaleTimeString('th-TH')}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">งวดวันที่</p>
                  <p className="font-bold text-gray-900">{selectedBet.drawDate.toLocaleDateString('th-TH')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCancelModal && selectedBet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">ยืนยันยกเลิกโพย</h3>
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm text-gray-700 mb-2">คุณต้องการยกเลิกโพยนี้หรือไม่?</p>
                <p className="font-mono font-bold text-gray-900">{selectedBet.betNumber}</p>
                <p className="text-sm text-gray-600 mt-2">ยอดเงิน: ฿{selectedBet.netAmount.toLocaleString()}</p>
              </div>
              <p className="text-sm text-red-600">⚠️ การยกเลิกจะคืนเงินให้สมาชิกทันที</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={confirmCancelBet}
                  className="flex-1 py-3 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-colors"
                >
                  ยืนยันยกเลิก
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
