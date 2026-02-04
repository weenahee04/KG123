import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  AlertCircle,
  Download,
  RefreshCw
} from 'lucide-react';
import { financialAPI } from '../src/services/api';

interface Transaction {
  id: string;
  transactionNumber: string;
  username: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  bankName: string;
  bankAccount: string;
  accountName: string;
  slipUrl?: string;
  requestDate: Date;
  processedDate?: Date;
  status: 'pending' | 'approved' | 'rejected' | 'processing';
  note?: string;
  processedBy?: string;
}

export default function DepositWithdrawal() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('pending');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [processAction, setProcessAction] = useState<'approve' | 'reject'>('approve');
  const [processNote, setProcessNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTransactions();
  }, [filterType, filterStatus]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError(null);

      const typeFilter = filterType === 'all' ? undefined : filterType.toUpperCase();
      const statusFilter = filterStatus === 'all' ? undefined : filterStatus.toUpperCase();
      
      const data = await financialAPI.getTransactions(typeFilter, statusFilter);
      
      const mappedTransactions = data.map(t => ({
        id: t.id,
        transactionNumber: t.id,
        username: t.username,
        type: t.type.toLowerCase() as 'deposit' | 'withdrawal',
        amount: t.amount,
        bankName: '',
        bankAccount: t.bankAccount,
        accountName: t.username,
        slipUrl: t.slipUrl,
        requestDate: new Date(t.createdAt),
        processedDate: t.processedAt ? new Date(t.processedAt) : undefined,
        status: t.status.toLowerCase() as 'pending' | 'approved' | 'rejected' | 'processing',
        note: t.note,
        processedBy: t.processedBy
      }));

      setTransactions(mappedTransactions);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load transactions:', err);
      setError(err instanceof Error ? err.message : 'Failed to load transactions');
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(txn => {
    const matchSearch = txn.transactionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       txn.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       txn.accountName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === 'all' || txn.type === filterType;
    const matchStatus = filterStatus === 'all' || txn.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  const handleViewDetail = (txn: Transaction) => {
    setSelectedTransaction(txn);
    setShowDetailModal(true);
  };

  const handleProcess = (txn: Transaction, action: 'approve' | 'reject') => {
    setSelectedTransaction(txn);
    setProcessAction(action);
    setProcessNote('');
    setShowProcessModal(true);
  };

  const confirmProcess = async () => {
    if (!selectedTransaction) return;

    try {
      if (processAction === 'approve') {
        await financialAPI.approveTransaction(selectedTransaction.id, processNote || undefined);
        alert('อนุมัติรายการสำเร็จ!');
      } else {
        if (!processNote) {
          alert('กรุณาระบุเหตุผลในการปฏิเสธ');
          return;
        }
        await financialAPI.rejectTransaction(selectedTransaction.id, processNote);
        alert('ปฏิเสธรายการสำเร็จ!');
      }

      setShowProcessModal(false);
      setShowDetailModal(false);
      setSelectedTransaction(null);
      setProcessNote('');
      await loadTransactions();
    } catch (err) {
      alert('เกิดข้อผิดพลาด: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <Clock size={14} />, label: 'รอดำเนินการ' },
      processing: { bg: 'bg-blue-100', text: 'text-blue-700', icon: <AlertCircle size={14} />, label: 'กำลังตรวจสอบ' },
      approved: { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle size={14} />, label: 'อนุมัติแล้ว' },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', icon: <XCircle size={14} />, label: 'ปฏิเสธ' },
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
    totalDeposits: transactions.filter(t => t.type === 'deposit').reduce((sum, t) => sum + t.amount, 0),
    totalWithdrawals: transactions.filter(t => t.type === 'withdrawal').reduce((sum, t) => sum + t.amount, 0),
    pendingCount: transactions.filter(t => t.status === 'pending').length,
    pendingAmount: transactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0),
    todayDeposits: transactions.filter(t => t.type === 'deposit' && t.requestDate.toDateString() === new Date().toDateString()).reduce((sum, t) => sum + t.amount, 0),
    todayWithdrawals: transactions.filter(t => t.type === 'withdrawal' && t.requestDate.toDateString() === new Date().toDateString()).reduce((sum, t) => sum + t.amount, 0),
  };

  if (loading && transactions.length === 0) {
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
            onClick={() => loadTransactions()}
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
            <h1 className="text-3xl font-bold text-gray-900">💰 จัดการฝาก-ถอน</h1>
            <p className="text-gray-600 mt-1">อนุมัติและจัดการรายการฝาก-ถอนเงิน</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">ฝากวันนี้</p>
                <p className="text-2xl font-bold text-green-600">฿{stats.todayDeposits.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <TrendingDown size={24} className="text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">ถอนวันนี้</p>
                <p className="text-2xl font-bold text-red-600">฿{stats.todayWithdrawals.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock size={24} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">รอดำเนินการ</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <DollarSign size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">ยอดรอ</p>
                <p className="text-xl font-bold text-blue-600">฿{stats.pendingAmount.toLocaleString()}</p>
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
                placeholder="ค้นหา (เลขรายการ, ผู้ใช้, ชื่อบัญชี)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">ทุกประเภท</option>
              <option value="deposit">ฝาก</option>
              <option value="withdrawal">ถอน</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">สถานะทั้งหมด</option>
              <option value="pending">รอดำเนินการ</option>
              <option value="processing">กำลังตรวจสอบ</option>
              <option value="approved">อนุมัติแล้ว</option>
              <option value="rejected">ปฏิเสธ</option>
            </select>
            <button className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600 transition-colors">
              <Download size={20} />
              Export
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-100 to-indigo-100 border-b-2 border-blue-300">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">เลขรายการ</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">ผู้ใช้</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-700">ประเภท</th>
                  <th className="px-4 py-3 text-right font-bold text-gray-700">จำนวน</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">ธนาคาร</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">วันที่</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-700">สถานะ</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-700">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTransactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-4 py-4">
                      <p className="font-mono font-bold text-gray-900">{txn.transactionNumber}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-bold text-gray-900">{txn.username}</p>
                      <p className="text-xs text-gray-600">{txn.accountName}</p>
                    </td>
                    <td className="px-4 py-4 text-center">
                      {txn.type === 'deposit' ? (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 justify-center">
                          <TrendingUp size={14} />
                          ฝาก
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 justify-center">
                          <TrendingDown size={14} />
                          ถอน
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <p className={`text-xl font-bold ${txn.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                        {txn.type === 'deposit' ? '+' : '-'}฿{txn.amount.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-bold text-gray-900">{txn.bankName}</p>
                      <p className="text-xs text-gray-600 font-mono">{txn.bankAccount}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-900">{txn.requestDate.toLocaleDateString('th-TH')}</p>
                      <p className="text-xs text-gray-600">{txn.requestDate.toLocaleTimeString('th-TH')}</p>
                    </td>
                    <td className="px-4 py-4 text-center">
                      {getStatusBadge(txn.status)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewDetail(txn)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                          title="ดูรายละเอียด"
                        >
                          <Eye size={16} />
                        </button>
                        {txn.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleProcess(txn, 'approve')}
                              className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                              title="อนุมัติ"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              onClick={() => handleProcess(txn, 'reject')}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                              title="ปฏิเสธ"
                            >
                              <XCircle size={16} />
                            </button>
                          </>
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

      {showDetailModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">รายละเอียดรายการ</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">เลขรายการ</p>
                  <p className="font-mono font-bold text-gray-900">{selectedTransaction.transactionNumber}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">สถานะ</p>
                  {getStatusBadge(selectedTransaction.status)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">ผู้ใช้</p>
                  <p className="font-bold text-gray-900">{selectedTransaction.username}</p>
                </div>
                <div className={`p-4 rounded-lg ${selectedTransaction.type === 'deposit' ? 'bg-green-50' : 'bg-red-50'}`}>
                  <p className="text-sm text-gray-600 mb-1">ประเภท</p>
                  <p className={`font-bold ${selectedTransaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedTransaction.type === 'deposit' ? 'ฝากเงิน' : 'ถอนเงิน'}
                  </p>
                </div>
              </div>

              <div className={`p-6 rounded-lg border-2 ${selectedTransaction.type === 'deposit' ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                <p className="text-sm text-gray-600 mb-1">จำนวนเงิน</p>
                <p className={`text-4xl font-bold ${selectedTransaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedTransaction.type === 'deposit' ? '+' : '-'}฿{selectedTransaction.amount.toLocaleString()}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">ข้อมูลบัญชี</p>
                <div className="space-y-1">
                  <p className="font-bold text-gray-900">{selectedTransaction.bankName}</p>
                  <p className="font-mono text-gray-700">{selectedTransaction.bankAccount}</p>
                  <p className="text-gray-700">{selectedTransaction.accountName}</p>
                </div>
              </div>

              {selectedTransaction.slipUrl && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">สลิปโอนเงิน</p>
                  <img 
                    src={selectedTransaction.slipUrl} 
                    alt="Slip" 
                    className="w-full max-w-md mx-auto rounded-lg border-2 border-gray-300 shadow-lg"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">วันที่ขอ</p>
                  <p className="font-bold text-gray-900">
                    {selectedTransaction.requestDate.toLocaleDateString('th-TH')} {selectedTransaction.requestDate.toLocaleTimeString('th-TH')}
                  </p>
                </div>
                {selectedTransaction.processedDate && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">วันที่ดำเนินการ</p>
                    <p className="font-bold text-gray-900">
                      {selectedTransaction.processedDate.toLocaleDateString('th-TH')} {selectedTransaction.processedDate.toLocaleTimeString('th-TH')}
                    </p>
                  </div>
                )}
              </div>

              {selectedTransaction.note && (
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-gray-600 mb-1">หมายเหตุ</p>
                  <p className="text-gray-900">{selectedTransaction.note}</p>
                </div>
              )}

              {selectedTransaction.processedBy && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">ดำเนินการโดย</p>
                  <p className="font-bold text-gray-900">{selectedTransaction.processedBy}</p>
                </div>
              )}

              {selectedTransaction.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => handleProcess(selectedTransaction, 'approve')}
                    className="flex-1 py-3 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={20} />
                    อนุมัติ
                  </button>
                  <button
                    onClick={() => handleProcess(selectedTransaction, 'reject')}
                    className="flex-1 py-3 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle size={20} />
                    ปฏิเสธ
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showProcessModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {processAction === 'approve' ? 'ยืนยันการอนุมัติ' : 'ยืนยันการปฏิเสธ'}
            </h3>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border ${processAction === 'approve' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <p className="text-sm text-gray-700 mb-2">รายการ: {selectedTransaction.transactionNumber}</p>
                <p className="text-sm text-gray-700 mb-2">ผู้ใช้: {selectedTransaction.username}</p>
                <p className={`text-2xl font-bold ${processAction === 'approve' ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedTransaction.type === 'deposit' ? '+' : '-'}฿{selectedTransaction.amount.toLocaleString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">หมายเหตุ (ถ้ามี)</label>
                <textarea
                  value={processNote}
                  onChange={(e) => setProcessNote(e.target.value)}
                  placeholder="ระบุเหตุผล หรือหมายเหตุเพิ่มเติม..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowProcessModal(false)}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={confirmProcess}
                  className={`flex-1 py-3 text-white rounded-lg font-bold transition-colors ${
                    processAction === 'approve' 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  ยืนยัน
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
