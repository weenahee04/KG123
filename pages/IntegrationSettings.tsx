import React, { useState } from 'react';
import { 
  MessageCircle, 
  Mail, 
  Smartphone,
  Save,
  CheckCircle,
  AlertCircle,
  Send,
  Settings,
  Key,
  Bell,
  Globe,
  Zap
} from 'lucide-react';

export default function IntegrationSettings() {
  const [lineToken, setLineToken] = useState('');
  const [lineEnabled, setLineEnabled] = useState(false);
  const [smsApiKey, setSmsApiKey] = useState('');
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [emailHost, setEmailHost] = useState('smtp.gmail.com');
  const [emailPort, setEmailPort] = useState('587');
  const [emailUser, setEmailUser] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [testMessage, setTestMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSaveLineSettings = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleSaveSmsSettings = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleSaveEmailSettings = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleTestLine = () => {
    alert('ส่งข้อความทดสอบไปยัง Line Notify แล้ว!');
  };

  const handleTestSms = () => {
    alert('ส่ง SMS ทดสอบแล้ว!');
  };

  const handleTestEmail = () => {
    alert('ส่งอีเมลทดสอบแล้ว!');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🔗 การเชื่อมต่อและการแจ้งเตือน</h1>
            <p className="text-gray-600 mt-1">ตั้งค่าการเชื่อมต่อกับบริการภายนอก</p>
          </div>
        </div>

        {showSuccess && (
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 flex items-center gap-3 animate-fade-in">
            <CheckCircle size={24} className="text-green-600" />
            <p className="text-green-700 font-bold">บันทึกการตั้งค่าเรียบร้อยแล้ว!</p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-green-100 rounded-lg">
              <MessageCircle size={24} className="text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Line Notify Integration</h2>
              <p className="text-sm text-gray-600">แจ้งเตือนผ่าน Line Notify</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-bold text-gray-900">เปิดใช้งาน Line Notify</p>
                <p className="text-sm text-gray-600">รับการแจ้งเตือนผ่าน Line</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={lineEnabled}
                  onChange={(e) => setLineEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Line Notify Token
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Key size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={lineToken}
                    onChange={(e) => setLineToken(e.target.value)}
                    placeholder="ใส่ Line Notify Token"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <a
                  href="https://notify-bot.line.me/my/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors whitespace-nowrap"
                >
                  รับ Token
                </a>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                ไปที่ <a href="https://notify-bot.line.me/my/" target="_blank" className="text-green-600 hover:underline">Line Notify</a> เพื่อสร้าง Token
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-bold text-gray-900 mb-2">การแจ้งเตือนที่จะส่ง:</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-sm text-gray-700">รายการฝาก-ถอนใหม่</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-sm text-gray-700">ความเสี่ยงสูง (เกิน 85%)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-sm text-gray-700">ประกาศผลรางวัล</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm text-gray-700">สมาชิกใหม่</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm text-gray-700">รายงานประจำวัน (08:00 AM)</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSaveLineSettings}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition-colors"
              >
                <Save size={20} />
                บันทึกการตั้งค่า
              </button>
              <button
                onClick={handleTestLine}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Send size={20} />
                ทดสอบ
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Smartphone size={24} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">SMS Alert System</h2>
              <p className="text-sm text-gray-600">แจ้งเตือนผ่าน SMS</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-bold text-gray-900">เปิดใช้งาน SMS Alert</p>
                <p className="text-sm text-gray-600">รับการแจ้งเตือนผ่าน SMS</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={smsEnabled}
                  onChange={(e) => setSmsEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  SMS Provider
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option>Twilio</option>
                  <option>AWS SNS</option>
                  <option>ThaiSMS</option>
                  <option>SMSGateway</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  API Key
                </label>
                <input
                  type="password"
                  value={smsApiKey}
                  onChange={(e) => setSmsApiKey(e.target.value)}
                  placeholder="ใส่ API Key"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                เบอร์โทรศัพท์ผู้รับ
              </label>
              <input
                type="tel"
                placeholder="0812345678"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                ใส่เบอร์โทรศัพท์ที่ต้องการรับการแจ้งเตือน (คั่นด้วยเครื่องหมายจุลภาค)
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-bold text-gray-900 mb-2">การแจ้งเตือนที่จะส่ง:</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-sm text-gray-700">ความเสี่ยงวิกฤต (เกิน 95%)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-sm text-gray-700">รายการถอนเงินมูลค่าสูง (&gt; 50,000)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm text-gray-700">ระบบล่ม/ขัดข้อง</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSaveSmsSettings}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition-colors"
              >
                <Save size={20} />
                บันทึกการตั้งค่า
              </button>
              <button
                onClick={handleTestSms}
                className="px-6 py-3 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition-colors flex items-center gap-2"
              >
                <Send size={20} />
                ทดสอบ
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Mail size={24} className="text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Email Reports</h2>
              <p className="text-sm text-gray-600">ส่งรายงานผ่านอีเมล</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-bold text-gray-900">เปิดใช้งาน Email Reports</p>
                <p className="text-sm text-gray-600">ส่งรายงานอัตโนมัติทางอีเมล</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailEnabled}
                  onChange={(e) => setEmailEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  SMTP Host
                </label>
                <input
                  type="text"
                  value={emailHost}
                  onChange={(e) => setEmailHost(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  SMTP Port
                </label>
                <input
                  type="text"
                  value={emailPort}
                  onChange={(e) => setEmailPort(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Email / Username
                </label>
                <input
                  type="email"
                  value={emailUser}
                  onChange={(e) => setEmailUser(e.target.value)}
                  placeholder="your-email@gmail.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Password / App Password
                </label>
                <input
                  type="password"
                  value={emailPassword}
                  onChange={(e) => setEmailPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                อีเมลผู้รับ
              </label>
              <input
                type="email"
                placeholder="admin@example.com, manager@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                ใส่อีเมลที่ต้องการรับรายงาน (คั่นด้วยเครื่องหมายจุลภาค)
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-bold text-gray-900 mb-2">ตารางส่งรายงาน:</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-sm text-gray-700">รายงานประจำวัน (08:00 AM)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-sm text-gray-700">รายงานประจำสัปดาห์ (จันทร์ 09:00 AM)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm text-gray-700">รายงานประจำเดือน (วันที่ 1 เวลา 10:00 AM)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm text-gray-700">แจ้งเตือนเมื่อมีรายการผิดปกติ</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSaveEmailSettings}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-purple-500 text-white rounded-lg font-bold hover:bg-purple-600 transition-colors"
              >
                <Save size={20} />
                บันทึกการตั้งค่า
              </button>
              <button
                onClick={handleTestEmail}
                className="px-6 py-3 bg-pink-500 text-white rounded-lg font-bold hover:bg-pink-600 transition-colors flex items-center gap-2"
              >
                <Send size={20} />
                ทดสอบ
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-white">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-500 rounded-lg">
                <MessageCircle size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Line Notify</p>
                <p className="text-2xl font-bold text-blue-600">
                  {lineEnabled ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-white">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-500 rounded-lg">
                <Smartphone size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">SMS Alert</p>
                <p className="text-2xl font-bold text-blue-600">
                  {smsEnabled ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-white">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-500 rounded-lg">
                <Mail size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Email Reports</p>
                <p className="text-2xl font-bold text-blue-600">
                  {emailEnabled ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
