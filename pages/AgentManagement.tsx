import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  DollarSign,
  Percent,
  Award,
  Eye,
  UserPlus,
  Network
} from 'lucide-react';

interface Agent {
  id: string;
  username: string;
  fullName: string;
  phone: string;
  email: string;
  level: number;
  uplineId?: string;
  uplineName?: string;
  commissionRate: number;
  totalDownlines: number;
  totalSales: number;
  totalCommission: number;
  status: 'active' | 'suspended' | 'banned';
  joinDate: Date;
  lastActive: Date;
}

export default function AgentManagement() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  // Form states
  const [formUsername, setFormUsername] = useState('');
  const [formFullName, setFormFullName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formLevel, setFormLevel] = useState(1);
  const [formUpline, setFormUpline] = useState('');
  const [formCommission, setFormCommission] = useState(2);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = () => {
    const mockAgents: Agent[] = [
      {
        id: '1',
        username: 'agent001',
        fullName: 'สมชาย ตัวแทน',
        phone: '0812345678',
        email: 'agent001@email.com',
        level: 1,
        commissionRate: 5,
        totalDownlines: 25,
        totalSales: 5000000,
        totalCommission: 250000,
        status: 'active',
        joinDate: new Date('2024-01-01'),
        lastActive: new Date(),
      },
      {
        id: '2',
        username: 'agent002',
        fullName: 'สมหญิง ตัวแทน',
        phone: '0823456789',
        email: 'agent002@email.com',
        level: 2,
        uplineId: '1',
        uplineName: 'agent001',
        commissionRate: 3,
        totalDownlines: 10,
        totalSales: 2000000,
        totalCommission: 60000,
        status: 'active',
        joinDate: new Date('2024-01-15'),
        lastActive: new Date(),
      },
      {
        id: '3',
        username: 'agent003',
        fullName: 'สมศรี ตัวแทน',
        phone: '0834567890',
        email: 'agent003@email.com',
        level: 1,
        commissionRate: 5,
        totalDownlines: 15,
        totalSales: 3000000,
        totalCommission: 150000,
        status: 'active',
        joinDate: new Date('2024-02-01'),
        lastActive: new Date(Date.now() - 86400000),
      },
      {
        id: '4',
        username: 'agent004',
        fullName: 'สมปอง ตัวแทน',
        phone: '0845678901',
        email: 'agent004@email.com',
        level: 3,
        uplineId: '2',
        uplineName: 'agent002',
        commissionRate: 2,
        totalDownlines: 5,
        totalSales: 800000,
        totalCommission: 16000,
        status: 'active',
        joinDate: new Date('2024-02-10'),
        lastActive: new Date(Date.now() - 3600000),
      },
    ];
    setAgents(mockAgents);
  };

  const handleAddAgent = () => {
    if (!formUsername || !formFullName || !formPhone) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    const newAgent: Agent = {
      id: String(agents.length + 1),
      username: formUsername,
      fullName: formFullName,
      phone: formPhone,
      email: formEmail,
      level: formLevel,
      uplineId: formUpline || undefined,
      uplineName: formUpline ? agents.find(a => a.id === formUpline)?.username : undefined,
      commissionRate: formCommission,
      totalDownlines: 0,
      totalSales: 0,
      totalCommission: 0,
      status: 'active',
      joinDate: new Date(),
      lastActive: new Date(),
    };

    setAgents([...agents, newAgent]);
    setShowAddModal(false);
    resetForm();
    alert('เพิ่มตัวแทนใหม่เรียบร้อย!');
  };

  const handleEditAgent = () => {
    if (!selectedAgent) return;

    const updated = agents.map(a =>
      a.id === selectedAgent.id
        ? {
            ...a,
            fullName: formFullName,
            phone: formPhone,
            email: formEmail,
            commissionRate: formCommission,
          }
        : a
    );

    setAgents(updated);
    setShowEditModal(false);
    resetForm();
    alert('แก้ไขข้อมูลตัวแทนเรียบร้อย!');
  };

  const handleToggleStatus = (agent: Agent) => {
    const newStatus = agent.status === 'active' ? 'suspended' : 'active';
    setAgents(agents.map(a => a.id === agent.id ? { ...a, status: newStatus } : a));
  };

  const handleDeleteAgent = (agent: Agent) => {
    if (agent.totalDownlines > 0) {
      alert('ไม่สามารถลบตัวแทนที่มี Downline ได้');
      return;
    }
    if (confirm(`ต้องการลบตัวแทน ${agent.username} ใช่หรือไม่?`)) {
      setAgents(agents.filter(a => a.id !== agent.id));
      alert('ลบตัวแทนเรียบร้อย!');
    }
  };

  const resetForm = () => {
    setFormUsername('');
    setFormFullName('');
    setFormPhone('');
    setFormEmail('');
    setFormLevel(1);
    setFormUpline('');
    setFormCommission(2);
    setSelectedAgent(null);
  };

  const openEditModal = (agent: Agent) => {
    setSelectedAgent(agent);
    setFormUsername(agent.username);
    setFormFullName(agent.fullName);
    setFormPhone(agent.phone);
    setFormEmail(agent.email);
    setFormLevel(agent.level);
    setFormUpline(agent.uplineId || '');
    setFormCommission(agent.commissionRate);
    setShowEditModal(true);
  };

  const filteredAgents = agents.filter(agent => {
    const matchSearch = 
      agent.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.phone.includes(searchTerm);
    const matchStatus = filterStatus === 'all' || agent.status === filterStatus;
    const matchLevel = filterLevel === 'all' || agent.level === parseInt(filterLevel);
    return matchSearch && matchStatus && matchLevel;
  });

  const stats = {
    total: agents.length,
    active: agents.filter(a => a.status === 'active').length,
    totalSales: agents.reduce((sum, a) => sum + a.totalSales, 0),
    totalCommission: agents.reduce((sum, a) => sum + a.totalCommission, 0),
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-blue-100 text-blue-700',
      suspended: 'bg-gray-100 text-gray-700',
      banned: 'bg-gray-300 text-gray-900',
    };
    const labels = {
      active: 'ใช้งาน',
      suspended: 'ระงับ',
      banned: 'แบน',
    };
    return { style: styles[status as keyof typeof styles] || styles.active, label: labels[status as keyof typeof labels] || status };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">👥 จัดการตัวแทน</h1>
            <p className="text-gray-600 mt-1">จัดการตัวแทนและระบบ Upline-Downline</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold hover:bg-blue-700 transition-all"
          >
            <Plus size={20} />
            เพิ่มตัวแทนใหม่
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-3 md:p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">ตัวแทนทั้งหมด</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-3 md:p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Award size={24} className="text-blue-600" />
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
                <TrendingUp size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">ยอดขายรวม</p>
                <p className="text-2xl font-bold text-blue-600">฿{(stats.totalSales / 1000000).toFixed(1)}M</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-3 md:p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <DollarSign size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">ค่าคอมรวม</p>
                <p className="text-2xl font-bold text-blue-600">฿{(stats.totalCommission / 1000).toFixed(0)}K</p>
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
                placeholder="ค้นหา (ชื่อผู้ใช้, ชื่อ-นามสกุล, เบอร์โทร)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
              <option value="1">Level 1</option>
              <option value="2">Level 2</option>
              <option value="3">Level 3</option>
            </select>
          </div>

          <div className="overflow-x-auto -mx-4 md:mx-0">
            <table className="w-full min-w-[800px]">
              <thead className="bg-blue-50 border-b-2 border-blue-200">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">ตัวแทน</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">ข้อมูลติดต่อ</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-700">Level</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">Upline</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-700">ค่าคอม</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-700">Downlines</th>
                  <th className="px-4 py-3 text-right font-bold text-gray-700">ยอดขาย</th>
                  <th className="px-4 py-3 text-right font-bold text-gray-700">ค่าคอมรวม</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-700">สถานะ</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-700">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAgents.map((agent) => {
                  const statusBadge = getStatusBadge(agent.status);
                  return (
                    <tr key={agent.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-bold text-gray-900">{agent.username}</p>
                          <p className="text-sm text-gray-600">{agent.fullName}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-600">
                          <p>{agent.phone}</p>
                          <p>{agent.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                          L{agent.level}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {agent.uplineName ? (
                          <span className="text-sm text-gray-600">{agent.uplineName}</span>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="font-bold text-blue-600">{agent.commissionRate}%</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="font-bold text-gray-900">{agent.totalDownlines}</span>
                      </td>
                      <td className="px-4 py-4 text-right font-bold text-gray-900">
                        ฿{agent.totalSales.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-right font-bold text-blue-600">
                        ฿{agent.totalCommission.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadge.style}`}>
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditModal(agent)}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            title="แก้ไข"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(agent)}
                            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                            title={agent.status === 'active' ? 'ระงับ' : 'เปิดใช้'}
                          >
                            {agent.status === 'active' ? '🔒' : '🔓'}
                          </button>
                          <button
                            onClick={() => handleDeleteAgent(agent)}
                            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                            title="ลบ"
                          >
                            <Trash2 size={18} />
                          </button>
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

      {/* Add Agent Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">เพิ่มตัวแทนใหม่</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">ชื่อผู้ใช้</label>
                  <input
                    type="text"
                    value={formUsername}
                    onChange={(e) => setFormUsername(e.target.value)}
                    placeholder="agent001"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">ชื่อ-นามสกุล</label>
                  <input
                    type="text"
                    value={formFullName}
                    onChange={(e) => setFormFullName(e.target.value)}
                    placeholder="สมชาย ตัวแทน"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">เบอร์โทร</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="0812345678"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">อีเมล</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="agent@email.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Level</label>
                  <select
                    value={formLevel}
                    onChange={(e) => setFormLevel(parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={1}>Level 1</option>
                    <option value={2}>Level 2</option>
                    <option value={3}>Level 3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Upline</label>
                  <select
                    value={formUpline}
                    onChange={(e) => setFormUpline(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">ไม่มี</option>
                    {agents.filter(a => a.level < formLevel).map(a => (
                      <option key={a.id} value={a.id}>{a.username}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">ค่าคอม (%)</label>
                  <input
                    type="number"
                    value={formCommission}
                    onChange={(e) => setFormCommission(parseFloat(e.target.value))}
                    step="0.1"
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
                onClick={handleAddAgent}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all"
              >
                เพิ่มตัวแทน
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Agent Modal */}
      {showEditModal && selectedAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">แก้ไขข้อมูลตัวแทน</h2>
              <p className="text-gray-600 mt-1">{selectedAgent.username}</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">ชื่อ-นามสกุล</label>
                <input
                  type="text"
                  value={formFullName}
                  onChange={(e) => setFormFullName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">เบอร์โทร</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">อีเมล</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">ค่าคอม (%)</label>
                <input
                  type="number"
                  value={formCommission}
                  onChange={(e) => setFormCommission(parseFloat(e.target.value))}
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
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
                onClick={handleEditAgent}
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
