import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Shield,
  Users,
  TrendingUp,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  Search
} from 'lucide-react';

interface SuspiciousActivity {
  id: string;
  type: 'multi_account' | 'unusual_pattern' | 'high_win_rate' | 'rapid_betting' | 'ip_fraud';
  userId: string;
  username: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  detectedAt: Date;
  status: 'pending' | 'investigating' | 'resolved' | 'false_positive';
  relatedUsers?: string[];
  evidence: string[];
}

export default function FraudDetection() {
  const [activities, setActivities] = useState<SuspiciousActivity[]>([
    {
      id: '1',
      type: 'multi_account',
      userId: 'user123',
      username: 'user123',
      description: 'ตรวจพบการสมัครหลายบัญชีจาก IP เดียวกัน',
      riskLevel: 'high',
      detectedAt: new Date(),
      status: 'pending',
      relatedUsers: ['user124', 'user125'],
      evidence: [
        'IP Address: 192.168.1.100 (3 บัญชี)',
        'Device ID เดียวกัน',
        'เบอร์โทรใกล้เคียงกัน',
      ],
    },
    {
      id: '2',
      type: 'unusual_pattern',
      userId: 'user456',
      username: 'user456',
      description: 'รูปแบบการแทงผิดปกติ - แทงเลขเดิมทุกงวด',
      riskLevel: 'medium',
      detectedAt: new Date(Date.now() - 3600000),
      status: 'investigating',
      evidence: [
        'แทงเลข 123 ทุกงวด 10 งวดติดต่อกัน',
        'จำนวนเงินเพิ่มขึ้นทุกงวด',
        'ชนะ 3 งวดล่าสุด',
      ],
    },
    {
      id: '3',
      type: 'high_win_rate',
      userId: 'user789',
      username: 'user789',
      description: 'อัตราชนะสูงผิดปกติ - 80% ใน 20 งวด',
      riskLevel: 'critical',
      detectedAt: new Date(Date.now() - 7200000),
      status: 'pending',
      evidence: [
        'ชนะ 16/20 งวด (80%)',
        'กำไรสุทธิ ฿450,000',
        'แทงเฉพาะเลขที่ออก',
      ],
    },
    {
      id: '4',
      type: 'rapid_betting',
      userId: 'user321',
      username: 'user321',
      description: 'แทงรวดเร็วผิดปกติ - 50 โพยใน 2 นาที',
      riskLevel: 'medium',
      detectedAt: new Date(Date.now() - 10800000),
      status: 'resolved',
      evidence: [
        'แทง 50 โพยใน 2 นาที',
        'ใช้ Bot หรือ Script',
        'ตรวจสอบแล้ว - เป็นตัวแทน',
      ],
    },
  ]);

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRisk, setFilterRisk] = useState<string>('all');

  const handleUpdateStatus = (id: string, newStatus: SuspiciousActivity['status']) => {
    setActivities(activities.map(a => 
      a.id === id ? { ...a, status: newStatus } : a
    ));
  };

  const handleBanUser = (userId: string, username: string) => {
    if (confirm(`ต้องการแบนผู้ใช้ ${username} ใช่หรือไม่?`)) {
      alert(`แบนผู้ใช้ ${username} เรียบร้อย!`);
    }
  };

  const getRiskBadge = (level: string) => {
    const styles = {
      low: 'bg-blue-100 text-blue-700',
      medium: 'bg-blue-300 text-blue-900',
      high: 'bg-blue-500 text-white',
      critical: 'bg-blue-600 text-white',
    };
    const labels = {
      low: 'ต่ำ',
      medium: 'ปานกลาง',
      high: 'สูง',
      critical: 'วิกฤต',
    };
    return { style: styles[level as keyof typeof styles] || styles.low, label: labels[level as keyof typeof labels] || level };
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-gray-100 text-gray-700',
      investigating: 'bg-blue-100 text-blue-700',
      resolved: 'bg-blue-100 text-blue-700',
      false_positive: 'bg-gray-100 text-gray-700',
    };
    const labels = {
      pending: 'รอตรวจสอบ',
      investigating: 'กำลังตรวจสอบ',
      resolved: 'แก้ไขแล้ว',
      false_positive: 'ไม่พบความผิดปกติ',
    };
    return { style: styles[status as keyof typeof styles] || styles.pending, label: labels[status as keyof typeof labels] || status };
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      multi_account: '🔄 หลายบัญชี',
      unusual_pattern: '📊 รูปแบบผิดปกติ',
      high_win_rate: '🎯 ชนะสูง',
      rapid_betting: '⚡ แทงรวดเร็ว',
      ip_fraud: '🌐 IP ผิดปกติ',
    };
    return labels[type as keyof typeof labels] || type;
  };

  const filteredActivities = activities.filter(a => {
    const matchStatus = filterStatus === 'all' || a.status === filterStatus;
    const matchRisk = filterRisk === 'all' || a.riskLevel === filterRisk;
    return matchStatus && matchRisk;
  });

  const stats = {
    total: activities.length,
    pending: activities.filter(a => a.status === 'pending').length,
    critical: activities.filter(a => a.riskLevel === 'critical').length,
    resolved: activities.filter(a => a.status === 'resolved').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">🔍 ตรวจจับการโกง</h1>
            <p className="text-gray-600 mt-1">ตรวจสอบพฤติกรรมผิดปกติและป้องกันการโกง</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-3 md:p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <AlertTriangle size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">กิจกรรมทั้งหมด</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-3 md:p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Eye size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">รอตรวจสอบ</p>
                <p className="text-2xl font-bold text-blue-600">{stats.pending}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-3 md:p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Shield size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">วิกฤต</p>
                <p className="text-2xl font-bold text-blue-600">{stats.critical}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-3 md:p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <CheckCircle size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">แก้ไขแล้ว</p>
                <p className="text-2xl font-bold text-blue-600">{stats.resolved}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex flex-col gap-3 md:gap-4 mb-4 md:mb-6">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">สถานะทั้งหมด</option>
              <option value="pending">รอตรวจสอบ</option>
              <option value="investigating">กำลังตรวจสอบ</option>
              <option value="resolved">แก้ไขแล้ว</option>
              <option value="false_positive">ไม่พบความผิดปกติ</option>
            </select>
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">ความเสี่ยงทั้งหมด</option>
              <option value="critical">วิกฤต</option>
              <option value="high">สูง</option>
              <option value="medium">ปานกลาง</option>
              <option value="low">ต่ำ</option>
            </select>
          </div>

          <div className="space-y-3 md:space-y-4">
            {filteredActivities.map((activity) => {
              const riskBadge = getRiskBadge(activity.riskLevel);
              const statusBadge = getStatusBadge(activity.status);
              
              return (
                <div key={activity.id} className="border-2 border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{getTypeLabel(activity.type)}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${riskBadge.style}`}>
                          {riskBadge.label}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadge.style}`}>
                          {statusBadge.label}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2">{activity.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>👤 {activity.username}</span>
                        <span>🕐 {activity.detectedAt.toLocaleString('th-TH')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-bold text-gray-700 mb-2">หลักฐาน:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {activity.evidence.map((ev, idx) => (
                        <li key={idx} className="text-sm text-gray-600">{ev}</li>
                      ))}
                    </ul>
                  </div>

                  {activity.relatedUsers && activity.relatedUsers.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-bold text-gray-700 mb-2">บัญชีที่เกี่ยวข้อง:</p>
                      <div className="flex flex-wrap gap-2">
                        {activity.relatedUsers.map((user, idx) => (
                          <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            {user}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                    {activity.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(activity.id, 'investigating')}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
                        >
                          เริ่มตรวจสอบ
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(activity.id, 'false_positive')}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                        >
                          ไม่พบความผิดปกติ
                        </button>
                      </>
                    )}
                    {activity.status === 'investigating' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(activity.id, 'resolved')}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
                        >
                          แก้ไขแล้ว
                        </button>
                        <button
                          onClick={() => handleBanUser(activity.userId, activity.username)}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700 transition-colors"
                        >
                          <Ban size={18} className="inline mr-2" />
                          แบนผู้ใช้
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">การตรวจจับอัตโนมัติ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border-2 border-blue-200 rounded-lg p-4">
              <h3 className="font-bold text-blue-600 mb-2">🔄 หลายบัญชี</h3>
              <p className="text-sm text-gray-600">ตรวจจับ IP, Device ID, เบอร์โทรซ้ำ</p>
            </div>
            <div className="border-2 border-blue-200 rounded-lg p-4">
              <h3 className="font-bold text-blue-600 mb-2">📊 รูปแบบผิดปกติ</h3>
              <p className="text-sm text-gray-600">วิเคราะห์รูปแบบการแทง</p>
            </div>
            <div className="border-2 border-blue-200 rounded-lg p-4">
              <h3 className="font-bold text-blue-600 mb-2">🎯 อัตราชนะสูง</h3>
              <p className="text-sm text-gray-600">ตรวจสอบอัตราชนะผิดปกติ</p>
            </div>
            <div className="border-2 border-blue-200 rounded-lg p-4">
              <h3 className="font-bold text-blue-600 mb-2">⚡ แทงรวดเร็ว</h3>
              <p className="text-sm text-gray-600">ตรวจจับ Bot และ Script</p>
            </div>
            <div className="border-2 border-blue-200 rounded-lg p-4">
              <h3 className="font-bold text-blue-600 mb-2">🌐 IP ผิดปกติ</h3>
              <p className="text-sm text-gray-600">ตรวจสอบ IP Proxy/VPN</p>
            </div>
            <div className="border-2 border-blue-200 rounded-lg p-4">
              <h3 className="font-bold text-blue-600 mb-2">💰 ฝาก-ถอนผิดปกติ</h3>
              <p className="text-sm text-gray-600">ตรวจจับการฟอกเงิน</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
