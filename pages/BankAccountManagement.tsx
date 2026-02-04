import React, { useState } from 'react';
import { 
  Building2, 
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  Download
} from 'lucide-react';

interface BankAccount {
  id: string;
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  accountType: 'deposit' | 'withdraw' | 'both';
  balance: number;
  dailyLimit: number;
  status: 'active' | 'inactive' | 'maintenance';
  autoStatement: boolean;
  lastSync: Date;
  totalDeposits: number;
  totalWithdrawals: number;
}

export default function BankAccountManagement() {
  const [accounts, setAccounts] = useState<BankAccount[]>([
    {
      id: '1',
      bankName: 'ธนาคารกสิกรไทย',
      bankCode: 'KBANK',
      accountNumber: '1234567890',
      accountName: 'บริษัท หวยออนไลน์ จำกัด',
      accountType: 'both',
      balance: 1250000,
      dailyLimit: 5000000,
      status: 'active',
      autoStatement: true,
      lastSync: new Date(),
      totalDeposits: 15000000,
      totalWithdrawals: 8500000,
    },
    {
      id: '2',
      bankName: 'ธนาคารไทยพาณิชย์',
      bankCode: 'SCB',
      accountNumber: '9876543210',
      accountName: 'บริษัท หวยออนไลน์ จำกัด',
      accountType: 'deposit',
      balance: 850000,
      dailyLimit: 3000000,
      status: 'active',
      autoStatement: true,
      lastSync: new Date(Date.now() - 300000),
      totalDeposits: 8000000,
      totalWithdrawals: 0,
    },
    {
      id: '3',
      bankName: 'ธนาคารกรุงเทพ',
      bankCode: 'BBL',
      accountNumber: '5555666677',
      accountName: 'บริษัท หวยออนไลน์ จำกัด',
      accountType: 'withdraw',
      balance: 450000,
      dailyLimit: 2000000,
      status: 'active',
      autoStatement: false,
      lastSync: new Date(Date.now() - 3600000),
      totalDeposits: 0,
      totalWithdrawals: 3500000,
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [showAccountNumber, setShowAccountNumber] = useState<{[key: string]: boolean}>({});

  // Form states
  const [formBankName, setFormBankName] = useState('');
  const [formBankCode, setFormBankCode] = useState('');
  const [formAccountNumber, setFormAccountNumber] = useState('');
  const [formAccountName, setFormAccountName] = useState('');
  const [formAccountType, setFormAccountType] = useState<'deposit' | 'withdraw' | 'both'>('both');
  const [formDailyLimit, setFormDailyLimit] = useState(5000000);
  const [formAutoStatement, setFormAutoStatement] = useState(true);

  const handleAddAccount = () => {
    if (!formBankName || !formAccountNumber || !formAccountName) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    const newAccount: BankAccount = {
      id: String(accounts.length + 1),
      bankName: formBankName,
      bankCode: formBankCode,
      accountNumber: formAccountNumber,
      accountName: formAccountName,
      accountType: formAccountType,
      balance: 0,
      dailyLimit: formDailyLimit,
      status: 'active',
      autoStatement: formAutoStatement,
      lastSync: new Date(),
      totalDeposits: 0,
      totalWithdrawals: 0,
    };

    setAccounts([...accounts, newAccount]);
    setShowAddModal(false);
    resetForm();
    alert('เพิ่มบัญชีธนาคารเรียบร้อย!');
  };

  const handleEditAccount = () => {
    if (!selectedAccount) return;

    const updated = accounts.map(a =>
      a.id === selectedAccount.id
        ? {
            ...a,
            accountName: formAccountName,
            accountType: formAccountType,
            dailyLimit: formDailyLimit,
            autoStatement: formAutoStatement,
          }
        : a
    );

    setAccounts(updated);
    setShowEditModal(false);
    resetForm();
    alert('แก้ไขข้อมูลบัญชีเรียบร้อย!');
  };

  const handleToggleStatus = (account: BankAccount) => {
    const newStatus = account.status === 'active' ? 'inactive' : 'active';
    setAccounts(accounts.map(a => a.id === account.id ? { ...a, status: newStatus } : a));
  };

  const handleDeleteAccount = (account: BankAccount) => {
    if (confirm(`ต้องการลบบัญชี ${account.bankName} (${account.accountNumber}) ใช่หรือไม่?`)) {
      setAccounts(accounts.filter(a => a.id !== account.id));
      alert('ลบบัญชีเรียบร้อย!');
    }
  };

  const handleSyncStatement = (account: BankAccount) => {
    setAccounts(accounts.map(a => 
      a.id === account.id ? { ...a, lastSync: new Date() } : a
    ));
    alert(`ดึงสเตทเมนต์ ${account.bankName} เรียบร้อย!`);
  };

  const toggleShowAccountNumber = (accountId: string) => {
    setShowAccountNumber({
      ...showAccountNumber,
      [accountId]: !showAccountNumber[accountId],
    });
  };

  const copyAccountNumber = (accountNumber: string) => {
    navigator.clipboard.writeText(accountNumber);
    alert('คัดลอกเลขบัญชีแล้ว!');
  };

  const resetForm = () => {
    setFormBankName('');
    setFormBankCode('');
    setFormAccountNumber('');
    setFormAccountName('');
    setFormAccountType('both');
    setFormDailyLimit(5000000);
    setFormAutoStatement(true);
    setSelectedAccount(null);
  };

  const openEditModal = (account: BankAccount) => {
    setSelectedAccount(account);
    setFormBankName(account.bankName);
    setFormBankCode(account.bankCode);
    setFormAccountNumber(account.accountNumber);
    setFormAccountName(account.accountName);
    setFormAccountType(account.accountType);
    setFormDailyLimit(account.dailyLimit);
    setFormAutoStatement(account.autoStatement);
    setShowEditModal(true);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-blue-100 text-blue-700',
      inactive: 'bg-gray-100 text-gray-700',
      maintenance: 'bg-gray-300 text-gray-900',
    };
    const labels = {
      active: 'ใช้งาน',
      inactive: 'ปิดใช้',
      maintenance: 'ปรับปรุง',
    };
    return { style: styles[status as keyof typeof styles] || styles.active, label: labels[status as keyof typeof labels] || status };
  };

  const getAccountTypeBadge = (type: string) => {
    const styles = {
      deposit: 'bg-blue-100 text-blue-700',
      withdraw: 'bg-blue-100 text-blue-700',
      both: 'bg-blue-600 text-white',
    };
    const labels = {
      deposit: 'รับฝาก',
      withdraw: 'ถอน',
      both: 'ฝาก-ถอน',
    };
    return { style: styles[type as keyof typeof styles] || styles.both, label: labels[type as keyof typeof labels] || type };
  };

  const stats = {
    total: accounts.length,
    active: accounts.filter(a => a.status === 'active').length,
    totalBalance: accounts.reduce((sum, a) => sum + a.balance, 0),
    totalDeposits: accounts.reduce((sum, a) => sum + a.totalDeposits, 0),
    totalWithdrawals: accounts.reduce((sum, a) => sum + a.totalWithdrawals, 0),
  };

  const bankList = [
    { code: 'KBANK', name: 'ธนาคารกสิกรไทย' },
    { code: 'SCB', name: 'ธนาคารไทยพาณิชย์' },
    { code: 'BBL', name: 'ธนาคารกรุงเทพ' },
    { code: 'KTB', name: 'ธนาคารกรุงไทย' },
    { code: 'TMB', name: 'ธนาคารทหารไทยธนชาต' },
    { code: 'BAY', name: 'ธนาคารกรุงศรีอยุธยา' },
    { code: 'GSB', name: 'ธนาคารออมสิน' },
    { code: 'BAAC', name: 'ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">� จัดการบัญชีธนาคาร</h1>
            <p className="text-gray-600 mt-1">จัดการบัญชีธนาคารและ Auto Statement</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold hover:bg-blue-700 transition-all"
          >
            <Plus size={20} />
            เพิ่มบัญชีใหม่
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-3 md:p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Building2 size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">บัญชีทั้งหมด</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-3 md:p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <CheckCircle size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">ใช้งาน</p>
                <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-3 md:p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Download size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">ยอดรวมทุกบัญชี</p>
                <p className="text-2xl font-bold text-blue-600">฿{(stats.totalBalance / 1000000).toFixed(1)}M</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-3 md:p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <RefreshCw size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">ฝาก-ถอนรวม</p>
                <p className="text-xl font-bold text-blue-600">
                  ฿{((stats.totalDeposits - stats.totalWithdrawals) / 1000000).toFixed(1)}M
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-4 md:p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">รายการบัญชีธนาคาร</h2>
          
          <div className="space-y-3 md:space-y-4">
            {accounts.map((account) => {
              const statusBadge = getStatusBadge(account.status);
              const typeBadge = getAccountTypeBadge(account.accountType);
              const isVisible = showAccountNumber[account.id];
              
              return (
                <div key={account.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-blue-100 rounded-lg">
                        <Building2 size={32} className="text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{account.bankName}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-mono text-lg text-gray-700">
                            {isVisible ? account.accountNumber : '••••••' + account.accountNumber.slice(-4)}
                          </span>
                          <button
                            onClick={() => toggleShowAccountNumber(account.id)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            {isVisible ? <EyeOff size={16} className="text-gray-600" /> : <Eye size={16} className="text-gray-600" />}
                          </button>
                          <button
                            onClick={() => copyAccountNumber(account.accountNumber)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Copy size={16} className="text-gray-600" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{account.accountName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${typeBadge.style}`}>
                        {typeBadge.label}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadge.style}`}>
                        {statusBadge.label}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">ยอดคงเหลือ</p>
                      <p className="text-lg font-bold text-blue-600">฿{account.balance.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">ลิมิตต่อวัน</p>
                      <p className="text-lg font-bold text-gray-900">฿{(account.dailyLimit / 1000000).toFixed(1)}M</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">ฝากรวม</p>
                      <p className="text-lg font-bold text-gray-900">฿{(account.totalDeposits / 1000000).toFixed(1)}M</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">ถอนรวม</p>
                      <p className="text-lg font-bold text-gray-900">฿{(account.totalWithdrawals / 1000000).toFixed(1)}M</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Auto Statement</p>
                      <p className="text-lg font-bold text-gray-900">
                        {account.autoStatement ? '✅ เปิด' : '❌ ปิด'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      อัปเดตล่าสุด: {account.lastSync.toLocaleString('th-TH')}
                    </div>
                    <div className="flex items-center gap-2">
                      {account.autoStatement && (
                        <button
                          onClick={() => handleSyncStatement(account)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg font-bold hover:bg-blue-200 transition-colors"
                        >
                          <RefreshCw size={18} />
                          ดึงสเตทเมนต์
                        </button>
                      )}
                      <button
                        onClick={() => openEditModal(account)}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                        title="แก้ไข"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(account)}
                        className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                        title={account.status === 'active' ? 'ปิดใช้' : 'เปิดใช้'}
                      >
                        {account.status === 'active' ? <XCircle size={18} /> : <CheckCircle size={18} />}
                      </button>
                      <button
                        onClick={() => handleDeleteAccount(account)}
                        className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                        title="ลบ"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">เพิ่มบัญชีธนาคารใหม่</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">ธนาคาร</label>
                <select
                  value={formBankCode}
                  onChange={(e) => {
                    setFormBankCode(e.target.value);
                    const bank = bankList.find(b => b.code === e.target.value);
                    if (bank) setFormBankName(bank.name);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">เลือกธนาคาร</option>
                  {bankList.map(bank => (
                    <option key={bank.code} value={bank.code}>{bank.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">เลขที่บัญชี</label>
                <input
                  type="text"
                  value={formAccountNumber}
                  onChange={(e) => setFormAccountNumber(e.target.value)}
                  placeholder="1234567890"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">ชื่อบัญชี</label>
                <input
                  type="text"
                  value={formAccountName}
                  onChange={(e) => setFormAccountName(e.target.value)}
                  placeholder="บริษัท หวยออนไลน์ จำกัด"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">ประเภทบัญชี</label>
                  <select
                    value={formAccountType}
                    onChange={(e) => setFormAccountType(e.target.value as any)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="both">ฝาก-ถอน</option>
                    <option value="deposit">รับฝากอย่างเดียว</option>
                    <option value="withdraw">ถอนอย่างเดียว</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">ลิมิตต่อวัน (บาท)</label>
                  <input
                    type="number"
                    value={formDailyLimit}
                    onChange={(e) => setFormDailyLimit(parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formAutoStatement}
                    onChange={(e) => setFormAutoStatement(e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 font-bold">เปิดใช้ Auto Statement (ดึงสเตทเมนต์อัตโนมัติ)</span>
                </label>
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
                onClick={handleAddAccount}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all"
              >
                เพิ่มบัญชี
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Account Modal */}
      {showEditModal && selectedAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">แก้ไขข้อมูลบัญชี</h2>
              <p className="text-gray-600 mt-1">{selectedAccount.bankName} - {selectedAccount.accountNumber}</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">ชื่อบัญชี</label>
                <input
                  type="text"
                  value={formAccountName}
                  onChange={(e) => setFormAccountName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">ประเภทบัญชี</label>
                  <select
                    value={formAccountType}
                    onChange={(e) => setFormAccountType(e.target.value as any)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="both">ฝาก-ถอน</option>
                    <option value="deposit">รับฝากอย่างเดียว</option>
                    <option value="withdraw">ถอนอย่างเดียว</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">ลิมิตต่อวัน (บาท)</label>
                  <input
                    type="number"
                    value={formDailyLimit}
                    onChange={(e) => setFormDailyLimit(parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formAutoStatement}
                    onChange={(e) => setFormAutoStatement(e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 font-bold">เปิดใช้ Auto Statement</span>
                </label>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  resetForm();
                }}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleEditAccount}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all"
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
