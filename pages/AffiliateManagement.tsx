import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter,
  DollarSign,
  TrendingUp,
  Award,
  Download,
  Eye,
  CheckCircle,
  Clock,
  UserPlus,
  Percent,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

interface AffiliateMember {
  id: string;
  username: string;
  fullName: string;
  referralCode: string;
  totalReferrals: number;
  activeReferrals: number;
  totalCommission: number;
  pendingCommission: number;
  paidCommission: number;
  totalSales: number;
  joinDate: Date;
  lastCommissionDate?: Date;
  status: 'active' | 'suspended';
}

interface CommissionTransaction {
  id: string;
  affiliateUsername: string;
  referredUsername: string;
  ticketNumber: string;
  betAmount: number;
  commissionRate: number;
  commissionAmount: number;
  status: 'pending' | 'paid';
  createdAt: Date;
  paidAt?: Date;
}

export default function AffiliateManagement() {
  const [affiliates, setAffiliates] = useState<AffiliateMember[]>([]);
  const [commissions, setCommissions] = useState<CommissionTransaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedAffiliate, setSelectedAffiliate] = useState<AffiliateMember | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'affiliates' | 'commissions'>('affiliates');

  useEffect(() => {
    loadAffiliates();
    loadCommissions();
  }, []);

  const loadAffiliates = async () => {
    try {
      setLoading(true);
      setError(null);

      // Mock data - replace with real API call
      const mockAffiliates: AffiliateMember[] = [
        {
          id: '1',
          username: 'affiliate001',
          fullName: 'สมชาย ใจดี',
          referralCode: 'REF001',
          totalReferrals: 25,
          activeReferrals: 20,
          totalCommission: 45000,
          pendingCommission: 3500,
          paidCommission: 41500,
          totalSales: 562500,
          joinDate: new Date('2024-01-15'),
          lastCommissionDate: new Date(),
          status: 'active',
        },
        {
          id: '2',
          username: 'affiliate042',
          fullName: 'สมหญิง รักสนุก',
          referralCode: 'REF042',
          totalReferrals: 18,
          activeReferrals: 15,
          totalCommission: 32000,
          pendingCommission: 2800,
          paidCommission: 29200,
          totalSales: 400000,
          joinDate: new Date('2024-02-01'),
          lastCommissionDate: new Date(Date.now() - 86400000),
          status: 'active',
        },
        {
          id: '3',
          username: 'affiliate089',
          fullName: 'สมศรี มีสุข',
          referralCode: 'REF089',
          totalReferrals: 12,
          activeReferrals: 10,
          totalCommission: 18000,
          pendingCommission: 1500,
          paidCommission: 16500,
          totalSales: 225000,
          joinDate: new Date('2024-03-10'),
          lastCommissionDate: new Date(Date.now() - 172800000),
          status: 'active',
        },
      ];

      setAffiliates(mockAffiliates);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load affiliates:', err);
      setError(err instanceof Error ? err.message : 'Failed to load affiliates');
      setLoading(false);
    }
  };

  const loadCommissions = async () => {
    try {
      // Mock data - replace with real API call
      const mockCommissions: CommissionTransaction[] = [
        {
          id: '1',
          affiliateUsername: 'affiliate001',
          referredUsername: 'user123',
          ticketNumber: 'TKT20240204001',
          betAmount: 5000,
          commissionRate: 8,
          commissionAmount: 400,
          status: 'pending',
          createdAt: new Date(),
        },
        {
          id: '2',
          affiliateUsername: 'affiliate001',
          referredUsername: 'user456',
          ticketNumber: 'TKT20240203015',
          betAmount: 3000,
          commissionRate: 8,
          commissionAmount: 240,
          status: 'paid',
          createdAt: new Date(Date.now() - 86400000),
          paidAt: new Date(Date.now() - 3600000),
        },
        {
          id: '3',
          affiliateUsername: 'affiliate042',
          referredUsername: 'user789',
          ticketNumber: 'TKT20240204002',
          betAmount: 2500,
          commissionRate: 8,
          commissionAmount: 200,
          status: 'pending',
          createdAt: new Date(),
        },
      ];

      setCommissions(mockCommissions);
    } catch (err) {
      console.error('Failed to load commissions:', err);
    }
  };

  const handlePayCommission = async (affiliateId: string) => {
    if (!confirm('ต้องการจ่ายค่าคอมมิชชั่นที่ค้างอยู่ทั้งหมดใช่หรือไม่?')) return;

    try {
      // Replace with real API call
      // await affiliateAPI.payCommission(affiliateId);
      alert('จ่ายค่าคอมมิชชั่นสำเร็จ!');
      await loadAffiliates();
      await loadCommissions();
    } catch (err) {
      alert('เกิดข้อผิดพลาด: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleViewDetail = (affiliate: AffiliateMember) => {
    setSelectedAffiliate(affiliate);
    setShowDetailModal(true);
  };

  const filteredAffiliates = affiliates.filter(affiliate => {
    const matchSearch = affiliate.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       affiliate.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       affiliate.referralCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || affiliate.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const filteredCommissions = commissions.filter(commission => {
    const matchSearch = commission.affiliateUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       commission.referredUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       commission.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  const stats = {
    totalAffiliates: affiliates.length,
    activeAffiliates: affiliates.filter(a => a.status === 'active').length,
    totalReferrals: affiliates.reduce((sum, a) => sum + a.totalReferrals, 0),
    totalCommissionPaid: affiliates.reduce((sum, a) => sum + a.paidCommission, 0),
    pendingCommission: affiliates.reduce((sum, a) => sum + a.pendingCommission, 0),
    totalSales: affiliates.reduce((sum, a) => sum + a.totalSales, 0),
  };

  if (loading && affiliates.length === 0) {
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
            onClick={() => loadAffiliates()}
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
            <h1 className="text-3xl font-bold text-gray-900">🤝 จัดการระบบ Affiliate</h1>
            <p className="text-gray-600 mt-1">แนะนำเพื่อนรับค่าคอมมิชชั่น 8%</p>
          </div>
          <button className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition-all">
            <Download size={20} />
            ส่งออกรายงาน
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Affiliate ทั้งหมด</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAffiliates}</p>
                <p className="text-xs text-green-600">ใช้งาน: {stats.activeAffiliates}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <UserPlus size={24} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">สมาชิกที่แนะนำ</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalReferrals}</p>
                <p className="text-xs text-gray-500">คน</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">ค่าคอมมิชชั่นจ่ายแล้ว</p>
                <p className="text-2xl font-bold text-gray-900">฿{stats.totalCommissionPaid.toLocaleString()}</p>
                <p className="text-xs text-gray-500">ทั้งหมด</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock size={24} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">ค่าคอมมิชชั่นค้างจ่าย</p>
                <p className="text-2xl font-bold text-gray-900">฿{stats.pendingCommission.toLocaleString()}</p>
                <p className="text-xs text-yellow-600">รอดำเนินการ</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <TrendingUp size={24} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">ยอดขายรวม</p>
                <p className="text-2xl font-bold text-gray-900">฿{stats.totalSales.toLocaleString()}</p>
                <p className="text-xs text-gray-500">จากสมาชิกที่แนะนำ</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Percent size={24} className="text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">อัตราค่าคอมมิชชั่น</p>
                <p className="text-2xl font-bold text-gray-900">8%</p>
                <p className="text-xs text-gray-500">จากยอดแทง</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('affiliates')}
              className={`flex-1 px-6 py-4 font-bold transition-all ${
                activeTab === 'affiliates'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Users size={20} className="inline mr-2" />
              รายชื่อ Affiliate
            </button>
            <button
              onClick={() => setActiveTab('commissions')}
              className={`flex-1 px-6 py-4 font-bold transition-all ${
                activeTab === 'commissions'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <DollarSign size={20} className="inline mr-2" />
              ประวัติค่าคอมมิชชั่น
            </button>
          </div>

          <div className="p-6">
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="ค้นหา (ชื่อผู้ใช้, ชื่อจริง, รหัสแนะนำ)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {activeTab === 'affiliates' && (
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">สถานะทั้งหมด</option>
                  <option value="active">ใช้งาน</option>
                  <option value="suspended">ระงับ</option>
                </select>
              )}
            </div>

            {/* Affiliates Table */}
            {activeTab === 'affiliates' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Affiliate</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">รหัสแนะนำ</th>
                      <th className="px-4 py-3 text-center text-sm font-bold text-gray-700">สมาชิกที่แนะนำ</th>
                      <th className="px-4 py-3 text-right text-sm font-bold text-gray-700">ยอดขายรวม</th>
                      <th className="px-4 py-3 text-right text-sm font-bold text-gray-700">คอมมิชชั่นค้างจ่าย</th>
                      <th className="px-4 py-3 text-right text-sm font-bold text-gray-700">คอมมิชชั่นจ่ายแล้ว</th>
                      <th className="px-4 py-3 text-center text-sm font-bold text-gray-700">สถานะ</th>
                      <th className="px-4 py-3 text-center text-sm font-bold text-gray-700">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredAffiliates.map((affiliate) => (
                      <tr key={affiliate.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4">
                          <div>
                            <p className="font-bold text-gray-900">{affiliate.username}</p>
                            <p className="text-sm text-gray-500">{affiliate.fullName}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                            <Award size={14} />
                            {affiliate.referralCode}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <div>
                            <p className="font-bold text-gray-900">{affiliate.totalReferrals}</p>
                            <p className="text-xs text-green-600">ใช้งาน: {affiliate.activeReferrals}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <p className="font-bold text-gray-900">฿{affiliate.totalSales.toLocaleString()}</p>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <p className="font-bold text-yellow-600">฿{affiliate.pendingCommission.toLocaleString()}</p>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <p className="font-bold text-green-600">฿{affiliate.paidCommission.toLocaleString()}</p>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                            affiliate.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {affiliate.status === 'active' ? <CheckCircle size={14} /> : <Clock size={14} />}
                            {affiliate.status === 'active' ? 'ใช้งาน' : 'ระงับ'}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleViewDetail(affiliate)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="ดูรายละเอียด"
                            >
                              <Eye size={18} />
                            </button>
                            {affiliate.pendingCommission > 0 && (
                              <button
                                onClick={() => handlePayCommission(affiliate.id)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                                title="จ่ายค่าคอมมิชชั่น"
                              >
                                <DollarSign size={18} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Commissions Table */}
            {activeTab === 'commissions' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Affiliate</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">สมาชิกที่แนะนำ</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">เลขโพย</th>
                      <th className="px-4 py-3 text-right text-sm font-bold text-gray-700">ยอดแทง</th>
                      <th className="px-4 py-3 text-center text-sm font-bold text-gray-700">อัตรา</th>
                      <th className="px-4 py-3 text-right text-sm font-bold text-gray-700">ค่าคอมมิชชั่น</th>
                      <th className="px-4 py-3 text-center text-sm font-bold text-gray-700">สถานะ</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">วันที่</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredCommissions.map((commission) => (
                      <tr key={commission.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4">
                          <p className="font-bold text-gray-900">{commission.affiliateUsername}</p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-gray-700">{commission.referredUsername}</p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm text-gray-600">{commission.ticketNumber}</p>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <p className="font-bold text-gray-900">฿{commission.betAmount.toLocaleString()}</p>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-bold">
                            <Percent size={12} />
                            {commission.commissionRate}%
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <p className="font-bold text-green-600">฿{commission.commissionAmount.toLocaleString()}</p>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                            commission.status === 'paid'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {commission.status === 'paid' ? <CheckCircle size={14} /> : <Clock size={14} />}
                            {commission.status === 'paid' ? 'จ่ายแล้ว' : 'รอจ่าย'}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div>
                            <p className="text-sm text-gray-700">{commission.createdAt.toLocaleDateString('th-TH')}</p>
                            <p className="text-xs text-gray-500">{commission.createdAt.toLocaleTimeString('th-TH')}</p>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedAffiliate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">รายละเอียด Affiliate</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">ชื่อผู้ใช้</p>
                  <p className="font-bold text-gray-900">{selectedAffiliate.username}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">ชื่อจริง</p>
                  <p className="font-bold text-gray-900">{selectedAffiliate.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">รหัสแนะนำ</p>
                  <p className="font-bold text-blue-600">{selectedAffiliate.referralCode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">สถานะ</p>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                    selectedAffiliate.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {selectedAffiliate.status === 'active' ? 'ใช้งาน' : 'ระงับ'}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">สมาชิกที่แนะนำทั้งหมด</p>
                  <p className="font-bold text-gray-900">{selectedAffiliate.totalReferrals} คน</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">สมาชิกที่ใช้งาน</p>
                  <p className="font-bold text-green-600">{selectedAffiliate.activeReferrals} คน</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">ยอดขายรวม</p>
                  <p className="font-bold text-gray-900">฿{selectedAffiliate.totalSales.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">ค่าคอมมิชชั่นรวม</p>
                  <p className="font-bold text-gray-900">฿{selectedAffiliate.totalCommission.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">ค่าคอมมิชชั่นค้างจ่าย</p>
                  <p className="font-bold text-yellow-600">฿{selectedAffiliate.pendingCommission.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">ค่าคอมมิชชั่นจ่ายแล้ว</p>
                  <p className="font-bold text-green-600">฿{selectedAffiliate.paidCommission.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">วันที่สมัคร</p>
                  <p className="text-gray-900">{selectedAffiliate.joinDate.toLocaleDateString('th-TH')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">คอมมิชชั่นล่าสุด</p>
                  <p className="text-gray-900">
                    {selectedAffiliate.lastCommissionDate
                      ? selectedAffiliate.lastCommissionDate.toLocaleDateString('th-TH')
                      : '-'}
                  </p>
                </div>
              </div>

              {selectedAffiliate.pendingCommission > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      handlePayCommission(selectedAffiliate.id);
                      setShowDetailModal(false);
                    }}
                    className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                  >
                    <DollarSign size={20} />
                    จ่ายค่าคอมมิชชั่น ฿{selectedAffiliate.pendingCommission.toLocaleString()}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
