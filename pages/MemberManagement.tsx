import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter,
  Edit,
  Lock,
  Unlock,
  DollarSign,
  TrendingUp,
  Eye,
  Download,
  UserPlus,
  Shield,
  Award,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { memberAPI } from '../src/services/api';

interface Member {
  id: string;
  username: string;
  fullName: string;
  phone: string;
  email: string;
  credit: number;
  totalBets: number;
  totalDeposit: number;
  totalWithdraw: number;
  level: 'VIP' | 'Premium' | 'Normal';
  status: 'active' | 'suspended' | 'banned';
  referralCode: string;
  referredBy?: string;
  joinDate: Date;
  lastActive: Date;
}

export default function MemberManagement() {
  const [members, setMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [creditAmount, setCreditAmount] = useState(0);
  const [creditType, setCreditType] = useState<'add' | 'subtract'>('add');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      setLoading(true);
      setError(null);

      const statusFilter = filterStatus === 'all' ? undefined : filterStatus.toUpperCase();
      const data = await memberAPI.getMembers(searchTerm || undefined, statusFilter);

      const mappedMembers = data.map(m => ({
        id: m.id,
        username: m.username,
        fullName: m.fullName,
        phone: m.phone,
        email: '',
        credit: m.balance,
        totalBets: m.totalBets,
        totalDeposit: m.totalDeposit,
        totalWithdraw: m.totalWithdraw,
        level: 'Normal' as 'VIP' | 'Premium' | 'Normal',
        status: m.status.toLowerCase() as 'active' | 'suspended' | 'banned',
        referralCode: m.referralCode,
        referredBy: m.referredBy,
        joinDate: new Date(m.createdAt),
        lastActive: m.lastLogin ? new Date(m.lastLogin) : new Date(m.createdAt)
      }));

      setMembers(mappedMembers);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load members:', err);
      setError(err instanceof Error ? err.message : 'Failed to load members');
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(member => {
    const matchSearch = member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       member.phone.includes(searchTerm);
    const matchStatus = filterStatus === 'all' || member.status === filterStatus;
    const matchLevel = filterLevel === 'all' || member.level === filterLevel;
    return matchSearch && matchStatus && matchLevel;
  });

  const handleEditCredit = (member: Member) => {
    setSelectedMember(member);
    setShowCreditModal(true);
    setCreditAmount(0);
  };

  const handleSaveCredit = async () => {
    if (!selectedMember || creditAmount === 0) {
      alert('กรุณาระบุจำนวนเงิน');
      return;
    }

    try {
      const adjustAmount = creditType === 'add' ? creditAmount : -creditAmount;
      await memberAPI.adjustBalance(selectedMember.id, adjustAmount, 'Manual adjustment by admin');
      alert('ปรับยอดเครดิตสำเร็จ!');
      setShowCreditModal(false);
      setSelectedMember(null);
      setCreditAmount(0);
      await loadMembers();
    } catch (err) {
      alert('เกิดข้อผิดพลาด: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleToggleStatus = async (member: Member) => {
    try {
      if (member.status === 'active') {
        const reason = prompt('ระบุเหตุผลในการระงับ:');
        if (!reason) return;
        await memberAPI.suspendMember(member.id, reason);
        alert('ระงับสมาชิกสำเร็จ!');
      } else {
        await memberAPI.unsuspendMember(member.id);
        alert('ยกเลิกระงับสมาชิกสำเร็จ!');
      }
      await loadMembers();
    } catch (err) {
      alert('เกิดข้อผิดพลาด: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const getLevelBadge = (level: string) => {
    const styles = {
      VIP: 'bg-blue-600 text-white',
      Premium: 'bg-blue-500 text-white',
      Normal: 'bg-gray-200 text-gray-700',
    };
    return styles[level as keyof typeof styles] || styles.Normal;
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-blue-100 text-blue-700',
      suspended: 'bg-gray-100 text-gray-700',
      banned: 'bg-gray-300 text-gray-900',
    };
    return styles[status as keyof typeof styles] || styles.active;
  };

  if (loading && members.length === 0) {
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
            onClick={() => loadMembers()}
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
            <h1 className="text-3xl font-bold text-gray-900">👥 จัดการสมาชิก</h1>
            <p className="text-gray-600 mt-1">ดูและจัดการข้อมูลสมาชิกทั้งหมด</p>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-all">
            <UserPlus size={20} />
            เพิ่มสมาชิกใหม่
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">สมาชิกทั้งหมด</p>
                <p className="text-2xl font-bold text-gray-900">{members.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Shield size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">สมาชิกใช้งาน</p>
                <p className="text-2xl font-bold text-gray-900">
                  {members.filter(m => m.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Award size={24} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">สมาชิก VIP</p>
                <p className="text-2xl font-bold text-gray-900">
                  {members.filter(m => m.level === 'VIP').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <DollarSign size={24} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">เครดิตรวม</p>
                <p className="text-2xl font-bold text-gray-900">
                  ฿{members.reduce((sum, m) => sum + m.credit, 0).toLocaleString()}
                </p>
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
                placeholder="ค้นหา (ชื่อผู้ใช้, ชื่อ-นามสกุล, เบอร์โทร)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">สถานะทั้งหมด</option>
              <option value="active">ใช้งาน</option>
              <option value="suspended">ระงับ</option>
              <option value="banned">แบน</option>
            </select>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">ระดับทั้งหมด</option>
              <option value="VIP">VIP</option>
              <option value="Premium">Premium</option>
              <option value="Normal">Normal</option>
            </select>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors">
              <Download size={20} />
              Export
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-50 border-b-2 border-blue-200">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">ผู้ใช้</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">ข้อมูลติดต่อ</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-700">ระดับ</th>
                  <th className="px-4 py-3 text-right font-bold text-gray-700">เครดิต</th>
                  <th className="px-4 py-3 text-right font-bold text-gray-700">ยอดแทงรวม</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-700">สถานะ</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-700">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-purple-50 transition-colors">
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-bold text-gray-900">{member.username}</p>
                        <p className="text-sm text-gray-600">{member.fullName}</p>
                        {member.referredBy && (
                          <p className="text-xs text-blue-600">👥 แนะนำโดย: {member.referredBy}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm">
                        <p className="text-gray-900">📱 {member.phone}</p>
                        <p className="text-gray-600">📧 {member.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getLevelBadge(member.level)}`}>
                        {member.level}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <p className="font-bold text-green-600">฿{member.credit.toLocaleString()}</p>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <p className="font-bold text-gray-900">฿{member.totalBets.toLocaleString()}</p>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(member.status)}`}>
                        {member.status === 'active' ? '✓ ใช้งาน' : member.status === 'suspended' ? '⏸ ระงับ' : '✗ แบน'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditCredit(member)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                          title="แก้ไขเครดิต"
                        >
                          <DollarSign size={16} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(member)}
                          className={`p-2 rounded-lg transition-colors ${
                            member.status === 'active'
                              ? 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                              : 'bg-green-100 text-green-600 hover:bg-green-200'
                          }`}
                          title={member.status === 'active' ? 'ระงับบัญชี' : 'ปลดระงับ'}
                        >
                          {member.status === 'active' ? <Lock size={16} /> : <Unlock size={16} />}
                        </button>
                        <button
                          className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                          title="ดูรายละเอียด"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showCreditModal && selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">แก้ไขเครดิต</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">สมาชิก</p>
                <p className="font-bold text-gray-900">{selectedMember.username}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">เครดิตปัจจุบัน</p>
                <p className="text-2xl font-bold text-green-600">฿{selectedMember.credit.toLocaleString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ประเภท</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCreditType('add')}
                    className={`flex-1 py-2 rounded-lg font-bold transition-colors ${
                      creditType === 'add'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    + เพิ่มเครดิต
                  </button>
                  <button
                    onClick={() => setCreditType('subtract')}
                    className={`flex-1 py-2 rounded-lg font-bold transition-colors ${
                      creditType === 'subtract'
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    - ลดเครดิต
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">จำนวนเงิน</label>
                <input
                  type="number"
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="0"
                />
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">เครดิตใหม่</p>
                <p className="text-xl font-bold text-blue-600">
                  ฿{(creditType === 'add' 
                    ? selectedMember.credit + creditAmount 
                    : selectedMember.credit - creditAmount
                  ).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreditModal(false)}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleSaveCredit}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all"
                >
                  บันทึก
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
