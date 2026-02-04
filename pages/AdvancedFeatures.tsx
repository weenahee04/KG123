import React, { useState } from 'react';
import { 
  Zap, 
  Shield, 
  TrendingUp,
  Users,
  Settings,
  Lock,
  Eye,
  Clock,
  Target,
  BarChart3,
  Smartphone,
  Globe,
  Database,
  Code
} from 'lucide-react';

export default function AdvancedFeatures() {
  const [activeTab, setActiveTab] = useState('automation');

  const features = {
    automation: [
      {
        icon: <Zap size={24} className="text-yellow-500" />,
        title: 'Auto Payout',
        description: 'จ่ายเงินรางวัลอัตโนมัติทันทีหลังประกาศผล',
        status: 'active',
        color: 'yellow',
      },
      {
        icon: <Clock size={24} className="text-blue-500" />,
        title: 'Scheduled Reports',
        description: 'ส่งรายงานอัตโนมัติทุกวัน/สัปดาห์/เดือน',
        status: 'active',
        color: 'blue',
      },
      {
        icon: <Shield size={24} className="text-green-500" />,
        title: 'Auto Risk Control',
        description: 'ปรับอัตราจ่ายอัตโนมัติตามความเสี่ยง',
        status: 'active',
        color: 'green',
      },
      {
        icon: <Target size={24} className="text-purple-500" />,
        title: 'Smart Limit Adjustment',
        description: 'ปรับลิมิตอัตโนมัติตามทุนหมุนเวียน',
        status: 'active',
        color: 'purple',
      },
    ],
    security: [
      {
        icon: <Lock size={24} className="text-red-500" />,
        title: 'Two-Factor Authentication',
        description: 'ยืนยันตัวตน 2 ขั้นตอนสำหรับแอดมิน',
        status: 'active',
        color: 'red',
      },
      {
        icon: <Eye size={24} className="text-indigo-500" />,
        title: 'Activity Logging',
        description: 'บันทึกการทำงานทุกครั้งของแอดมิน',
        status: 'active',
        color: 'indigo',
      },
      {
        icon: <Shield size={24} className="text-green-500" />,
        title: 'IP Whitelist',
        description: 'จำกัดการเข้าถึงจาก IP ที่กำหนด',
        status: 'inactive',
        color: 'green',
      },
      {
        icon: <Database size={24} className="text-blue-500" />,
        title: 'Auto Backup',
        description: 'สำรองข้อมูลอัตโนมัติทุกวัน',
        status: 'active',
        color: 'blue',
      },
    ],
    analytics: [
      {
        icon: <BarChart3 size={24} className="text-purple-500" />,
        title: 'Advanced Analytics',
        description: 'วิเคราะห์ข้อมูลเชิงลึกด้วย AI',
        status: 'active',
        color: 'purple',
      },
      {
        icon: <TrendingUp size={24} className="text-green-500" />,
        title: 'Predictive Analysis',
        description: 'ทำนายแนวโน้มยอดขายและกำไร',
        status: 'active',
        color: 'green',
      },
      {
        icon: <Users size={24} className="text-blue-500" />,
        title: 'Customer Behavior',
        description: 'วิเคราะห์พฤติกรรมการเล่นของสมาชิก',
        status: 'active',
        color: 'blue',
      },
      {
        icon: <Target size={24} className="text-orange-500" />,
        title: 'Hot Numbers Detection',
        description: 'ตรวจจับเลขยอดนิยมแบบ Real-time',
        status: 'active',
        color: 'orange',
      },
    ],
    integration: [
      {
        icon: <Smartphone size={24} className="text-pink-500" />,
        title: 'Mobile App API',
        description: 'API สำหรับแอพมือถือ iOS/Android',
        status: 'inactive',
        color: 'pink',
      },
      {
        icon: <Globe size={24} className="text-blue-500" />,
        title: 'Third-party Integration',
        description: 'เชื่อมต่อกับระบบภายนอก',
        status: 'inactive',
        color: 'blue',
      },
      {
        icon: <Code size={24} className="text-purple-500" />,
        title: 'Webhook Support',
        description: 'รับ/ส่งข้อมูลผ่าน Webhook',
        status: 'active',
        color: 'purple',
      },
      {
        icon: <Database size={24} className="text-green-500" />,
        title: 'Data Export API',
        description: 'ส่งออกข้อมูลผ่าน REST API',
        status: 'active',
        color: 'green',
      },
    ],
  };

  const currentFeatures = features[activeTab as keyof typeof features] || features.automation;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">⚡ Advanced Features</h1>
            <p className="text-gray-600 mt-1">ฟีเจอร์ขั้นสูงและการตั้งค่าระบบ</p>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('automation')}
            className={`px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap ${
              activeTab === 'automation'
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <Zap size={20} />
              Automation
            </div>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap ${
              activeTab === 'security'
                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <Shield size={20} />
              Security
            </div>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <BarChart3 size={20} />
              Analytics
            </div>
          </button>
          <button
            onClick={() => setActiveTab('integration')}
            className={`px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap ${
              activeTab === 'integration'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <Globe size={20} />
              Integration
            </div>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentFeatures.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200 hover:border-purple-300 transition-all hover:shadow-xl"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-4 bg-${feature.color}-100 rounded-lg`}>
                  {feature.icon}
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    feature.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {feature.status === 'active' ? '✓ Active' : '○ Inactive'}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <button
                className={`w-full py-2 rounded-lg font-bold transition-colors ${
                  feature.status === 'active'
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'bg-purple-500 text-white hover:bg-purple-600'
                }`}
              >
                {feature.status === 'active' ? 'ตั้งค่า' : 'เปิดใช้งาน'}
              </button>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg p-8 text-white">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-white/20 rounded-lg">
              <Settings size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">System Configuration</h2>
              <p className="text-purple-100">ตั้งค่าระบบขั้นสูง</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-sm text-purple-100 mb-1">API Version</p>
              <p className="text-2xl font-bold">v2.5.0</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-sm text-purple-100 mb-1">Database Status</p>
              <p className="text-2xl font-bold">✓ Connected</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-sm text-purple-100 mb-1">Uptime</p>
              <p className="text-2xl font-bold">99.9%</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock size={20} className="text-blue-600" />
              Scheduled Tasks
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-bold text-gray-900">Daily Report</p>
                  <p className="text-xs text-gray-600">ส่งรายงานประจำวัน</p>
                </div>
                <span className="text-sm font-bold text-blue-600">08:00 AM</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-bold text-gray-900">Auto Backup</p>
                  <p className="text-xs text-gray-600">สำรองข้อมูลอัตโนมัติ</p>
                </div>
                <span className="text-sm font-bold text-green-600">02:00 AM</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <p className="font-bold text-gray-900">Weekly Summary</p>
                  <p className="text-xs text-gray-600">สรุปยอดรายสัปดาห์</p>
                </div>
                <span className="text-sm font-bold text-purple-600">Mon 09:00 AM</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield size={20} className="text-red-600" />
              Security Logs (Recent)
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">Admin Login</p>
                  <p className="text-xs text-gray-600">IP: 192.168.1.100 • 2 min ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">Data Export</p>
                  <p className="text-xs text-gray-600">User: admin • 15 min ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">Settings Changed</p>
                  <p className="text-xs text-gray-600">Auto Payout enabled • 1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6 border-2 border-blue-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Code size={20} className="text-blue-600" />
            Developer Tools
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 bg-white rounded-lg hover:shadow-md transition-all text-left">
              <p className="font-bold text-gray-900 mb-1">API Documentation</p>
              <p className="text-xs text-gray-600">ดูเอกสาร API</p>
            </button>
            <button className="p-4 bg-white rounded-lg hover:shadow-md transition-all text-left">
              <p className="font-bold text-gray-900 mb-1">Generate API Key</p>
              <p className="text-xs text-gray-600">สร้าง API Key ใหม่</p>
            </button>
            <button className="p-4 bg-white rounded-lg hover:shadow-md transition-all text-left">
              <p className="font-bold text-gray-900 mb-1">Webhook Settings</p>
              <p className="text-xs text-gray-600">ตั้งค่า Webhook</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
