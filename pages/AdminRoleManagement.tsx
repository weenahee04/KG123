import React, { useState } from 'react';
import { 
  Shield, 
  Users,
  Plus,
  Edit,
  Trash2,
  Lock,
  Unlock,
  Eye,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface Admin {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: 'super_admin' | 'admin' | 'manager' | 'viewer';
  permissions: string[];
  status: 'active' | 'inactive';
  lastLogin: Date;
  createdAt: Date;
}

export default function AdminRoleManagement() {
  const [admins, setAdmins] = useState<Admin[]>([
    {
      id: '1',
      username: 'superadmin',
      fullName: 'ผู้ดูแลระบบหลัก',
      email: 'superadmin@system.com',
      role: 'super_admin',
      permissions: ['all'],
      status: 'active',
      lastLogin: new Date(),
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      username: 'admin001',
      fullName: 'แอดมิน 1',
      email: 'admin001@system.com',
      role: 'admin',
      permissions: ['members', 'bets', 'finance', 'reports'],
      status: 'active',
      lastLogin: new Date(Date.now() - 3600000),
      createdAt: new Date('2024-01-15'),
    },
    {
      id: '3',
      username: 'manager001',
      fullName: 'ผู้จัดการ 1',
      email: 'manager001@system.com',
      role: 'manager',
      permissions: ['members', 'bets', 'reports'],
      status: 'active',
      lastLogin: new Date(Date.now() - 7200000),
      createdAt: new Date('2024-02-01'),
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);

  const allPermissions = [
    { id: 'members', name: 'จัดการสมาชิก', icon: '👥' },
    { id: 'agents', name: 'จัดการตัวแทน', icon: '🤝' },
    { id: 'bets', name: 'จัดการโพย', icon: '📋' },
    { id: 'finance', name: 'การเงิน (ฝาก-ถอน)', icon: '💰' },
    { id: 'lottery', name: 'จัดการงวดหวย', icon: '🎰' },
    { id: 'results', name: 'ประกาศผล', icon: '🏆' },
    { id: 'reports', name: 'รายงาน', icon: '📊' },
    { id: 'settings', name: 'ตั้งค่าระบบ', icon: '⚙️' },
    { id: 'admins', name: 'จัดการแอดมิน', icon: '🛡️' },
  ];

  const roleLabels = {
    super_admin: 'Super Admin',
    admin: 'Admin',
    manager: 'Manager',
    viewer: 'Viewer',
  };

  const roleColors = {
    super_admin: 'bg-blue-600 text-white',
    admin: 'bg-blue-500 text-white',
    manager: 'bg-blue-100 text-blue-700',
    viewer: 'bg-gray-100 text-gray-700',
  };

  const handleToggleStatus = (admin: Admin) => {
    setAdmins(admins.map(a => 
      a.id === admin.id ? { ...a, status: a.status === 'active' ? 'inactive' : 'active' } : a
    ));
  };

  const handleDeleteAdmin = (admin: Admin) => {
    if (admin.role === 'super_admin') {
      alert('ไม่สามารถลบ Super Admin ได้');
      return;
    }
    if (confirm(`ต้องการลบ ${admin.username} ใช่หรือไม่?`)) {
      setAdmins(admins.filter(a => a.id !== admin.id));
      alert('ลบแอดมินเรียบร้อย!');
    }
  };

  const stats = {
    total: admins.length,
    active: admins.filter(a => a.status === 'active').length,
    superAdmin: admins.filter(a => a.role === 'super_admin').length,
    admin: admins.filter(a => a.role === 'admin').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">🛡️ จัดการแอดมินและสิทธิ์</h1>
            <p className="text-gray-600 mt-1">จัดการผู้ดูแลระบบและกำหนดสิทธิ์การเข้าถึง</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold hover:bg-blue-700 transition-all"
          >
            <Plus size={20} />
            เพิ่มแอดมินใหม่
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-3 md:p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Shield size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">แอดมินทั้งหมด</p>
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
                <Shield size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Super Admin</p>
                <p className="text-2xl font-bold text-blue-600">{stats.superAdmin}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-3 md:p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Admin</p>
                <p className="text-2xl font-bold text-blue-600">{stats.admin}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-4 md:p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">รายการแอดมิน</h2>
          
          <div className="space-y-4">
            {admins.map((admin) => (
              <div key={admin.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-blue-100 rounded-lg">
                      <Shield size={32} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{admin.username}</h3>
                      <p className="text-gray-600">{admin.fullName}</p>
                      <p className="text-sm text-gray-500">{admin.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-4 py-2 rounded-lg text-sm font-bold ${roleColors[admin.role]}`}>
                      {roleLabels[admin.role]}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      admin.status === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {admin.status === 'active' ? 'ใช้งาน' : 'ปิดใช้'}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-bold text-gray-700 mb-2">สิทธิ์การเข้าถึง:</p>
                  <div className="flex flex-wrap gap-2">
                    {admin.permissions.includes('all') ? (
                      <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
                        ✨ ทุกสิทธิ์
                      </span>
                    ) : (
                      admin.permissions.map(perm => {
                        const permission = allPermissions.find(p => p.id === perm);
                        return permission ? (
                          <span key={perm} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                            {permission.icon} {permission.name}
                          </span>
                        ) : null;
                      })
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    <p>เข้าสู่ระบบล่าสุด: {admin.lastLogin.toLocaleString('th-TH')}</p>
                    <p>สร้างเมื่อ: {admin.createdAt.toLocaleDateString('th-TH')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedAdmin(admin)}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                      title="แก้ไข"
                    >
                      <Edit size={18} />
                    </button>
                    {admin.role !== 'super_admin' && (
                      <>
                        <button
                          onClick={() => handleToggleStatus(admin)}
                          className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                          title={admin.status === 'active' ? 'ปิดใช้' : 'เปิดใช้'}
                        >
                          {admin.status === 'active' ? <Lock size={18} /> : <Unlock size={18} />}
                        </button>
                        <button
                          onClick={() => handleDeleteAdmin(admin)}
                          className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                          title="ลบ"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-4 md:p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">สิทธิ์ตามบทบาท</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="border-2 border-blue-600 rounded-lg p-4">
              <h3 className="font-bold text-blue-600 mb-2">Super Admin</h3>
              <p className="text-sm text-gray-600">✨ ทุกสิทธิ์ในระบบ</p>
            </div>
            <div className="border-2 border-blue-500 rounded-lg p-4">
              <h3 className="font-bold text-blue-500 mb-2">Admin</h3>
              <p className="text-sm text-gray-600">จัดการสมาชิก, โพย, การเงิน, รายงาน</p>
            </div>
            <div className="border-2 border-blue-300 rounded-lg p-4">
              <h3 className="font-bold text-blue-700 mb-2">Manager</h3>
              <p className="text-sm text-gray-600">จัดการสมาชิก, โพย, รายงาน</p>
            </div>
            <div className="border-2 border-gray-300 rounded-lg p-4">
              <h3 className="font-bold text-gray-700 mb-2">Viewer</h3>
              <p className="text-sm text-gray-600">ดูรายงานเท่านั้น</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
