import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  AlertCircle, 
  CheckCircle, 
  Info,
  TrendingUp,
  Users,
  DollarSign,
  Award,
  X,
  Settings,
  Volume2,
  VolumeX
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  category: 'deposit' | 'withdrawal' | 'bet' | 'result' | 'risk' | 'system';
}

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    loadNotifications();
    
    if (autoRefresh) {
      const interval = setInterval(() => {
        loadNotifications();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const loadNotifications = () => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'warning',
        title: 'ความเสี่ยงสูง!',
        message: 'เลข 123 มียอดแทงถึง 92% ของลิมิต กรุณาตรวจสอบ',
        timestamp: new Date(),
        read: false,
        category: 'risk',
      },
      {
        id: '2',
        type: 'info',
        title: 'รายการฝากใหม่',
        message: 'user001 ฝากเงิน ฿5,000 รอการอนุมัติ',
        timestamp: new Date(Date.now() - 300000),
        read: false,
        category: 'deposit',
      },
      {
        id: '3',
        type: 'success',
        title: 'ประกาศผลสำเร็จ',
        message: 'ประกาศผลงวดวันที่ 16/02/2024 เรียบร้อยแล้ว',
        timestamp: new Date(Date.now() - 600000),
        read: true,
        category: 'result',
      },
      {
        id: '4',
        type: 'info',
        title: 'รายการถอนใหม่',
        message: 'user042 ถอนเงิน ฿3,000 รอการอนุมัติ',
        timestamp: new Date(Date.now() - 900000),
        read: false,
        category: 'withdrawal',
      },
      {
        id: '5',
        type: 'error',
        title: 'เกินลิมิต!',
        message: 'เลข 456 ถูกปฏิเสธ - เกินลิมิตสูงสุด',
        timestamp: new Date(Date.now() - 1200000),
        read: true,
        category: 'risk',
      },
      {
        id: '6',
        type: 'success',
        title: 'สมาชิกใหม่',
        message: 'มีสมาชิกใหม่ 5 คน ในวันนี้',
        timestamp: new Date(Date.now() - 1800000),
        read: true,
        category: 'system',
      },
      {
        id: '7',
        type: 'warning',
        title: 'ยอดแทงสูง',
        message: 'ยอดแทงรวมวันนี้เกิน ฿500,000',
        timestamp: new Date(Date.now() - 3600000),
        read: true,
        category: 'bet',
      },
    ];
    setNotifications(mockNotifications);
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.read;
    return notif.category === filter;
  });

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    const icons = {
      success: <CheckCircle size={20} className="text-green-600" />,
      warning: <AlertCircle size={20} className="text-yellow-600" />,
      error: <AlertCircle size={20} className="text-red-600" />,
      info: <Info size={20} className="text-blue-600" />,
    };
    return icons[type as keyof typeof icons] || icons.info;
  };

  const getNotificationColor = (type: string) => {
    const colors = {
      success: 'border-green-200 bg-green-50',
      warning: 'border-yellow-200 bg-yellow-50',
      error: 'border-red-200 bg-red-50',
      info: 'border-blue-200 bg-blue-50',
    };
    return colors[type as keyof typeof colors] || colors.info;
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      deposit: <TrendingUp size={16} className="text-green-600" />,
      withdrawal: <DollarSign size={16} className="text-red-600" />,
      bet: <Award size={16} className="text-purple-600" />,
      result: <CheckCircle size={16} className="text-blue-600" />,
      risk: <AlertCircle size={16} className="text-orange-600" />,
      system: <Users size={16} className="text-gray-600" />,
    };
    return icons[category as keyof typeof icons] || icons.system;
  };

  const stats = {
    total: notifications.length,
    unread: notifications.filter(n => !n.read).length,
    risk: notifications.filter(n => n.category === 'risk' && !n.read).length,
    pending: notifications.filter(n => (n.category === 'deposit' || n.category === 'withdrawal') && !n.read).length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🔔 ระบบแจ้งเตือน</h1>
            <p className="text-gray-600 mt-1">แจ้งเตือนและกิจกรรมสำคัญ</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-3 rounded-lg transition-colors ${
                soundEnabled ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}
              title={soundEnabled ? 'ปิดเสียง' : 'เปิดเสียง'}
            >
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              title="ตั้งค่า"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Bell size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">ทั้งหมด</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <AlertCircle size={24} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">ยังไม่อ่าน</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.unread}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle size={24} className="text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">ความเสี่ยง</p>
                <p className="text-2xl font-bold text-red-600">{stats.risk}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">รอดำเนินการ</p>
                <p className="text-2xl font-bold text-green-600">{stats.pending}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                  filter === 'all' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                ทั้งหมด ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                  filter === 'unread' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                ยังไม่อ่าน ({stats.unread})
              </button>
              <button
                onClick={() => setFilter('risk')}
                className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                  filter === 'risk' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                ความเสี่ยง
              </button>
              <button
                onClick={() => setFilter('deposit')}
                className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                  filter === 'deposit' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                ฝาก
              </button>
              <button
                onClick={() => setFilter('withdrawal')}
                className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                  filter === 'withdrawal' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                ถอน
              </button>
            </div>
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
            >
              ทำเครื่องหมายอ่านทั้งหมด
            </button>
          </div>

          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg font-bold">ไม่มีการแจ้งเตือน</p>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    notif.read ? 'bg-white border-gray-200' : getNotificationColor(notif.type)
                  } ${!notif.read ? 'shadow-md' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-900">{notif.title}</h4>
                          {!notif.read && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(notif.category)}
                          <button
                            onClick={() => handleDelete(notif.id)}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                            title="ลบ"
                          >
                            <X size={16} className="text-gray-500" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{notif.message}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                          {notif.timestamp.toLocaleTimeString('th-TH')} • {notif.timestamp.toLocaleDateString('th-TH')}
                        </p>
                        {!notif.read && (
                          <button
                            onClick={() => handleMarkAsRead(notif.id)}
                            className="text-xs text-blue-600 hover:text-blue-700 font-bold"
                          >
                            ทำเครื่องหมายว่าอ่านแล้ว
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {showSettings && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Settings size={20} className="text-purple-600" />
              ตั้งค่าการแจ้งเตือน
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-bold text-gray-900">Auto Refresh</p>
                  <p className="text-sm text-gray-600">อัปเดตอัตโนมัติทุก 5 วินาที</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-bold text-gray-900">เสียงแจ้งเตือน</p>
                  <p className="text-sm text-gray-600">เปิดเสียงเมื่อมีการแจ้งเตือนใหม่</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={soundEnabled}
                    onChange={(e) => setSoundEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-bold text-gray-900">แจ้งเตือนความเสี่ยง</p>
                  <p className="text-sm text-gray-600">แจ้งเตือนเมื่อมีความเสี่ยงสูง</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-bold text-gray-900">แจ้งเตือนฝาก-ถอน</p>
                  <p className="text-sm text-gray-600">แจ้งเตือนเมื่อมีรายการฝาก-ถอนใหม่</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
