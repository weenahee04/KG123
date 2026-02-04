import React, { useState } from 'react';
import { 
  Settings, 
  Save,
  Image,
  Palette,
  Bell,
  Shield,
  DollarSign,
  Mail,
  Globe
} from 'lucide-react';

export default function SystemSettings() {
  const [activeTab, setActiveTab] = useState<'general' | 'appearance' | 'notifications' | 'security' | 'payment'>('general');

  // General settings
  const [siteName, setSiteName] = useState('หวยออนไลน์');
  const [siteDescription, setSiteDescription] = useState('ระบบหวยออนไลน์ที่ดีที่สุด');
  const [contactEmail, setContactEmail] = useState('contact@lottery.com');
  const [contactPhone, setContactPhone] = useState('02-123-4567');
  const [lineId, setLineId] = useState('@lottery');

  // Appearance settings
  const [primaryColor, setPrimaryColor] = useState('#2563eb');
  const [logoUrl, setLogoUrl] = useState('');
  const [faviconUrl, setFaviconUrl] = useState('');

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [lineNotifications, setLineNotifications] = useState(true);
  const [notifyOnDeposit, setNotifyOnDeposit] = useState(true);
  const [notifyOnWithdraw, setNotifyOnWithdraw] = useState(true);
  const [notifyOnBigWin, setNotifyOnBigWin] = useState(true);

  // Security settings
  const [requireEmailVerify, setRequireEmailVerify] = useState(true);
  const [requirePhoneVerify, setRequirePhoneVerify] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [ipWhitelist, setIpWhitelist] = useState('');
  const [sessionTimeout, setSessionTimeout] = useState(30);

  // Payment settings
  const [autoApproveDeposit, setAutoApproveDeposit] = useState(true);
  const [autoApproveWithdraw, setAutoApproveWithdraw] = useState(false);
  const [minDeposit, setMinDeposit] = useState(100);
  const [maxDeposit, setMaxDeposit] = useState(100000);
  const [minWithdraw, setMinWithdraw] = useState(100);
  const [maxWithdraw, setMaxWithdraw] = useState(100000);

  const handleSave = () => {
    alert('บันทึกการตั้งค่าเรียบร้อย!');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">⚙️ ตั้งค่าระบบ</h1>
            <p className="text-gray-600 mt-1">จัดการการตั้งค่าทั่วไปของระบบ</p>
          </div>
          <button 
            onClick={handleSave}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold hover:bg-blue-700 transition-all"
          >
            <Save size={20} />
            บันทึกทั้งหมด
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200 overflow-x-auto md:overflow-x-auto">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-4 md:px-6 py-2 md:py-3 font-bold transition-colors whitespace-nowrap ${
              activeTab === 'general'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Settings size={20} />
              ทั่วไป
            </div>
          </button>
          <button
            onClick={() => setActiveTab('appearance')}
            className={`px-6 py-3 font-bold transition-colors whitespace-nowrap ${
              activeTab === 'appearance'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Palette size={20} />
              รูปลักษณ์
            </div>
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-6 py-3 font-bold transition-colors whitespace-nowrap ${
              activeTab === 'notifications'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Bell size={20} />
              การแจ้งเตือน
            </div>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-6 py-3 font-bold transition-colors whitespace-nowrap ${
              activeTab === 'security'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Shield size={20} />
              ความปลอดภัย
            </div>
          </button>
          <button
            onClick={() => setActiveTab('payment')}
            className={`px-6 py-3 font-bold transition-colors whitespace-nowrap ${
              activeTab === 'payment'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <DollarSign size={20} />
              การชำระเงิน
            </div>
          </button>
        </div>

        {/* General Tab */}
        {activeTab === 'general' && (
          <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-4 md:p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">ตั้งค่าทั่วไป</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">ชื่อเว็บไซต์</label>
                  <input
                    type="text"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">คำอธิบาย</label>
                  <input
                    type="text"
                    value={siteDescription}
                    onChange={(e) => setSiteDescription(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">อีเมลติดต่อ</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">เบอร์โทรติดต่อ</label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">LINE ID</label>
                  <input
                    type="text"
                    value={lineId}
                    onChange={(e) => setLineId(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Appearance Tab */}
        {activeTab === 'appearance' && (
          <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-4 md:p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">รูปลักษณ์</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">สีหลัก</label>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-20 h-12 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">URL โลโก้</label>
                <input
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">URL Favicon</label>
                <input
                  type="text"
                  value={faviconUrl}
                  onChange={(e) => setFaviconUrl(e.target.value)}
                  placeholder="https://example.com/favicon.ico"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-4 md:p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">การแจ้งเตือน</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-gray-900 mb-4">ช่องทางการแจ้งเตือน</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">แจ้งเตือนทางอีเมล</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={smsNotifications}
                      onChange={(e) => setSmsNotifications(e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">แจ้งเตือนทาง SMS</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={lineNotifications}
                      onChange={(e) => setLineNotifications(e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">แจ้งเตือนทาง LINE</span>
                  </label>
                </div>
              </div>
              <div className="pt-6 border-t border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">เหตุการณ์ที่แจ้งเตือน</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifyOnDeposit}
                      onChange={(e) => setNotifyOnDeposit(e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">มีรายการฝากเงินใหม่</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifyOnWithdraw}
                      onChange={(e) => setNotifyOnWithdraw(e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">มีรายการถอนเงินใหม่</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifyOnBigWin}
                      onChange={(e) => setNotifyOnBigWin(e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">มีผู้ชนะรางวัลใหญ่ (&gt;100,000 บาท)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-4 md:p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">ความปลอดภัย</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-gray-900 mb-4">การยืนยันตัวตน</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={requireEmailVerify}
                      onChange={(e) => setRequireEmailVerify(e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">บังคับยืนยันอีเมล</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={requirePhoneVerify}
                      onChange={(e) => setRequirePhoneVerify(e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">บังคับยืนยันเบอร์โทร</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={twoFactorAuth}
                      onChange={(e) => setTwoFactorAuth(e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">เปิดใช้ Two-Factor Authentication</span>
                  </label>
                </div>
              </div>
              <div className="pt-6 border-t border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">การควบคุมการเข้าถึง</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">IP Whitelist (แยกด้วย comma)</label>
                    <textarea
                      value={ipWhitelist}
                      onChange={(e) => setIpWhitelist(e.target.value)}
                      placeholder="192.168.1.1, 192.168.1.2"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Session Timeout (นาที)</label>
                    <input
                      type="number"
                      value={sessionTimeout}
                      onChange={(e) => setSessionTimeout(parseInt(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Tab */}
        {activeTab === 'payment' && (
          <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-4 md:p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">การชำระเงิน</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-gray-900 mb-4">การอนุมัติอัตโนมัติ</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoApproveDeposit}
                      onChange={(e) => setAutoApproveDeposit(e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">อนุมัติฝากเงินอัตโนมัติ</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoApproveWithdraw}
                      onChange={(e) => setAutoApproveWithdraw(e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">อนุมัติถอนเงินอัตโนมัติ</span>
                  </label>
                </div>
              </div>
              <div className="pt-6 border-t border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">ขีดจำกัดการทำรายการ</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">ฝากขั้นต่ำ (บาท)</label>
                    <input
                      type="number"
                      value={minDeposit}
                      onChange={(e) => setMinDeposit(parseInt(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">ฝากสูงสุด (บาท)</label>
                    <input
                      type="number"
                      value={maxDeposit}
                      onChange={(e) => setMaxDeposit(parseInt(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">ถอนขั้นต่ำ (บาท)</label>
                    <input
                      type="number"
                      value={minWithdraw}
                      onChange={(e) => setMinWithdraw(parseInt(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">ถอนสูงสุด (บาท)</label>
                    <input
                      type="number"
                      value={maxWithdraw}
                      onChange={(e) => setMaxWithdraw(parseInt(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
