import React, { useState } from 'react';
import { 
  LayoutDashboard,
  Users,
  FileText,
  Wallet,
  Trophy,
  AlertTriangle,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  User,
  Grid3x3,
  Shield
} from 'lucide-react';

interface CleanAdminLayoutProps {
  children?: React.ReactNode;
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

export default function CleanAdminLayout({ children, onNavigate, onLogout }: CleanAdminLayoutProps) {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={18} />,
      page: 'enhanced-admin-dashboard'
    },
    {
      id: 'lottery-rounds',
      label: 'งวดหวย',
      icon: <FileText size={18} />,
      page: 'lottery-operations'
    },
    {
      id: 'members',
      label: 'สมาชิก',
      icon: <Users size={18} />,
      page: 'member-management'
    },
    {
      id: 'agents',
      label: 'ตัวแทน',
      icon: <Users size={18} />,
      page: 'agent-management'
    },
    {
      id: 'bets',
      label: 'โพย',
      icon: <FileText size={18} />,
      page: 'bet-management'
    },
    {
      id: 'number-grid',
      label: 'ตารางเลข',
      icon: <Grid3x3 size={18} />,
      page: 'lottery-number-grid'
    },
    {
      id: 'finance',
      label: 'ฝาก-ถอน',
      icon: <Wallet size={18} />,
      page: 'deposit-withdrawal'
    },
    {
      id: 'banks',
      label: 'บัญชีธนาคาร',
      icon: <Wallet size={18} />,
      page: 'bank-accounts'
    },
    {
      id: 'results',
      label: 'ประกาศผล',
      icon: <Trophy size={18} />,
      page: 'result-announcement'
    },
    {
      id: 'risk',
      label: 'Risk',
      icon: <Shield size={18} />,
      page: 'enhanced-risk-management'
    },
    {
      id: 'fraud',
      label: 'ตรวจจับโกง',
      icon: <AlertTriangle size={18} />,
      page: 'fraud-detection'
    },
    {
      id: 'reports',
      label: 'รายงาน',
      icon: <BarChart3 size={18} />,
      page: 'reports-analytics'
    },
    {
      id: 'lottery-settings',
      label: 'ตั้งค่าหวย',
      icon: <Settings size={18} />,
      page: 'lottery-settings'
    },
    {
      id: 'admins',
      label: 'จัดการแอดมิน',
      icon: <User size={18} />,
      page: 'admin-roles'
    },
    {
      id: 'settings',
      label: 'ตั้งค่าระบบ',
      icon: <Settings size={18} />,
      page: 'system-settings'
    },
  ];

  const handleMenuClick = (item: typeof menuItems[0]) => {
    setActiveMenu(item.id);
    onNavigate?.(item.page);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-full px-3 md:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg md:text-xl">B</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-base md:text-lg text-gray-900">บ้านหวย</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>

            {/* Menu Items - Compact */}
            <div className="hidden lg:flex items-center gap-0.5 flex-1 justify-center overflow-x-auto px-2">
              {menuItems.slice(0, 8).map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item)}
                  className={`flex items-center gap-1 px-2 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                    activeMenu === item.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-blue-50'
                  }`}
                >
                  <span className="text-[10px]">{item.icon}</span>
                  <span className="text-xs">{item.label}</span>
                </button>
              ))}
              {/* More Menu Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg font-medium text-gray-700 hover:bg-blue-50 transition-all"
                >
                  <Settings size={14} />
                  <span className="text-xs">เพิ่วเติม</span>
                  <ChevronDown size={12} />
                </button>
                {showMoreMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {menuItems.slice(8).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          handleMenuClick(item);
                          setShowMoreMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-bold text-gray-900">Admin</p>
                    <p className="text-xs text-gray-500">Super Admin</p>
                  </div>
                  <ChevronDown size={16} className="text-gray-500" />
                </button>

                {/* Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <button
                      onClick={onLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} />
                      <span>ออกจากระบบ</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Menu - Horizontal Scroll */}
          <div className="lg:hidden pb-3 pt-2 border-t border-gray-200 mt-2 -mx-3 md:-mx-6">
            <div className="overflow-x-auto px-3 md:px-6">
              <div className="flex gap-2 min-w-max">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleMenuClick(item)}
                    className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                      activeMenu === item.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-blue-50'
                    }`}
                  >
                    {item.icon}
                    <span className="text-xs">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-full px-3 md:px-6 py-4 md:py-6">
        {children ? children : (
          <div>
            {/* Page Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
              <p className="text-gray-600 mt-1">ภาพรวมระบบทั้งหมด</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Users size={24} className="text-blue-600" />
                  </div>
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">+12%</span>
                </div>
                <h3 className="text-sm font-medium text-gray-600">สมาชิกทั้งหมด</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">1,234</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Wallet size={24} className="text-blue-600" />
                  </div>
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">+8%</span>
                </div>
                <h3 className="text-sm font-medium text-gray-600">ยอดฝากวันนี้</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">฿154,200</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <FileText size={24} className="text-blue-600" />
                  </div>
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">+15%</span>
                </div>
                <h3 className="text-sm font-medium text-gray-600">โพยวันนี้</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">8,567</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <BarChart3 size={24} className="text-blue-600" />
                  </div>
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">+25%</span>
                </div>
                <h3 className="text-sm font-medium text-gray-600">กำไรสุทธิ</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">฿89,400</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">เมนูด่วน</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {menuItems.slice(0, 5).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleMenuClick(item)}
                    className="flex flex-col items-center gap-3 p-4 rounded-lg border-2 border-gray-200 hover:border-blue-600 hover:bg-blue-50 transition-all group"
                  >
                    <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-blue-600 transition-colors">
                      <div className="text-gray-600 group-hover:text-white">
                        {React.cloneElement(item.icon, { size: 24 })}
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">กิจกรรมล่าสุด</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {[
                  { user: 'user001', action: 'ฝากเงิน', amount: '฿5,000', time: '5 นาทีที่แล้ว', status: 'success' },
                  { user: 'user002', action: 'ถอนเงิน', amount: '฿2,500', time: '10 นาทีที่แล้ว', status: 'pending' },
                  { user: 'user003', action: 'แทงหวย', amount: '฿1,200', time: '15 นาทีที่แล้ว', status: 'success' },
                  { user: 'user004', action: 'ฝากเงิน', amount: '฿10,000', time: '20 นาทีที่แล้ว', status: 'success' },
                ].map((activity, idx) => (
                  <div key={idx} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{activity.user}</p>
                          <p className="text-sm text-gray-500">{activity.action}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{activity.amount}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                      <div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          activity.status === 'success' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {activity.status === 'success' ? 'สำเร็จ' : 'รอดำเนินการ'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
