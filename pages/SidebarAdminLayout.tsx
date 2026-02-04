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
  Shield,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  UserPlus
} from 'lucide-react';

interface SidebarAdminLayoutProps {
  children?: React.ReactNode;
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

export default function SidebarAdminLayout({ children, onNavigate, onLogout }: SidebarAdminLayoutProps) {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
      page: 'enhanced-admin-dashboard'
    },
    {
      id: 'lottery-rounds',
      label: 'งวดหวย',
      icon: <FileText size={20} />,
      page: 'lottery-operations'
    },
    {
      id: 'members',
      label: 'สมาชิก',
      icon: <Users size={20} />,
      page: 'member-management'
    },
    {
      id: 'agents',
      label: 'ตัวแทน',
      icon: <Users size={20} />,
      page: 'agent-management'
    },
    {
      id: 'affiliate',
      label: 'Affiliate (8%)',
      icon: <UserPlus size={20} />,
      page: 'affiliate-management'
    },
    {
      id: 'bets',
      label: 'โพย',
      icon: <FileText size={20} />,
      page: 'bet-management'
    },
    {
      id: 'number-grid',
      label: 'ตารางเลข',
      icon: <Grid3x3 size={20} />,
      page: 'lottery-number-grid'
    },
    {
      id: 'finance',
      label: 'ฝาก-ถอน',
      icon: <Wallet size={20} />,
      page: 'deposit-withdrawal'
    },
    {
      id: 'banks',
      label: 'บัญชีธนาคาร',
      icon: <Wallet size={20} />,
      page: 'bank-accounts'
    },
    {
      id: 'results',
      label: 'ประกาศผล',
      icon: <Trophy size={20} />,
      page: 'result-announcement'
    },
    {
      id: 'risk',
      label: 'Risk',
      icon: <Shield size={20} />,
      page: 'enhanced-risk-management'
    },
    {
      id: 'fraud',
      label: 'ตรวจจับโกง',
      icon: <AlertTriangle size={20} />,
      page: 'fraud-detection'
    },
    {
      id: 'reports',
      label: 'รายงาน',
      icon: <BarChart3 size={20} />,
      page: 'reports-analytics'
    },
    {
      id: 'lottery-settings',
      label: 'ตั้งค่าหวย',
      icon: <Settings size={20} />,
      page: 'lottery-settings'
    },
    {
      id: 'admins',
      label: 'จัดการแอดมิน',
      icon: <User size={20} />,
      page: 'admin-roles'
    },
    {
      id: 'settings',
      label: 'ตั้งค่าระบบ',
      icon: <Settings size={20} />,
      page: 'system-settings'
    },
  ];

  const handleMenuClick = (item: typeof menuItems[0]) => {
    setActiveMenu(item.id);
    onNavigate?.(item.page);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-lg transition-all duration-300 z-40 ${
        sidebarOpen ? 'w-64' : 'w-20'
      } hidden lg:block`}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <div>
                <h1 className="font-bold text-lg text-gray-900">บ้านหวย</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md mx-auto">
              <span className="text-white font-bold text-xl">B</span>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-20 bg-blue-600 text-white p-1.5 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>

        {/* Menu Items */}
        <nav className="p-3 overflow-y-auto h-[calc(100vh-4rem)]">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-all ${
                  activeMenu === item.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-blue-50'
                }`}
                title={!sidebarOpen ? item.label : ''}
              >
                <span className={sidebarOpen ? '' : 'mx-auto'}>{item.icon}</span>
                {sidebarOpen && <span className="text-sm">{item.label}</span>}
              </button>
            ))}
          </div>
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      {mobileSidebarOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          ></div>
          <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-lg z-50 lg:hidden">
            {/* Logo */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-xl">B</span>
                </div>
                <div>
                  <h1 className="font-bold text-lg text-gray-900">บ้านหวย</h1>
                  <p className="text-xs text-gray-500">Admin Panel</p>
                </div>
              </div>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            {/* Menu Items */}
            <nav className="p-3 overflow-y-auto h-[calc(100vh-4rem)]">
              <div className="space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleMenuClick(item)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-all ${
                      activeMenu === item.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-blue-50'
                    }`}
                  >
                    {item.icon}
                    <span className="text-sm">{item.label}</span>
                  </button>
                ))}
              </div>
            </nav>
          </aside>
        </>
      )}

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
      }`}>
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
          <div className="h-full px-4 md:px-6 flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={24} />
            </button>

            {/* Spacer for desktop */}
            <div className="hidden lg:block"></div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
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
                  <ChevronDown size={16} className="text-gray-500 hidden md:block" />
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
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
