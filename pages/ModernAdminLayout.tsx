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
  Menu,
  X,
  ChevronDown,
  LogOut,
  Search,
  Sun,
  Moon
} from 'lucide-react';

interface ModernAdminLayoutProps {
  children?: React.ReactNode;
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

export default function ModernAdminLayout({ children, onNavigate, onLogout }: ModernAdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
      page: 'admin-dashboard-v2',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'members',
      label: 'สมาชิก',
      icon: <Users size={20} />,
      page: 'member-management',
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'bets',
      label: 'โพย',
      icon: <FileText size={20} />,
      page: 'bet-management',
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 'finance',
      label: 'ฝาก-ถอน',
      icon: <Wallet size={20} />,
      page: 'deposit-withdrawal',
      color: 'from-yellow-500 to-orange-600'
    },
    {
      id: 'results',
      label: 'ประกาศผล',
      icon: <Trophy size={20} />,
      page: 'result-announcement',
      color: 'from-red-500 to-rose-600'
    },
    {
      id: 'risk',
      label: 'Risk Management',
      icon: <AlertTriangle size={20} />,
      page: 'realtime-risk',
      color: 'from-orange-500 to-amber-600'
    },
    {
      id: 'reports',
      label: 'รายงาน',
      icon: <BarChart3 size={20} />,
      page: 'reports-analytics',
      color: 'from-indigo-500 to-purple-600'
    },
    {
      id: 'notifications',
      label: 'แจ้งเตือน',
      icon: <Bell size={20} />,
      page: 'notification-system',
      color: 'from-pink-500 to-rose-600'
    },
    {
      id: 'settings',
      label: 'ตั้งค่า',
      icon: <Settings size={20} />,
      page: 'integration-settings',
      color: 'from-gray-500 to-slate-600'
    },
  ];

  const handleMenuClick = (item: typeof menuItems[0]) => {
    setActiveMenu(item.id);
    onNavigate?.(item.page);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${darkMode ? 'bg-gray-800' : 'bg-white'} border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'} w-64`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900 dark:text-white">บ้านหวย</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-8rem)]">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeMenu === item.id
                  ? `bg-gradient-to-r ${item.color} text-white shadow-lg scale-105`
                  : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
              }`}
            >
              {item.icon}
              <span className="font-semibold">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
          >
            <LogOut size={20} />
            <span className="font-semibold">ออกจากระบบ</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`${sidebarOpen ? 'ml-64' : 'ml-0'} transition-all`}>
        {/* Top Bar */}
        <header className={`h-16 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-30`}>
          <div className="h-full px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
              >
                {sidebarOpen ? <X size={24} className={darkMode ? 'text-white' : 'text-gray-700'} /> : <Menu size={24} className={darkMode ? 'text-white' : 'text-gray-700'} />}
              </button>
              
              {/* Search */}
              <div className="relative hidden md:block">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="ค้นหา..."
                  className={`pl-10 pr-4 py-2 rounded-lg ${
                    darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-200'
                  } border focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64`}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-700'} transition-colors`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Notifications */}
              <button className={`relative p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}>
                <Bell size={20} className={darkMode ? 'text-white' : 'text-gray-700'} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="flex items-center gap-3">
                <div className="hidden md:block text-right">
                  <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Admin</p>
                  <p className="text-xs text-gray-500">Super Admin</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold">A</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children || (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Stats Cards */}
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Users size={24} />
                  </div>
                  <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">+12%</span>
                </div>
                <h3 className="text-sm font-medium opacity-90">สมาชิกทั้งหมด</h3>
                <p className="text-3xl font-bold mt-2">1,234</p>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Wallet size={24} />
                  </div>
                  <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">+8%</span>
                </div>
                <h3 className="text-sm font-medium opacity-90">ยอดฝากวันนี้</h3>
                <p className="text-3xl font-bold mt-2">฿154,200</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <FileText size={24} />
                  </div>
                  <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">+15%</span>
                </div>
                <h3 className="text-sm font-medium opacity-90">โพยวันนี้</h3>
                <p className="text-3xl font-bold mt-2">8,567</p>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <BarChart3 size={24} />
                  </div>
                  <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">+25%</span>
                </div>
                <h3 className="text-sm font-medium opacity-90">กำไรสุทธิ</h3>
                <p className="text-3xl font-bold mt-2">฿89,400</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
