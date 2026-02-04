import React, { useState, useEffect } from 'react';
import { 
  Calendar,
  Clock,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Upload,
  RefreshCw,
  Zap,
  DollarSign,
  Users,
  FileText,
  Save,
  X,
  Copy,
  RotateCcw,
  AlertTriangle
} from 'lucide-react';
import { lotteryAPI, LotteryRound as APILotteryRound } from '../src/services/api';

// ============================================
// TYPE DEFINITIONS
// ============================================
interface LotteryRound {
  id: string;
  roundNumber: string;
  lotteryType: 'GOVERNMENT' | 'YIKI' | 'HANOI' | 'LAOS' | 'STOCK';
  drawDate: Date;
  openTime: Date;
  closeTime: Date;
  status: 'WAITING' | 'OPEN' | 'CLOSED' | 'ANNOUNCED' | 'PAID';
  resultTop3?: string;
  resultToad3?: string;
  resultTop2?: string;
  resultBottom2?: string;
  resultRun?: string;
  totalBets?: number;
  totalPayout?: number;
  totalTickets?: number;
}

export default function LotteryOperations() {
  const [activeTab, setActiveTab] = useState<'rounds' | 'results' | 'refund'>('rounds');
  const [rounds, setRounds] = useState<LotteryRound[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRounds();
  }, []);

  const loadRounds = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await lotteryAPI.getRounds();
      setRounds(data.map(r => ({
        ...r,
        drawDate: new Date(r.drawDate),
        openTime: new Date(r.openTime),
        closeTime: new Date(r.closeTime)
      })));
      setLoading(false);
    } catch (err) {
      console.error('Failed to load rounds:', err);
      setError(err instanceof Error ? err.message : 'Failed to load rounds');
      setLoading(false);
    }
  };

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedRound, setSelectedRound] = useState<LotteryRound | null>(null);

  // Create Round Form
  const [newRound, setNewRound] = useState({
    lotteryType: 'GOVERNMENT',
    drawDate: '',
    openTime: '',
    closeTime: ''
  });

  // Result Entry Form
  const [resultForm, setResultForm] = useState({
    top3: '',
    top3Confirm: '',
    toad3: '',
    top2: '',
    top2Confirm: '',
    bottom2: '',
    bottom2Confirm: '',
    run: ''
  });

  const [resultConfirmedBy, setResultConfirmedBy] = useState<string[]>([]);

  const getLotteryTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      GOVERNMENT: 'หวยรัฐบาล',
      YIKI: 'ยี่กี',
      HANOI: 'หวยฮานอย',
      LAOS: 'หวยลาว',
      STOCK: 'หวยหุ้น'
    };
    return labels[type] || type;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      WAITING: 'bg-gray-100 text-gray-800 border-gray-300',
      OPEN: 'bg-green-100 text-green-800 border-green-300',
      CLOSED: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      ANNOUNCED: 'bg-blue-100 text-blue-800 border-blue-300',
      PAID: 'bg-purple-100 text-purple-800 border-purple-300'
    };
    return colors[status] || colors.WAITING;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      WAITING: 'รอเปิด',
      OPEN: 'เปิดรับ',
      CLOSED: 'ปิดรับ',
      ANNOUNCED: 'ประกาศผล',
      PAID: 'จ่ายแล้ว'
    };
    return labels[status] || status;
  };

  const handleCreateRound = async () => {
    if (!newRound.drawDate || !newRound.openTime || !newRound.closeTime) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    try {
      await lotteryAPI.createRound({
        lotteryType: newRound.lotteryType,
        drawDate: newRound.drawDate,
        openTime: newRound.openTime,
        closeTime: newRound.closeTime
      });
      
      setShowCreateModal(false);
      setNewRound({ lotteryType: 'GOVERNMENT', drawDate: '', openTime: '', closeTime: '' });
      alert('สร้างงวดสำเร็จ!');
      await loadRounds();
    } catch (err) {
      alert('เกิดข้อผิดพลาด: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleAutoGenYiki = async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];

    try {
      await lotteryAPI.autoGenYiki(dateStr);
      alert('สร้าง 88 รอบยี่กีสำเร็จ!');
      await loadRounds();
    } catch (err) {
      alert('เกิดข้อผิดพลาด: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleFetchResult = async () => {
    if (!selectedRound) return;
    
    try {
      const result = await lotteryAPI.fetchResultFromAPI(selectedRound.id);
      setResultForm({
        top3: result.top3,
        top3Confirm: result.top3,
        toad3: result.toad3 || '',
        top2: result.top2,
        top2Confirm: result.top2,
        bottom2: result.bottom2,
        bottom2Confirm: result.bottom2,
        run: result.run || ''
      });
      alert('ดึงผลจาก API สำเร็จ!');
    } catch (err) {
      alert('เกิดข้อผิดพลาด: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleSubmitResult = async () => {
    if (!selectedRound) return;
    if (resultConfirmedBy.length < 2) {
      alert('ต้องมีแอดมิน 2 คนยืนยัน!');
      return;
    }

    if (resultForm.top3 !== resultForm.top3Confirm) {
      alert('เลข 3 ตัวบนไม่ตรงกัน!');
      return;
    }

    try {
      await lotteryAPI.submitResult({
        roundId: selectedRound.id,
        top3: resultForm.top3,
        toad3: resultForm.toad3,
        top2: resultForm.top2,
        bottom2: resultForm.bottom2,
        run: resultForm.run,
        confirmedBy: resultConfirmedBy
      });
      
      setShowResultModal(false);
      setSelectedRound(null);
      setResultForm({ top3: '', top3Confirm: '', toad3: '', top2: '', top2Confirm: '', bottom2: '', bottom2Confirm: '', run: '' });
      setResultConfirmedBy([]);
      alert('บันทึกผลสำเร็จ!');
      await loadRounds();
    } catch (err) {
      alert('เกิดข้อผิดพลาด: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleProcessResults = async (roundId: string) => {
    if (!confirm('ยืนยันการประมวลผลและจ่ายเงิน?')) return;
    
    try {
      const result = await lotteryAPI.processResults(roundId);
      alert(`ประมวลผลสำเร็จ! จ่ายเงินรวม ฿${result.totalPayout.toLocaleString()}`);
      await loadRounds();
    } catch (err) {
      alert('เกิดข้อผิดพลาด: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleRefundRound = async (roundId: string) => {
    if (!confirm('ยืนยันการคืนเงินทั้งงวด?')) return;
    
    try {
      await lotteryAPI.refundRound(roundId);
      alert('คืนเงินสำเร็จ!');
      await loadRounds();
    } catch (err) {
      alert('เกิดข้อผิดพลาด: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleRollbackResult = async (roundId: string) => {
    if (!confirm('ยืนยันการ Rollback ผล? (จะดึงเงินคืนจากผู้ชนะ)')) return;
    
    try {
      await lotteryAPI.rollbackResult(roundId);
      alert('Rollback สำเร็จ!');
      await loadRounds();
    } catch (err) {
      alert('เกิดข้อผิดพลาด: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  if (loading && rounds.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-3 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw size={48} className="animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-bold">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-3 md:p-6 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md">
          <AlertCircle size={48} className="text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">เกิดข้อผิดพลาด</h2>
          <p className="text-gray-600 text-center mb-4">{error}</p>
          <button
            onClick={() => loadRounds()}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700"
          >
            ลองใหม่
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">🎲 จัดการหวย</h1>
            <p className="text-gray-600 mt-1">จัดการงวด, กรอกผล, คืนเงิน</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all"
            >
              <Plus size={18} />
              สร้างงวดใหม่
            </button>
            <button
              onClick={handleAutoGenYiki}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-purple-700 transition-all"
            >
              <Zap size={18} />
              Gen ยี่กี 88 รอบ
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('rounds')}
              className={`flex-1 px-6 py-4 font-bold transition-colors ${
                activeTab === 'rounds'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar className="inline mr-2" size={18} />
              จัดการงวด
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`flex-1 px-6 py-4 font-bold transition-colors ${
                activeTab === 'results'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="inline mr-2" size={18} />
              กรอกผล & ตัดเกรด
            </button>
            <button
              onClick={() => setActiveTab('refund')}
              className={`flex-1 px-6 py-4 font-bold transition-colors ${
                activeTab === 'refund'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <RotateCcw className="inline mr-2" size={18} />
              คืนเงิน & Rollback
            </button>
          </div>

          <div className="p-6">
            {/* Round Management Tab */}
            {activeTab === 'rounds' && (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead className="bg-blue-50 border-b-2 border-blue-200">
                      <tr>
                        <th className="px-4 py-3 text-left font-bold text-gray-700">งวด</th>
                        <th className="px-4 py-3 text-left font-bold text-gray-700">ประเภท</th>
                        <th className="px-4 py-3 text-center font-bold text-gray-700">วันที่ออก</th>
                        <th className="px-4 py-3 text-center font-bold text-gray-700">เวลาปิดรับ</th>
                        <th className="px-4 py-3 text-center font-bold text-gray-700">สถานะ</th>
                        <th className="px-4 py-3 text-right font-bold text-gray-700">ยอดแทง</th>
                        <th className="px-4 py-3 text-center font-bold text-gray-700">โพย</th>
                        <th className="px-4 py-3 text-center font-bold text-gray-700">จัดการ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rounds.map((round) => (
                        <tr key={round.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-4 py-3 font-bold text-gray-900">{round.roundNumber}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded">
                              {getLotteryTypeLabel(round.lotteryType)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center text-sm">
                            {round.drawDate.toLocaleDateString('th-TH')}
                          </td>
                          <td className="px-4 py-3 text-center text-sm">
                            {round.closeTime.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border ${getStatusColor(round.status)}`}>
                              {round.status === 'OPEN' && <CheckCircle size={14} />}
                              {round.status === 'CLOSED' && <Clock size={14} />}
                              {round.status === 'ANNOUNCED' && <FileText size={14} />}
                              <span className="text-xs font-bold">{getStatusLabel(round.status)}</span>
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-blue-600">
                            ฿{round.totalBets?.toLocaleString() || 0}
                          </td>
                          <td className="px-4 py-3 text-center text-gray-600">
                            {round.totalTickets || 0}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {round.status === 'CLOSED' && (
                                <button
                                  onClick={() => {
                                    setSelectedRound(round);
                                    setShowResultModal(true);
                                  }}
                                  className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                                  title="กรอกผล"
                                >
                                  <Edit size={16} />
                                </button>
                              )}
                              {round.status === 'ANNOUNCED' && (
                                <button
                                  onClick={() => handleProcessResults(round.id)}
                                  className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                                  title="ประมวลผล"
                                >
                                  <Zap size={16} />
                                </button>
                              )}
                              <button
                                className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                                title="ลบ"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Result Entry Tab */}
            {activeTab === 'results' && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    <strong>คำแนะนำ:</strong> เลือกงวดที่ปิดรับแล้ว → กรอกผล 2 ครั้ง หรือให้ Admin 2 คนยืนยัน → ประมวลผล
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rounds.filter(r => r.status === 'CLOSED' || r.status === 'ANNOUNCED').map((round) => (
                    <div key={round.id} className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-gray-900">{round.roundNumber}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(round.status)}`}>
                          {getStatusLabel(round.status)}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p className="text-gray-600">
                          <strong>ประเภท:</strong> {getLotteryTypeLabel(round.lotteryType)}
                        </p>
                        <p className="text-gray-600">
                          <strong>ยอดแทง:</strong> ฿{round.totalBets?.toLocaleString()}
                        </p>
                        {round.status === 'ANNOUNCED' && (
                          <div className="pt-2 border-t border-gray-200">
                            <p className="text-green-600 font-bold">ผล: {round.resultTop3}</p>
                          </div>
                        )}
                      </div>
                      <div className="mt-4 flex gap-2">
                        {round.status === 'CLOSED' && (
                          <button
                            onClick={() => {
                              setSelectedRound(round);
                              setShowResultModal(true);
                            }}
                            className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg font-bold hover:bg-green-700 transition-all"
                          >
                            <Edit size={16} />
                            กรอกผล
                          </button>
                        )}
                        {round.status === 'ANNOUNCED' && (
                          <button
                            onClick={() => handleProcessResults(round.id)}
                            className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white px-3 py-2 rounded-lg font-bold hover:bg-purple-700 transition-all"
                          >
                            <Zap size={16} />
                            ประมวลผล
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Refund & Rollback Tab */}
            {activeTab === 'refund' && (
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle size={20} className="text-red-600 mt-0.5" />
                    <div>
                      <p className="font-bold text-red-900 mb-1">คำเตือน!</p>
                      <p className="text-sm text-red-800">
                        การคืนเงินและ Rollback เป็นการกระทำที่สำคัญ กรุณาตรวจสอบให้แน่ใจก่อนดำเนินการ
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rounds.filter(r => r.status !== 'WAITING').map((round) => (
                    <div key={round.id} className="bg-white border-2 border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-gray-900">{round.roundNumber}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(round.status)}`}>
                          {getStatusLabel(round.status)}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm mb-4">
                        <p className="text-gray-600">
                          <strong>ยอดแทง:</strong> ฿{round.totalBets?.toLocaleString()}
                        </p>
                        <p className="text-gray-600">
                          <strong>โพย:</strong> {round.totalTickets} ใบ
                        </p>
                        {round.totalPayout && (
                          <p className="text-gray-600">
                            <strong>ยอดจ่าย:</strong> ฿{round.totalPayout.toLocaleString()}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        {(round.status === 'OPEN' || round.status === 'CLOSED') && (
                          <button
                            onClick={() => handleRefundRound(round.id)}
                            className="w-full flex items-center justify-center gap-2 bg-orange-600 text-white px-3 py-2 rounded-lg font-bold hover:bg-orange-700 transition-all"
                          >
                            <RotateCcw size={16} />
                            คืนเงินทั้งงวด
                          </button>
                        )}
                        {(round.status === 'ANNOUNCED' || round.status === 'PAID') && (
                          <button
                            onClick={() => handleRollbackResult(round.id)}
                            className="w-full flex items-center justify-center gap-2 bg-red-600 text-white px-3 py-2 rounded-lg font-bold hover:bg-red-700 transition-all"
                          >
                            <AlertCircle size={16} />
                            Rollback ผล
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Create Round Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
              <div className="bg-blue-600 text-white p-6 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">สร้างงวดใหม่</h2>
                  <button onClick={() => setShowCreateModal(false)} className="text-white hover:bg-blue-700 p-2 rounded-lg">
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">ประเภทหวย</label>
                  <select
                    value={newRound.lotteryType}
                    onChange={(e) => setNewRound({...newRound, lotteryType: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="GOVERNMENT">หวยรัฐบาล</option>
                    <option value="YIKI">ยี่กี</option>
                    <option value="HANOI">หวยฮานอย</option>
                    <option value="LAOS">หวยลาว</option>
                    <option value="STOCK">หวยหุ้น</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">วันที่ออกผล</label>
                  <input
                    type="date"
                    value={newRound.drawDate}
                    onChange={(e) => setNewRound({...newRound, drawDate: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">เวลาเปิดรับ</label>
                    <input
                      type="datetime-local"
                      value={newRound.openTime}
                      onChange={(e) => setNewRound({...newRound, openTime: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">เวลาปิดรับ</label>
                    <input
                      type="datetime-local"
                      value={newRound.closeTime}
                      onChange={(e) => setNewRound({...newRound, closeTime: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-b-xl flex gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleCreateRound}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
                >
                  สร้างงวด
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Result Entry Modal */}
        {showResultModal && selectedRound && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full my-8">
              <div className="bg-green-600 text-white p-6 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">กรอกผล & ตัดเกรด</h2>
                    <p className="text-green-100 mt-1">{selectedRound.roundNumber}</p>
                  </div>
                  <button onClick={() => {
                    setShowResultModal(false);
                    setSelectedRound(null);
                    setResultForm({
                      top3: '', top3Confirm: '', toad3: '', top2: '', top2Confirm: '', 
                      bottom2: '', bottom2Confirm: '', run: ''
                    });
                  }} className="text-white hover:bg-green-700 p-2 rounded-lg">
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <button
                  onClick={handleFetchResult}
                  className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-purple-700"
                >
                  <Download size={18} />
                  ดึงผลจาก API (Ruay/LottoHub)
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">3 ตัวบน</label>
                    <input
                      type="text"
                      maxLength={3}
                      value={resultForm.top3}
                      onChange={(e) => setResultForm({...resultForm, top3: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-center text-2xl font-bold"
                      placeholder="123"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-red-700 mb-2">ยืนยัน 3 ตัวบน</label>
                    <input
                      type="text"
                      maxLength={3}
                      value={resultForm.top3Confirm}
                      onChange={(e) => setResultForm({...resultForm, top3Confirm: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 text-center text-2xl font-bold"
                      placeholder="123"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">3 ตัวโต๊ด</label>
                  <input
                    type="text"
                    maxLength={3}
                    value={resultForm.toad3}
                    onChange={(e) => setResultForm({...resultForm, toad3: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-center text-xl font-bold"
                    placeholder="456"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">2 ตัวบน</label>
                    <input
                      type="text"
                      maxLength={2}
                      value={resultForm.top2}
                      onChange={(e) => setResultForm({...resultForm, top2: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-center text-2xl font-bold"
                      placeholder="45"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-red-700 mb-2">ยืนยัน 2 ตัวบน</label>
                    <input
                      type="text"
                      maxLength={2}
                      value={resultForm.top2Confirm}
                      onChange={(e) => setResultForm({...resultForm, top2Confirm: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 text-center text-2xl font-bold"
                      placeholder="45"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">2 ตัวล่าง</label>
                    <input
                      type="text"
                      maxLength={2}
                      value={resultForm.bottom2}
                      onChange={(e) => setResultForm({...resultForm, bottom2: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-center text-2xl font-bold"
                      placeholder="67"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-red-700 mb-2">ยืนยัน 2 ตัวล่าง</label>
                    <input
                      type="text"
                      maxLength={2}
                      value={resultForm.bottom2Confirm}
                      onChange={(e) => setResultForm({...resultForm, bottom2Confirm: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 text-center text-2xl font-bold"
                      placeholder="67"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">วิ่ง</label>
                  <input
                    type="text"
                    maxLength={1}
                    value={resultForm.run}
                    onChange={(e) => setResultForm({...resultForm, run: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-center text-2xl font-bold"
                    placeholder="7"
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="font-bold text-yellow-900 mb-2">Admin ยืนยัน:</p>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        if (!resultConfirmedBy.includes('Admin A')) {
                          setResultConfirmedBy([...resultConfirmedBy, 'Admin A']);
                        }
                      }}
                      className={`w-full px-4 py-2 rounded-lg font-bold ${
                        resultConfirmedBy.includes('Admin A')
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {resultConfirmedBy.includes('Admin A') ? '✓ Admin A ยืนยันแล้ว' : 'Admin A ยืนยัน'}
                    </button>
                    <button
                      onClick={() => {
                        if (!resultConfirmedBy.includes('Admin B')) {
                          setResultConfirmedBy([...resultConfirmedBy, 'Admin B']);
                        }
                      }}
                      className={`w-full px-4 py-2 rounded-lg font-bold ${
                        resultConfirmedBy.includes('Admin B')
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {resultConfirmedBy.includes('Admin B') ? '✓ Admin B ยืนยันแล้ว' : 'Admin B ยืนยัน'}
                    </button>
                  </div>
                  <p className="text-xs text-yellow-800 mt-2">
                    ต้องมี Admin 2 คนยืนยันเพื่อป้องกันการโกง/กรอกผิด
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-b-xl flex gap-3">
                <button
                  onClick={() => {
                    setShowResultModal(false);
                    setSelectedRound(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleSubmitResult}
                  disabled={resultConfirmedBy.length < 2}
                  className={`flex-1 px-4 py-2 rounded-lg font-bold ${
                    resultConfirmedBy.length < 2
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  <Save className="inline mr-2" size={18} />
                  บันทึกผล & ประมวลผล
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
