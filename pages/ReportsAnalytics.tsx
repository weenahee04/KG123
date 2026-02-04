import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar,
  Download,
  DollarSign,
  Users,
  FileText,
  PieChart,
  Activity
} from 'lucide-react';

interface ReportData {
  date: string;
  sales: number;
  profit: number;
  bets: number;
  members: number;
}

export default function ReportsAnalytics() {
  const [dateRange, setDateRange] = useState('7days');
  const [reportType, setReportType] = useState('sales');
  const [reportData, setReportData] = useState<ReportData[]>([]);

  useEffect(() => {
    loadReportData();
  }, [dateRange, reportType]);

  const loadReportData = () => {
    const mockData: ReportData[] = [
      { date: '2024-02-04', sales: 485000, profit: 125000, bets: 1250, members: 45 },
      { date: '2024-02-03', sales: 520000, profit: 145000, bets: 1380, members: 52 },
      { date: '2024-02-02', sales: 445000, profit: 98000, bets: 1120, members: 38 },
      { date: '2024-02-01', sales: 510000, profit: 135000, bets: 1290, members: 48 },
      { date: '2024-01-31', sales: 475000, profit: 115000, bets: 1180, members: 42 },
      { date: '2024-01-30', sales: 495000, profit: 128000, bets: 1240, members: 46 },
      { date: '2024-01-29', sales: 460000, profit: 105000, bets: 1150, members: 40 },
    ];
    setReportData(mockData);
  };

  const totalSales = reportData.reduce((sum, d) => sum + d.sales, 0);
  const totalProfit = reportData.reduce((sum, d) => sum + d.profit, 0);
  const totalBets = reportData.reduce((sum, d) => sum + d.bets, 0);
  const avgProfit = totalProfit / reportData.length;
  const profitMargin = (totalProfit / totalSales) * 100;

  const maxSales = Math.max(...reportData.map(d => d.sales));

  const topNumbers = [
    { number: '123', bets: 245, amount: 125000, winRate: 12.5 },
    { number: '456', bets: 198, amount: 98000, winRate: 8.3 },
    { number: '789', bets: 176, amount: 85000, winRate: 15.2 },
    { number: '12', bets: 312, amount: 145000, winRate: 10.8 },
    { number: '34', bets: 289, amount: 132000, winRate: 9.5 },
  ];

  const betTypeDistribution = [
    { type: '3ตัวบน', count: 3250, amount: 1250000, percentage: 35 },
    { type: '3ตัวโต๊ด', count: 2180, amount: 850000, percentage: 24 },
    { type: '2ตัวบน', count: 2890, amount: 980000, percentage: 27 },
    { type: '2ตัวล่าง', count: 1680, amount: 520000, percentage: 14 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📊 รายงาน & Analytics</h1>
            <p className="text-gray-600 mt-1">วิเคราะห์ข้อมูลและสร้างรายงาน</p>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg">
            <Download size={20} />
            Export PDF
          </button>
        </div>

        <div className="flex gap-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white"
          >
            <option value="today">วันนี้</option>
            <option value="7days">7 วันล่าสุด</option>
            <option value="30days">30 วันล่าสุด</option>
            <option value="thismonth">เดือนนี้</option>
            <option value="lastmonth">เดือนที่แล้ว</option>
            <option value="custom">กำหนดเอง</option>
          </select>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white"
          >
            <option value="sales">ยอดขาย</option>
            <option value="profit">กำไร</option>
            <option value="bets">จำนวนโพย</option>
            <option value="members">สมาชิก</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <DollarSign size={24} className="text-blue-600" />
              </div>
              <span className="text-xs text-green-600 font-bold">+12.5%</span>
            </div>
            <p className="text-sm text-gray-600">ยอดขายรวม</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">฿{totalSales.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp size={24} className="text-green-600" />
              </div>
              <span className="text-xs text-green-600 font-bold">+8.3%</span>
            </div>
            <p className="text-sm text-gray-600">กำไรรวม</p>
            <p className="text-3xl font-bold text-green-600 mt-1">฿{totalProfit.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FileText size={24} className="text-purple-600" />
              </div>
              <span className="text-xs text-blue-600 font-bold">+5.2%</span>
            </div>
            <p className="text-sm text-gray-600">จำนวนโพย</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{totalBets.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Activity size={24} className="text-orange-600" />
              </div>
              <span className="text-xs text-purple-600 font-bold">{profitMargin.toFixed(1)}%</span>
            </div>
            <p className="text-sm text-gray-600">Profit Margin</p>
            <p className="text-3xl font-bold text-orange-600 mt-1">{profitMargin.toFixed(1)}%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 size={20} className="text-purple-600" />
                กราฟยอดขาย (7 วันล่าสุด)
              </h3>
            </div>
            <div className="space-y-3">
              {reportData.map((data, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-gray-700">
                      {new Date(data.date).toLocaleDateString('th-TH', { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="font-bold text-blue-600">฿{data.sales.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                      style={{ width: `${(data.sales / maxSales) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp size={20} className="text-green-600" />
                กราฟกำไร (7 วันล่าสุด)
              </h3>
            </div>
            <div className="space-y-3">
              {reportData.map((data, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-gray-700">
                      {new Date(data.date).toLocaleDateString('th-TH', { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="font-bold text-green-600">฿{data.profit.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
                      style={{ width: `${(data.profit / maxSales) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 size={20} className="text-orange-600" />
              เลขยอดนิยม Top 5
            </h3>
            <div className="space-y-3">
              {topNumbers.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-orange-400">#{idx + 1}</span>
                    <div>
                      <p className="font-mono text-xl font-bold text-gray-900">{item.number}</p>
                      <p className="text-xs text-gray-600">{item.bets} โพย</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-orange-600">฿{item.amount.toLocaleString()}</p>
                    <p className="text-xs text-green-600 font-bold">Win: {item.winRate}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <PieChart size={20} className="text-purple-600" />
              สัดส่วนประเภทการแทง
            </h3>
            <div className="space-y-4">
              {betTypeDistribution.map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded ${
                        idx === 0 ? 'bg-purple-500' :
                        idx === 1 ? 'bg-blue-500' :
                        idx === 2 ? 'bg-green-500' :
                        'bg-orange-500'
                      }`} />
                      <span className="font-bold text-gray-700">{item.type}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{item.percentage}%</p>
                      <p className="text-xs text-gray-600">{item.count} โพย</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full ${
                        idx === 0 ? 'bg-purple-500' :
                        idx === 1 ? 'bg-blue-500' :
                        idx === 2 ? 'bg-green-500' :
                        'bg-orange-500'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600">฿{item.amount.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar size={20} className="text-blue-600" />
            สรุปรายงานประจำวัน
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-100 to-pink-100 border-b-2 border-purple-300">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">วันที่</th>
                  <th className="px-4 py-3 text-right font-bold text-gray-700">ยอดขาย</th>
                  <th className="px-4 py-3 text-right font-bold text-gray-700">กำไร</th>
                  <th className="px-4 py-3 text-right font-bold text-gray-700">Margin %</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-700">โพย</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-700">สมาชิกใหม่</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reportData.map((data, idx) => {
                  const margin = (data.profit / data.sales) * 100;
                  return (
                    <tr key={idx} className="hover:bg-purple-50 transition-colors">
                      <td className="px-4 py-4">
                        <p className="font-bold text-gray-900">
                          {new Date(data.date).toLocaleDateString('th-TH')}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <p className="font-bold text-blue-600">฿{data.sales.toLocaleString()}</p>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <p className="font-bold text-green-600">฿{data.profit.toLocaleString()}</p>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          margin >= 25 ? 'bg-green-100 text-green-700' :
                          margin >= 20 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {margin.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <p className="font-bold text-gray-900">{data.bets}</p>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <p className="font-bold text-purple-600">{data.members}</p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-gradient-to-r from-gray-100 to-gray-200 border-t-2 border-gray-300">
                <tr>
                  <td className="px-4 py-4 font-bold text-gray-900">รวม</td>
                  <td className="px-4 py-4 text-right font-bold text-blue-600">฿{totalSales.toLocaleString()}</td>
                  <td className="px-4 py-4 text-right font-bold text-green-600">฿{totalProfit.toLocaleString()}</td>
                  <td className="px-4 py-4 text-right font-bold text-orange-600">{profitMargin.toFixed(1)}%</td>
                  <td className="px-4 py-4 text-center font-bold text-gray-900">{totalBets.toLocaleString()}</td>
                  <td className="px-4 py-4 text-center font-bold text-purple-600">
                    {reportData.reduce((sum, d) => sum + d.members, 0)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-500 rounded-lg">
                <DollarSign size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">ยอดขายเฉลี่ย/วัน</p>
                <p className="text-2xl font-bold text-blue-600">฿{(totalSales / reportData.length).toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-500 rounded-lg">
                <TrendingUp size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">กำไรเฉลี่ย/วัน</p>
                <p className="text-2xl font-bold text-blue-600">฿{(totalProfit / reportData.length).toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-500 rounded-lg">
                <FileText size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">โพยเฉลี่ย/วัน</p>
                <p className="text-2xl font-bold text-blue-600">{(totalBets / reportData.length).toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
