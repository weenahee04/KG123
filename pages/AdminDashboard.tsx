import React, { useState } from 'react';
import { Button } from '../components/Button';

interface AdminDashboardProps {
  onLogout: () => void;
  onNavigate?: (page: any) => void;
}

type TabView = 'dashboard' | 'members' | 'finance' | 'bets' | 'lotto-sys' | 'affiliate' | 'api-system' | 'results' | 'settings';
type LottoSubTab = 'gov' | 'yiki' | 'stock' | 'config';
type AffiliateSubTab = 'overview' | 'tree' | 'logs' | 'fraud' | 'rates';
type ApiSubTab = 'lotto-api' | 'bank-api';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<TabView>('dashboard');
  const [lottoSubTab, setLottoSubTab] = useState<LottoSubTab>('gov');
  const [affSubTab, setAffSubTab] = useState<AffiliateSubTab>('overview');
  const [apiSubTab, setApiSubTab] = useState<ApiSubTab>('lotto-api');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // --- STATE FOR GOV LOTTO ---
  const [govFirstPrize, setGovFirstPrize] = useState('');
  const [govBottom2, setGovBottom2] = useState('');
  const [govParsed, setGovParsed] = useState<any>(null);
  const [riskNumbers, setRiskNumbers] = useState('');

  // --- STATE FOR YIKI ---
  const [yikiRounds, setYikiRounds] = useState<any[]>([]);
  const [selectedYikiRound, setSelectedYikiRound] = useState<number>(1);

  // --- MOCK DATA ---
  const users = [
    { id: 1, username: 'GR726162', credit: 1540.00, status: 'active', registered: '2023-12-01' },
    { id: 2, username: 'TH889212', credit: 0.00, status: 'active', registered: '2024-01-15' },
    { id: 3, username: 'VIP99999', credit: 50000.00, status: 'active', registered: '2024-01-10' },
    { id: 4, username: 'BAD_USER', credit: 20.00, status: 'banned', registered: '2024-01-01' },
    { id: 5, username: 'NEW001', credit: 100.00, status: 'active', registered: 'Today' },
  ];

  const transactions = [
      { id: 'TXN-001', user: 'GR726162', type: 'deposit', amount: 500, time: '10:30', status: 'pending', bank: 'KBANK' },
      { id: 'TXN-002', user: 'VIP99999', type: 'withdraw', amount: 12000, time: '10:32', status: 'pending', bank: 'SCB' },
      { id: 'TXN-003', user: 'TH889212', type: 'deposit', amount: 1000, time: '10:35', status: 'success', bank: 'BBL' },
      { id: 'TXN-004', user: 'GR726162', type: 'withdraw', amount: 300, time: '09:00', status: 'rejected', bank: 'KBANK' },
  ];

  const bets = [
      { id: 'BET-881', user: 'GR726162', lotto: 'ยี่กี VIP', round: 45, numbers: '88', type: '2บน', amount: 50, status: 'pending' },
      { id: 'BET-882', user: 'VIP99999', lotto: 'รัฐบาล', round: '17/01', numbers: '879', type: '3บน', amount: 1000, status: 'win' },
      { id: 'BET-883', user: 'TH889212', lotto: 'ฮานอย', round: '18:00', numbers: '123', type: '3โต๊ด', amount: 20, status: 'loss' },
  ];

  // --- ACTIONS ---
  const handleParseGov = () => {
      if (govFirstPrize.length !== 6 || govBottom2.length !== 2) {
          alert('กรุณากรอกรางวัลที่ 1 (6 หลัก) และ เลขท้าย 2 ตัว ให้ครบถ้วน');
          return;
      }
      setGovParsed({
          top3: govFirstPrize.slice(-3),
          front3: govFirstPrize.slice(0, 3),
          top2: govFirstPrize.slice(-2),
          bottom2: govBottom2
      });
  };

  const handleGenYiki = () => {
      const rounds = Array.from({length: 88}, (_, i) => ({
          round: i + 1,
          time: `${String(6 + Math.floor((i * 15) / 60)).padStart(2, '0')}:${String((i * 15) % 60).padStart(2, '0')}`,
          status: i < 30 ? 'closed' : i === 30 ? 'open' : 'waiting'
      }));
      setYikiRounds(rounds);
      alert('สร้างรอบ 88 รอบ เรียบร้อยแล้ว');
  };

  const renderSidebarItem = (id: TabView, label: string, icon: React.ReactNode) => (
      <button 
        onClick={() => setActiveTab(id)}
        className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${activeTab === id ? 'bg-[#b08528] text-white border-r-4 border-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
      >
          {icon}
          <span className={`${!sidebarOpen && 'hidden'} font-medium`}>{label}</span>
      </button>
  );

  // --- LOTTO SUB RENDER FUNCTIONS ---
  const renderGovManagement = () => (
      <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Result Parser */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="font-bold text-lg text-gray-800 mb-4 border-b pb-2 flex items-center gap-2">
                      <span className="text-[#b08528]">🏆</span> ตัดเกรดผลรางวัล (Result Parser)
                  </h3>
                  <div className="space-y-4">
                      <div>
                          <label className="block text-sm font-bold text-gray-700">รางวัลที่ 1 (6 ตัว)</label>
                          <input 
                            type="text" 
                            maxLength={6} 
                            value={govFirstPrize}
                            onChange={(e) => setGovFirstPrize(e.target.value)}
                            className="w-full text-center text-3xl font-black tracking-widest border-2 border-gray-300 rounded p-2 focus:border-[#b08528] outline-none" 
                            placeholder="XXXXXX"
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700">เลขท้าย 2 ตัว</label>
                          <input 
                            type="text" 
                            maxLength={2} 
                            value={govBottom2}
                            onChange={(e) => setGovBottom2(e.target.value)}
                            className="w-full text-center text-3xl font-black tracking-widest border-2 border-gray-300 rounded p-2 focus:border-[#b08528] outline-none" 
                            placeholder="XX"
                          />
                      </div>
                      <button onClick={handleParseGov} className="w-full bg-[#b08528] text-white font-bold py-2 rounded hover:bg-[#8f6b1f] transition">
                          ประมวลผลรางวัล
                      </button>

                      {govParsed && (
                          <div className="bg-gray-100 p-4 rounded mt-4 grid grid-cols-2 gap-4 text-center animate-fade-in">
                              <div className="bg-white p-2 rounded shadow-sm border border-gray-200">
                                  <div className="text-xs text-gray-500">3 ตัวบน</div>
                                  <div className="text-xl font-bold text-[#b08528]">{govParsed.top3}</div>
                              </div>
                              <div className="bg-white p-2 rounded shadow-sm border border-gray-200">
                                  <div className="text-xs text-gray-500">2 ตัวล่าง</div>
                                  <div className="text-xl font-bold text-[#b08528]">{govParsed.bottom2}</div>
                              </div>
                              <div className="bg-white p-2 rounded shadow-sm border border-gray-200">
                                  <div className="text-xs text-gray-500">3 ตัวหน้า</div>
                                  <div className="text-xl font-bold text-gray-800">{govParsed.front3}</div>
                              </div>
                              <div className="bg-white p-2 rounded shadow-sm border border-gray-200">
                                  <div className="text-xs text-gray-500">2 ตัวบน</div>
                                  <div className="text-xl font-bold text-gray-800">{govParsed.top2}</div>
                              </div>
                              <div className="col-span-2">
                                  <button className="w-full bg-green-600 text-white text-sm font-bold py-2 rounded shadow">ยืนยันและจ่ายเงิน</button>
                              </div>
                          </div>
                      )}
                  </div>
              </div>

              {/* Risk Control */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 border-l-4 border-red-500">
                  <h3 className="font-bold text-lg text-gray-800 mb-4 border-b pb-2 flex items-center gap-2">
                      <span className="text-red-500">⚠️</span> จัดการเลขอั้น (Risk Control)
                  </h3>
                  <div className="mb-4">
                      <label className="flex items-center gap-2 cursor-pointer mb-2">
                          <input type="checkbox" className="w-4 h-4 text-red-600" defaultChecked />
                          <span className="text-sm font-bold text-gray-700">เปิดระบบตัดเลขอั้นอัตโนมัติ</span>
                      </label>
                      <p className="text-xs text-gray-500">หากยอดแทงเกิน 10,000,000 บาท ปรับเป็น "จ่ายครึ่ง" ทันที</p>
                  </div>
              </div>
          </div>
      </div>
  );

  const renderYikiManagement = () => (
      <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="font-bold text-lg text-gray-800 mb-4 border-b pb-2">จัดการรอบ (Round Gen)</h3>
                  {yikiRounds.length === 0 ? (
                      <div className="text-center py-8">
                          <div className="text-4xl mb-2">📅</div>
                          <button onClick={handleGenYiki} className="bg-[#b08528] text-white font-bold py-2 px-6 rounded shadow hover:bg-[#8f6b1f]">
                              สร้างรอบประจำวัน (88 รอบ)
                          </button>
                      </div>
                  ) : (
                      <div className="h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                          {yikiRounds.map((r) => (
                              <div 
                                key={r.round} 
                                onClick={() => setSelectedYikiRound(r.round)}
                                className={`flex justify-between items-center p-3 border-b cursor-pointer transition ${selectedYikiRound === r.round ? 'bg-yellow-50 border-l-4 border-l-[#b08528]' : 'hover:bg-gray-50'}`}
                              >
                                  <div>
                                      <span className="font-bold text-gray-800 mr-2">รอบที่ {r.round}</span>
                                      <span className="text-xs text-gray-500">{r.time}</span>
                                  </div>
                                  <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${r.status === 'open' ? 'bg-green-100 text-green-700' : r.status === 'closed' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                                      {r.status}
                                  </span>
                              </div>
                          ))}
                      </div>
                  )}
              </div>
              <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col">
                  <div className="flex justify-between items-start mb-4 border-b pb-4">
                      <div>
                          <h3 className="font-bold text-lg text-gray-800">Monitor การยิงเลข - รอบที่ {selectedYikiRound}</h3>
                          <p className="text-xs text-gray-500">ตรวจสอบ Bot และคนที่ได้ลำดับที่ 16</p>
                      </div>
                      <div className="text-right">
                          <div className="text-sm text-gray-600">ผลรวมปัจจุบัน (Sum)</div>
                          <div className="text-2xl font-mono font-bold text-[#b08528]">4,158,920</div>
                      </div>
                  </div>
                  {/* ... Shooter Table & Calculator ... */}
              </div>
          </div>
      </div>
  );

  const renderStockManagement = () => (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center py-12">
          <div className="text-4xl mb-4">📈</div>
          <h3 className="font-bold text-lg text-gray-800">จัดการหวยหุ้น / ต่างประเทศ</h3>
          <p className="text-gray-500 mb-6">ระบบดึงผลอัตโนมัติจาก API ตลาดหลักทรัพย์</p>
          <button className="bg-[#b08528] text-white font-bold py-2 px-6 rounded shadow hover:bg-[#8f6b1f]">
              อัพเดทผลล่าสุด
          </button>
      </div>
  );

  const renderConfig = () => (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="font-bold text-lg text-gray-800 mb-6 border-b pb-2">ตั้งค่าระบบหวย / คืนโพย</h3>
          <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">อัตราจ่ายมาตรฐาน (บาทละ)</label>
                      <input type="number" defaultValue={900} className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#b08528]" />
                  </div>
                  <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">ส่วนลดเปอร์เซ็นต์ (AF)</label>
                      <input type="number" defaultValue={8} className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#b08528]" />
                  </div>
              </div>
          </div>
      </div>
  );

  // --- API MANAGEMENT SYSTEM FUNCTIONS (NEW) ---

  const renderLottoApi = () => (
      <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                      <span className="text-blue-500">📡</span> จัดการ Feed ผลรางวัล (Lotto API)
                  </h3>
                  <button className="bg-blue-600 text-white text-sm px-4 py-2 rounded shadow hover:bg-blue-700">
                      + เพิ่ม Provider
                  </button>
              </div>

              <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                      <thead className="bg-gray-100 text-gray-700 uppercase">
                          <tr>
                              <th className="px-4 py-3">Provider Name</th>
                              <th className="px-4 py-3">Type</th>
                              <th className="px-4 py-3">Endpoint URL</th>
                              <th className="px-4 py-3">Last Sync</th>
                              <th className="px-4 py-3 text-center">Status</th>
                              <th className="px-4 py-3 text-center">Action</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                          <tr className="hover:bg-gray-50">
                              <td className="px-4 py-3 font-bold">GLO Official</td>
                              <td className="px-4 py-3"><span className="bg-gray-200 px-2 py-1 rounded text-xs">Government</span></td>
                              <td className="px-4 py-3 text-gray-500 font-mono text-xs">https://api.glo.or.th/v1/latest</td>
                              <td className="px-4 py-3">10 mins ago</td>
                              <td className="px-4 py-3 text-center"><span className="w-3 h-3 bg-green-500 rounded-full inline-block"></span></td>
                              <td className="px-4 py-3 text-center">
                                  <button className="text-blue-600 hover:underline text-xs">Config</button>
                              </td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                              <td className="px-4 py-3 font-bold">Yahoo Finance</td>
                              <td className="px-4 py-3"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Stocks</span></td>
                              <td className="px-4 py-3 text-gray-500 font-mono text-xs">https://query1.finance.yahoo.com/v8...</td>
                              <td className="px-4 py-3">1 min ago</td>
                              <td className="px-4 py-3 text-center"><span className="w-3 h-3 bg-green-500 rounded-full inline-block"></span></td>
                              <td className="px-4 py-3 text-center">
                                  <button className="text-blue-600 hover:underline text-xs">Config</button>
                              </td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                              <td className="px-4 py-3 font-bold">Huay YiKi Randomizer</td>
                              <td className="px-4 py-3"><span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">Internal</span></td>
                              <td className="px-4 py-3 text-gray-500 font-mono text-xs">localhost:3000/api/yiki/gen</td>
                              <td className="px-4 py-3">Realtime</td>
                              <td className="px-4 py-3 text-center"><span className="w-3 h-3 bg-green-500 rounded-full inline-block"></span></td>
                              <td className="px-4 py-3 text-center">
                                  <button className="text-blue-600 hover:underline text-xs">Config</button>
                              </td>
                          </tr>
                      </tbody>
                  </table>
              </div>
          </div>

          <div className="bg-gray-800 text-white p-6 rounded-lg border border-gray-700">
              <h4 className="font-bold mb-2">Debug Console (Latest Response)</h4>
              <div className="bg-black p-4 rounded font-mono text-xs text-green-400 h-32 overflow-y-auto">
                  {`{
  "status": "success",
  "source": "GLO_API",
  "data": {
      "date": "2026-01-17",
      "first_prize": "878972",
      "last_two": "02"
  },
  "timestamp": 1768634400
}`}
              </div>
          </div>
      </div>
  );

  const renderBankApi = () => (
      <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Deposit Gateway */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex justify-between items-center mb-4 border-b pb-2">
                      <h3 className="font-bold text-lg text-green-700">ระบบฝากอัตโนมัติ (Deposit Gateway)</h3>
                      <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                  </div>
                  
                  <div className="space-y-4">
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">เลือกธนาคารหลัก (Main Gateway)</label>
                          <select className="w-full border border-gray-300 rounded p-2 text-sm">
                              <option>KBANK (K-Plus API)</option>
                              <option>SCB (Easy App API)</option>
                              <option>TrueWallet (Gift Envelope)</option>
                          </select>
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Android SMS Gateway URL</label>
                          <input type="text" className="w-full border border-gray-300 rounded p-2 text-sm bg-gray-50" placeholder="https://sms-gateway.baanhuay.com/webhook" />
                          <p className="text-xs text-gray-500 mt-1">* สำหรับเครื่องที่ติดตั้ง App อ่าน SMS ธนาคาร</p>
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Secret Token</label>
                          <input type="password" value="sk_test_51Mz..." readOnly className="w-full border border-gray-300 rounded p-2 text-sm bg-gray-100 text-gray-500" />
                      </div>
                  </div>
              </div>

              {/* Withdraw Gateway */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex justify-between items-center mb-4 border-b pb-2">
                      <h3 className="font-bold text-lg text-red-700">ระบบถอนอัตโนมัติ (Withdraw Gateway)</h3>
                      <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                      </label>
                  </div>

                  <div className="space-y-4">
                      <div className="p-3 bg-red-50 border border-red-100 rounded text-sm text-red-800">
                          <p>⚠️ <strong>สถานะ: ปิดใช้งาน (Manual Approve Only)</strong></p>
                          <p className="text-xs mt-1">ต้องกดอนุมัติด้วยมือเท่านั้น เพื่อความปลอดภัย</p>
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">API Provider</label>
                          <select className="w-full border border-gray-300 rounded p-2 text-sm" disabled>
                              <option>Direct Bank API (Corporate)</option>
                          </select>
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Auto Withdraw Limit (บาท/ครั้ง)</label>
                          <input type="number" className="w-full border border-gray-300 rounded p-2 text-sm" placeholder="50000" disabled />
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );

  // --- AFFILIATE SYSTEM RENDER FUNCTIONS ---

  const renderAffOverview = () => (
      <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
                  <div className="text-gray-500 text-xs font-bold uppercase">ยอดจ่ายค่าคอมฯ (วันนี้)</div>
                  <div className="text-2xl font-black text-gray-800 mt-2">฿ 8,540</div>
                  <div className="text-green-500 text-xs mt-1 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"></path></svg>
                      +12% จากเมื่อวาน
                  </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-[#b08528]">
                  <div className="text-gray-500 text-xs font-bold uppercase">ยอดจ่ายสะสม (เดือนนี้)</div>
                  <div className="text-2xl font-black text-gray-800 mt-2">฿ 254,100</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
                  <div className="text-gray-500 text-xs font-bold uppercase">Agent หน้าใหม่</div>
                  <div className="text-2xl font-black text-gray-800 mt-2">15 คน</div>
                  <div className="text-xs text-gray-400 mt-1">เริ่มชวนเพื่อนวันนี้</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-500">
                  <div className="text-gray-500 text-xs font-bold uppercase">ROI (ความคุ้มค่า)</div>
                  <div className="text-2xl font-black text-gray-800 mt-2">1,250%</div>
                  <div className="text-xs text-gray-400 mt-1">จ่าย 8 ได้ยอดแทง 100</div>
              </div>
          </div>

          {/* Graph Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-4">แนวโน้มการจ่ายค่าคอมมิชชั่น (7 วันล่าสุด)</h3>
              <div className="h-64 flex items-end justify-between gap-2 px-4 pb-2 border-b border-l border-gray-300">
                  {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                      <div key={i} className="w-full flex flex-col items-center gap-1 group relative">
                          <div className="absolute bottom-full mb-1 text-xs font-bold bg-black text-white px-1 rounded opacity-0 group-hover:opacity-100 transition">฿{h*100}</div>
                          <div style={{height: `${h}%`}} className="w-full bg-[#b08528] rounded-t opacity-80 hover:opacity-100 transition-all cursor-pointer"></div>
                          <div className="text-xs text-gray-500">Day {i+1}</div>
                      </div>
                  ))}
              </div>
          </div>
      </div>
  );

  const renderAffTree = () => (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 min-h-[500px]">
          <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-gray-800">ผังสายงาน (Agent Tree)</h3>
              <div className="flex gap-2">
                  <input type="text" placeholder="ค้นหา User / เบอร์โทร" className="border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#b08528]" />
                  <button className="bg-[#333] text-white px-4 py-1.5 rounded text-sm hover:bg-black">ค้นหา</button>
              </div>
          </div>

          <div className="border border-gray-200 rounded p-4 bg-gray-50">
              {/* Parent */}
              <div className="mb-4">
                  <div className="flex items-center gap-2 cursor-pointer p-2 hover:bg-white rounded border border-transparent hover:border-gray-200 transition">
                      <span className="text-yellow-600 text-xl">📂</span>
                      <div>
                          <div className="font-bold text-gray-800">Agent: GODFATHER_888 (แม่ทีมใหญ่)</div>
                          <div className="text-xs text-gray-500">ลูกทีม: 1,204 คน | รายได้รวม: ฿5,400,000</div>
                      </div>
                  </div>
                  {/* Children Level 1 */}
                  <div className="ml-8 border-l-2 border-gray-300 pl-4 space-y-2 mt-2">
                      <div className="flex items-center gap-2 p-2 bg-white rounded border border-gray-200 shadow-sm cursor-pointer hover:border-[#b08528]">
                          <span className="text-gray-400">👤</span>
                          <div className="flex-1 flex justify-between items-center">
                              <div>
                                  <div className="font-bold text-sm text-gray-700">User: TONY_STARK</div>
                                  <div className="text-xs text-gray-500">ยอดแทงสะสม: ฿500,000</div>
                              </div>
                              <span className="text-green-600 text-xs font-bold bg-green-100 px-2 py-1 rounded">Active</span>
                          </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-white rounded border border-gray-200 shadow-sm cursor-pointer hover:border-[#b08528]">
                          <span className="text-yellow-600 text-lg">📂</span>
                          <div className="flex-1">
                              <div className="font-bold text-sm text-gray-700">Agent: SARAH_CONNOR (ลูกข่าย)</div>
                              <div className="text-xs text-gray-500">ลูกทีม: 50 คน | รายได้รวม: ฿20,000</div>
                          </div>
                      </div>
                      {/* Children Level 2 */}
                      <div className="ml-8 border-l-2 border-gray-300 pl-4 space-y-2">
                          <div className="flex items-center gap-2 p-2 bg-gray-100 rounded border border-gray-200 shadow-sm opacity-70">
                              <span className="text-gray-400">👤</span>
                              <div className="font-bold text-sm text-gray-600">User: JOHN_DOE</div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );

  const renderAffLogs = () => (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-800">ประวัติการจ่าย (Commission Logs)</h3>
              <button className="text-green-600 text-sm hover:underline font-bold flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                  Export Excel
              </button>
          </div>
          <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-600 font-medium">
                  <tr>
                      <th className="px-4 py-3">Time</th>
                      <th className="px-4 py-3">Receiver (แม่ทีม)</th>
                      <th className="px-4 py-3">Source (คนแทง)</th>
                      <th className="px-4 py-3">Ticket ID</th>
                      <th className="px-4 py-3 text-right">Bet Amount</th>
                      <th className="px-4 py-3 text-center">Rate</th>
                      <th className="px-4 py-3 text-right">Commission</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                  {[1,2,3,4,5].map((i) => (
                      <tr key={i} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-500">10:4{i}:22</td>
                          <td className="px-4 py-3 font-bold text-[#b08528]">AGENT_00{i}</td>
                          <td className="px-4 py-3 text-gray-700">player_99{i}</td>
                          <td className="px-4 py-3 text-blue-600 cursor-pointer hover:underline">#TICK-88{i}</td>
                          <td className="px-4 py-3 text-right">1,000.00</td>
                          <td className="px-4 py-3 text-center bg-gray-50">8%</td>
                          <td className="px-4 py-3 text-right font-bold text-green-600">+80.00</td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
  );

  const renderAffFraud = () => (
      <div className="bg-white rounded-lg shadow-sm border border-red-200 overflow-hidden">
          <div className="p-4 bg-red-50 border-b border-red-200 flex justify-between items-center">
              <div className="flex items-center gap-2">
                  <span className="text-red-600 text-xl">🕵️</span>
                  <div>
                      <h3 className="font-bold text-red-800">ระบบจับโกง (Fraud Detection)</h3>
                      <p className="text-xs text-red-600">รายชื่อผู้ต้องสงสัย สมัครต่อตัวเองเพื่อรับค่าคอมฯ</p>
                  </div>
              </div>
          </div>
          <table className="w-full text-sm text-left">
              <thead className="bg-red-100 text-red-800">
                  <tr>
                      <th className="px-4 py-3">Parent (แม่)</th>
                      <th className="px-4 py-3">Child (ลูก)</th>
                      <th className="px-4 py-3">Match Type</th>
                      <th className="px-4 py-3">Detail</th>
                      <th className="px-4 py-3 text-center">Action</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-red-100">
                  <tr className="bg-white">
                      <td className="px-4 py-3 font-bold">USER_A</td>
                      <td className="px-4 py-3 font-bold">USER_A_CLONE</td>
                      <td className="px-4 py-3"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-bold">IP MATCH</span></td>
                      <td className="px-4 py-3 text-gray-500 font-mono">192.168.1.1</td>
                      <td className="px-4 py-3 text-center flex gap-2 justify-center">
                          <button className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700">Ban Affiliate</button>
                          <button className="bg-gray-600 text-white px-3 py-1 rounded text-xs hover:bg-gray-700">Freeze Wallet</button>
                      </td>
                  </tr>
                  <tr className="bg-white">
                      <td className="px-4 py-3 font-bold">VIP_888</td>
                      <td className="px-4 py-3 font-bold">TEST_ACC</td>
                      <td className="px-4 py-3"><span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-bold">BANK MATCH</span></td>
                      <td className="px-4 py-3 text-gray-500">KBANK: 123-4-5xxx-x</td>
                      <td className="px-4 py-3 text-center flex gap-2 justify-center">
                          <button className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700">Ban Affiliate</button>
                          <button className="bg-gray-600 text-white px-3 py-1 rounded text-xs hover:bg-gray-700">Freeze Wallet</button>
                      </td>
                  </tr>
              </tbody>
          </table>
      </div>
  );

  const renderAffRates = () => (
      <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-bold text-lg text-gray-800 mb-4 border-b pb-2">ตั้งค่าเรท (Global Configuration)</h3>
              <div className="flex items-center gap-4 mb-6">
                  <label className="font-bold text-gray-700">ส่วนแบ่งพื้นฐาน (Global Rate):</label>
                  <input type="number" defaultValue={8} className="border border-gray-300 rounded px-3 py-2 w-24 text-center focus:border-[#b08528]" />
                  <span className="text-gray-500">%</span>
                  <button className="bg-[#b08528] text-white px-4 py-2 rounded text-sm hover:bg-[#8f6b1f]">บันทึก</button>
              </div>

              <h4 className="font-bold text-gray-700 mb-2 mt-6">Product Exception (ข้อยกเว้นรายหวย)</h4>
              <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm text-left">
                      <thead className="bg-gray-100">
                          <tr>
                              <th className="px-4 py-2">ประเภทหวย</th>
                              <th className="px-4 py-2">ใช้ Global Rate?</th>
                              <th className="px-4 py-2">Custom Rate (%)</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y">
                          <tr>
                              <td className="px-4 py-2">หวยรัฐบาลไทย</td>
                              <td className="px-4 py-2"><input type="checkbox" defaultChecked /></td>
                              <td className="px-4 py-2"><input type="number" disabled className="bg-gray-100 border rounded w-16 px-1" /></td>
                          </tr>
                          <tr>
                              <td className="px-4 py-2">หวยยี่กี VIP</td>
                              <td className="px-4 py-2"><input type="checkbox" /></td>
                              <td className="px-4 py-2"><input type="number" defaultValue={5} className="border border-gray-300 rounded w-16 px-1 focus:border-[#b08528]" /></td>
                          </tr>
                      </tbody>
                  </table>
              </div>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-purple-800">Tier System (ระบบขั้นบันได VIP)</h3>
                  <label className="flex items-center gap-2 cursor-pointer">
                      <div className="w-10 h-5 bg-purple-300 rounded-full relative">
                          <div className="w-5 h-5 bg-purple-600 rounded-full absolute right-0"></div>
                      </div>
                      <span className="text-sm font-bold text-purple-700">เปิดใช้งาน</span>
                  </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded border border-purple-200 shadow-sm">
                      <div className="text-xs font-bold text-purple-600 uppercase mb-1">VIP LEVEL 1 (ทั่วไป)</div>
                      <div className="flex justify-between items-center">
                          <span className="text-sm">ยอดทีม &lt; 1 ล้าน</span>
                          <span className="font-bold text-lg">6%</span>
                      </div>
                  </div>
                  <div className="bg-white p-4 rounded border border-purple-200 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] px-2 py-0.5">Recommended</div>
                      <div className="text-xs font-bold text-purple-600 uppercase mb-1">VIP LEVEL 2 (แม่ทีม)</div>
                      <div className="flex justify-between items-center">
                          <span className="text-sm">ยอดทีม &gt; 1 ล้าน</span>
                          <span className="font-bold text-lg text-purple-700">8%</span>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );

  return (
    <div className="flex h-screen bg-[#f3f4f6] font-sans">
        
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#1a1a1a] flex flex-col transition-all duration-300 shadow-xl z-20`}>
            <div className="h-16 flex items-center justify-center border-b border-gray-800 bg-[#111]">
                <div className="w-8 h-8 bg-[#b08528] rounded flex items-center justify-center text-white font-bold font-serif text-xl shadow-lg">B</div>
                {sidebarOpen && <span className="ml-2 text-white font-black text-xl tracking-wider">บ้านหวย <span className="text-[#b08528] text-xs font-normal align-top">ADMIN</span></span>}
            </div>

            <nav className="flex-1 py-6 space-y-1">
                {renderSidebarItem('dashboard', 'ภาพรวมระบบ', <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>)}
                
                {renderSidebarItem('lotto-sys', 'จัดการระบบหวย', <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>)}

                {/* NEW API MANAGEMENT MENU */}
                {renderSidebarItem('api-system', 'จัดการ API ระบบ', <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>)}

                {renderSidebarItem('affiliate', 'ระบบพันธมิตร', <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>)}

                {renderSidebarItem('members', 'จัดการสมาชิก', <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>)}
                {renderSidebarItem('finance', 'รายการฝาก/ถอน', <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>)}
                {renderSidebarItem('bets', 'รายการโพยหวย', <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>)}
                {renderSidebarItem('results', 'ออกผล (Simple)', <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>)}
                {renderSidebarItem('settings', 'ตั้งค่าทั่วไป', <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>)}
            </nav>

            <div className="p-4 bg-[#111] border-t border-gray-800">
                <button onClick={onLogout} className="flex items-center gap-2 text-red-500 hover:text-red-400 w-full justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    {sidebarOpen && <span>ออกจากระบบ</span>}
                </button>
            </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
            
            {/* Topbar */}
            <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 z-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-gray-700">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </button>
                    <h1 className="text-xl font-bold text-gray-800 capitalize">
                        {activeTab === 'lotto-sys' ? 'จัดการระบบหวย' : activeTab === 'affiliate' ? 'ระบบพันธมิตร (Affiliate)' : activeTab === 'api-system' ? 'จัดการ API ระบบ (API Management)' : activeTab.replace('-', ' ')}
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <div className="text-sm font-bold text-gray-800">Admin Owner</div>
                        <div className="text-xs text-gray-500">Super Administrator</div>
                    </div>
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center border-2 border-[#b08528]">
                        <span className="font-bold text-[#b08528]">A</span>
                    </div>
                </div>
            </header>

            {/* Content Body */}
            <div className="flex-1 overflow-x-hidden overflow-y-auto p-6 bg-gray-100">
                
                {/* DASHBOARD */}
                {activeTab === 'dashboard' && (
                    <div className="space-y-6 animate-fade-in">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-[#b08528]">
                                <div className="text-gray-500 text-sm font-bold uppercase">ยอดฝากวันนี้</div>
                                <div className="text-3xl font-black text-gray-800 mt-2">฿ 154,200</div>
                                <div className="text-green-500 text-sm mt-1 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"></path></svg>
                                    12.5% จากเมื่อวาน
                                </div>
                            </div>
                            <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-red-500">
                                <div className="text-gray-500 text-sm font-bold uppercase">ยอดถอนวันนี้</div>
                                <div className="text-3xl font-black text-gray-800 mt-2">฿ 42,500</div>
                            </div>
                            <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-blue-500">
                                <div className="text-gray-500 text-sm font-bold uppercase">สมาชิกใหม่</div>
                                <div className="text-3xl font-black text-gray-800 mt-2">12 คน</div>
                            </div>
                            <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-green-500">
                                <div className="text-gray-500 text-sm font-bold uppercase">กำไรสุทธิ (วันนี้)</div>
                                <div className="text-3xl font-black text-gray-800 mt-2">฿ 89,400</div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                            <h3 className="font-bold text-gray-800 mb-4">� ระบบจัดการหลัก (Phase 1)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg p-6 shadow-lg text-white cursor-pointer hover:shadow-xl transition-shadow" onClick={() => onNavigate?.('admin-dashboard-v2')}>
                                    <div className="text-4xl mb-3">📊</div>
                                    <h3 className="font-bold text-lg mb-2">Dashboard Real-time</h3>
                                    <p className="text-sm text-indigo-100">ภาพรวมระบบแบบเรียลไทม์ พร้อมกราฟและสถิติ</p>
                                    <div className="mt-4 text-xs bg-white/20 rounded px-3 py-1 inline-block">✨ ใหม่!</div>
                                </div>
                                <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg p-6 shadow-lg text-white cursor-pointer hover:shadow-xl transition-shadow" onClick={() => onNavigate?.('member-management')}>
                                    <div className="text-4xl mb-3">👥</div>
                                    <h3 className="font-bold text-lg mb-2">จัดการสมาชิก</h3>
                                    <p className="text-sm text-teal-100">ดู แก้ไข ระงับบัญชี และจัดการเครดิต</p>
                                    <div className="mt-4 text-xs bg-white/20 rounded px-3 py-1 inline-block">✨ ใหม่!</div>
                                </div>
                                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg p-6 shadow-lg text-white cursor-pointer hover:shadow-xl transition-shadow" onClick={() => onNavigate?.('bet-management')}>
                                    <div className="text-4xl mb-3">📋</div>
                                    <h3 className="font-bold text-lg mb-2">จัดการโพย</h3>
                                    <p className="text-sm text-emerald-100">ดู แก้ไข ยกเลิกโพย และตรวจสอบรายละเอียด</p>
                                    <div className="mt-4 text-xs bg-white/20 rounded px-3 py-1 inline-block">✨ ใหม่!</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                            <h3 className="font-bold text-gray-800 mb-4">� ระบบจัดการขั้นสูง (Phase 2)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 shadow-lg text-white cursor-pointer hover:shadow-xl transition-shadow" onClick={() => onNavigate?.('deposit-withdrawal')}>
                                    <div className="text-4xl mb-3">💰</div>
                                    <h3 className="font-bold text-lg mb-2">ฝาก-ถอน</h3>
                                    <p className="text-sm text-blue-100">อนุมัติ/ปฏิเสธ รายการฝาก-ถอนเงิน</p>
                                    <div className="mt-4 text-xs bg-white/20 rounded px-3 py-1 inline-block">✨ ใหม่!</div>
                                </div>
                                <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg p-6 shadow-lg text-white cursor-pointer hover:shadow-xl transition-shadow" onClick={() => onNavigate?.('result-announcement')}>
                                    <div className="text-4xl mb-3">🏆</div>
                                    <h3 className="font-bold text-lg mb-2">ประกาศผล</h3>
                                    <p className="text-sm text-yellow-100">ประกาศผลรางวัลและจ่ายเงินอัตโนมัติ</p>
                                    <div className="mt-4 text-xs bg-white/20 rounded px-3 py-1 inline-block">✨ ใหม่!</div>
                                </div>
                                <div className="bg-gradient-to-br from-red-500 to-pink-500 rounded-lg p-6 shadow-lg text-white cursor-pointer hover:shadow-xl transition-shadow" onClick={() => onNavigate?.('realtime-risk')}>
                                    <div className="text-4xl mb-3">⚡</div>
                                    <h3 className="font-bold text-lg mb-2">Risk Real-time</h3>
                                    <p className="text-sm text-red-100">ติดตามความเสี่ยงแบบเรียลไทม์</p>
                                    <div className="mt-4 text-xs bg-white/20 rounded px-3 py-1 inline-block">✨ ใหม่!</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                            <h3 className="font-bold text-gray-800 mb-4">🎯 ระบบขั้นสูง (Phase 3)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                                <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg p-6 shadow-lg text-white cursor-pointer hover:shadow-xl transition-shadow" onClick={() => onNavigate?.('reports-analytics')}>
                                    <div className="text-4xl mb-3">📊</div>
                                    <h3 className="font-bold text-lg mb-2">รายงาน & Analytics</h3>
                                    <p className="text-sm text-indigo-100">วิเคราะห์ข้อมูลและสร้างรายงาน</p>
                                    <div className="mt-4 text-xs bg-white/20 rounded px-3 py-1 inline-block">✨ ใหม่!</div>
                                </div>
                                <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg p-6 shadow-lg text-white cursor-pointer hover:shadow-xl transition-shadow" onClick={() => onNavigate?.('notification-system')}>
                                    <div className="text-4xl mb-3">🔔</div>
                                    <h3 className="font-bold text-lg mb-2">ระบบแจ้งเตือน</h3>
                                    <p className="text-sm text-pink-100">แจ้งเตือนและกิจกรรมสำคัญ</p>
                                    <div className="mt-4 text-xs bg-white/20 rounded px-3 py-1 inline-block">✨ ใหม่!</div>
                                </div>
                                <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg p-6 shadow-lg text-white cursor-pointer hover:shadow-xl transition-shadow" onClick={() => onNavigate?.('advanced-features')}>
                                    <div className="text-4xl mb-3">⚡</div>
                                    <h3 className="font-bold text-lg mb-2">Advanced Features</h3>
                                    <p className="text-sm text-orange-100">ฟีเจอร์ขั้นสูงและการตั้งค่า</p>
                                    <div className="mt-4 text-xs bg-white/20 rounded px-3 py-1 inline-block">✨ ใหม่!</div>
                                </div>
                                <div className="bg-gradient-to-br from-green-500 to-teal-500 rounded-lg p-6 shadow-lg text-white cursor-pointer hover:shadow-xl transition-shadow" onClick={() => onNavigate?.('integration-settings')}>
                                    <div className="text-4xl mb-3">🔗</div>
                                    <h3 className="font-bold text-lg mb-2">การเชื่อมต่อ</h3>
                                    <p className="text-sm text-green-100">Line, SMS, Email Integration</p>
                                    <div className="mt-4 text-xs bg-white/20 rounded px-3 py-1 inline-block">🔥 HOT!</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                            <h3 className="font-bold text-gray-800 mb-4">�� เครื่องมือ Risk Management</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 shadow-lg text-white cursor-pointer hover:shadow-xl transition-shadow" onClick={() => onNavigate?.('risk-simulator')}>
                                    <div className="text-4xl mb-3">🎯</div>
                                    <h3 className="font-bold text-lg mb-2">Risk Simulator</h3>
                                    <p className="text-sm text-orange-100">ทดสอบระบบคำนวณความเสี่ยงและอัตราจ่าย</p>
                                    <div className="mt-4 text-xs bg-white/20 rounded px-3 py-1 inline-block">เครื่องมือทดสอบ</div>
                                </div>
                                <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg p-6 shadow-lg text-white cursor-pointer hover:shadow-xl transition-shadow" onClick={() => onNavigate?.('risk-logic-simulator')}>
                                    <div className="text-4xl mb-3">🧮</div>
                                    <h3 className="font-bold text-lg mb-2">Risk Logic Simulator</h3>
                                    <p className="text-sm text-pink-100">ปรับแต่งสูตรและทดสอบ Allocation แบบเรียลไทม์</p>
                                    <div className="mt-4 text-xs bg-white/20 rounded px-3 py-1 inline-block">เครื่องมือขั้นสูง</div>
                                </div>
                                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 shadow-lg text-white cursor-pointer hover:shadow-xl transition-shadow" onClick={() => onNavigate?.('bet-tracking')}>
                                    <div className="text-4xl mb-3">📊</div>
                                    <h3 className="font-bold text-lg mb-2">ตารางเก็บยอดแทง</h3>
                                    <p className="text-sm text-blue-100">ดูยอดแทงแต่ละเลขแบบ Real-time</p>
                                    <div className="mt-4 text-xs bg-white/20 rounded px-3 py-1 inline-block">เครื่องมือติดตาม</div>
                                </div>
                                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 shadow-lg text-white cursor-pointer hover:shadow-xl transition-shadow" onClick={() => onNavigate?.('bot-simulator')}>
                                    <div className="text-4xl mb-3">🤖</div>
                                    <h3 className="font-bold text-lg mb-2">Bot Simulator</h3>
                                    <p className="text-sm text-purple-100">จำลองการแทงอัตโนมัติเพื่อทดสอบ Risk</p>
                                    <div className="mt-4 text-xs bg-white/20 rounded px-3 py-1 inline-block">เครื่องมือทดสอบ AI</div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200 font-bold text-gray-800">
                                รายการล่าสุด
                            </div>
                            <div className="p-0 overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-600 font-medium">
                                        <tr>
                                            <th className="px-6 py-3">User</th>
                                            <th className="px-6 py-3">รายการ</th>
                                            <th className="px-6 py-3">จำนวน</th>
                                            <th className="px-6 py-3">เวลา</th>
                                            <th className="px-6 py-3">สถานะ</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {transactions.map((txn, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50">
                                                <td className="px-6 py-3 font-bold">{txn.user}</td>
                                                <td className="px-6 py-3 uppercase text-xs font-bold tracking-wide text-gray-500">
                                                    {txn.type === 'deposit' ? 'ฝากเงิน' : 'ถอนเงิน'}
                                                </td>
                                                <td className={`px-6 py-3 font-bold ${txn.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {txn.amount.toLocaleString()} ฿
                                                </td>
                                                <td className="px-6 py-3 text-gray-500">{txn.time}</td>
                                                <td className="px-6 py-3">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                        txn.status === 'success' ? 'bg-green-100 text-green-800' :
                                                        txn.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                        {txn.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* LOTTO MANAGEMENT (New Advanced System) */}
                {activeTab === 'lotto-sys' && (
                    <div className="animate-fade-in">
                        {/* Sub Navigation */}
                        <div className="flex gap-2 mb-6 border-b border-gray-200 pb-1 overflow-x-auto">
                            <button 
                                onClick={() => setLottoSubTab('gov')}
                                className={`px-6 py-2 font-bold rounded-t-lg transition whitespace-nowrap ${lottoSubTab === 'gov' ? 'bg-[#b08528] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                            >
                                🇹🇭 รัฐบาลไทย
                            </button>
                            <button 
                                onClick={() => setLottoSubTab('yiki')}
                                className={`px-6 py-2 font-bold rounded-t-lg transition whitespace-nowrap ${lottoSubTab === 'yiki' ? 'bg-[#b08528] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                            >
                                🏓 จับยี่กี VIP
                            </button>
                            <button 
                                onClick={() => setLottoSubTab('stock')}
                                className={`px-6 py-2 font-bold rounded-t-lg transition whitespace-nowrap ${lottoSubTab === 'stock' ? 'bg-[#b08528] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                            >
                                📈 หุ้น/ต่างประเทศ
                            </button>
                            <button 
                                onClick={() => setLottoSubTab('config')}
                                className={`px-6 py-2 font-bold rounded-t-lg transition whitespace-nowrap ${lottoSubTab === 'config' ? 'bg-[#b08528] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                            >
                                ⚙️ ตั้งค่า/คืนโพย
                            </button>
                        </div>

                        {lottoSubTab === 'gov' && renderGovManagement()}
                        {lottoSubTab === 'yiki' && renderYikiManagement()}
                        {lottoSubTab === 'stock' && renderStockManagement()}
                        {lottoSubTab === 'config' && renderConfig()}
                    </div>
                )}

                {/* API MANAGEMENT (NEW) */}
                {activeTab === 'api-system' && (
                    <div className="animate-fade-in">
                        {/* Sub Navigation */}
                        <div className="flex gap-2 mb-6 border-b border-gray-200 pb-1 overflow-x-auto">
                            <button 
                                onClick={() => setApiSubTab('lotto-api')}
                                className={`px-6 py-2 font-bold rounded-t-lg transition whitespace-nowrap ${apiSubTab === 'lotto-api' ? 'bg-[#b08528] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                            >
                                📡 API ผลรางวัล (Lotto)
                            </button>
                            <button 
                                onClick={() => setApiSubTab('bank-api')}
                                className={`px-6 py-2 font-bold rounded-t-lg transition whitespace-nowrap ${apiSubTab === 'bank-api' ? 'bg-[#b08528] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                            >
                                💳 API ธนาคาร (Banking)
                            </button>
                        </div>

                        {apiSubTab === 'lotto-api' && renderLottoApi()}
                        {apiSubTab === 'bank-api' && renderBankApi()}
                    </div>
                )}

                {/* AFFILIATE SYSTEM (NEW) */}
                {activeTab === 'affiliate' && (
                    <div className="animate-fade-in">
                        {/* Affiliate Sub Nav */}
                        <div className="flex gap-2 mb-6 border-b border-gray-200 pb-1 overflow-x-auto">
                            <button onClick={() => setAffSubTab('overview')} className={`px-6 py-2 font-bold rounded-t-lg transition whitespace-nowrap ${affSubTab === 'overview' ? 'bg-[#b08528] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>📊 ภาพรวม</button>
                            <button onClick={() => setAffSubTab('tree')} className={`px-6 py-2 font-bold rounded-t-lg transition whitespace-nowrap ${affSubTab === 'tree' ? 'bg-[#b08528] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>🌳 ผังสายงาน</button>
                            <button onClick={() => setAffSubTab('logs')} className={`px-6 py-2 font-bold rounded-t-lg transition whitespace-nowrap ${affSubTab === 'logs' ? 'bg-[#b08528] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>💰 ประวัติการจ่าย</button>
                            <button onClick={() => setAffSubTab('fraud')} className={`px-6 py-2 font-bold rounded-t-lg transition whitespace-nowrap ${affSubTab === 'fraud' ? 'bg-red-600 text-white' : 'bg-white text-red-600 hover:bg-red-50'}`}>🕵️ ระบบจับโกง</button>
                            <button onClick={() => setAffSubTab('rates')} className={`px-6 py-2 font-bold rounded-t-lg transition whitespace-nowrap ${affSubTab === 'rates' ? 'bg-[#b08528] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>⚙️ ตั้งค่าเรท</button>
                        </div>

                        {affSubTab === 'overview' && renderAffOverview()}
                        {affSubTab === 'tree' && renderAffTree()}
                        {affSubTab === 'logs' && renderAffLogs()}
                        {affSubTab === 'fraud' && renderAffFraud()}
                        {affSubTab === 'rates' && renderAffRates()}
                    </div>
                )}

                {/* MEMBERS */}
                {activeTab === 'members' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                            <h2 className="text-lg font-bold">รายชื่อสมาชิกทั้งหมด</h2>
                            <div className="flex gap-2">
                                <input type="text" placeholder="ค้นหา Username / เบอร์โทร" className="border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#b08528]" />
                                <button className="bg-[#b08528] text-white px-4 py-1.5 rounded text-sm font-bold shadow hover:bg-[#8f6b1f]">ค้นหา</button>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-800 text-white font-medium">
                                    <tr>
                                        <th className="px-6 py-3">ID</th>
                                        <th className="px-6 py-3">Username</th>
                                        <th className="px-6 py-3 text-right">Credit</th>
                                        <th className="px-6 py-3 text-center">Status</th>
                                        <th className="px-6 py-3">Registered</th>
                                        <th className="px-6 py-3 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-gray-500">#{user.id}</td>
                                            <td className="px-6 py-4 font-bold text-[#b08528]">{user.username}</td>
                                            <td className="px-6 py-4 text-right font-mono font-bold">{user.credit.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">{user.registered}</td>
                                            <td className="px-6 py-4 text-center flex justify-center gap-2">
                                                <button className="text-blue-600 hover:underline">แก้ไข</button>
                                                <button className="text-gray-400">|</button>
                                                <button className="text-green-600 hover:underline">เติมเครดิต</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* FINANCE (Deposit / Withdraw) */}
                {activeTab === 'finance' && (
                    <div className="space-y-6 animate-fade-in">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             {/* Deposits */}
                             <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
                                 <div className="px-4 py-3 border-b border-gray-200 bg-green-50 flex justify-between items-center">
                                     <h3 className="font-bold text-green-800 flex items-center gap-2">
                                         <span className="w-2 h-2 bg-green-500 rounded-full"></span> รายการฝาก (รออนุมัติ)
                                     </h3>
                                     <span className="bg-green-200 text-green-800 text-xs px-2 py-0.5 rounded-full font-bold">1</span>
                                 </div>
                                 <div className="p-0">
                                     {transactions.filter(t => t.type === 'deposit' && t.status === 'pending').length === 0 ? (
                                         <div className="p-8 text-center text-gray-400">ไม่มีรายการค้าง</div>
                                     ) : (
                                        transactions.filter(t => t.type === 'deposit' && t.status === 'pending').map((txn, i) => (
                                            <div key={i} className="p-4 border-b border-gray-100 flex justify-between items-center hover:bg-gray-50">
                                                <div>
                                                    <div className="font-bold text-gray-800">{txn.user}</div>
                                                    <div className="text-xs text-gray-500">{txn.bank} • {txn.time}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-bold text-green-600">+{txn.amount.toLocaleString()}</div>
                                                    <div className="flex gap-2 mt-1">
                                                        <button className="bg-green-500 text-white text-xs px-2 py-1 rounded hover:bg-green-600">อนุมัติ</button>
                                                        <button className="bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600">ยกเลิก</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                     )}
                                 </div>
                             </div>

                             {/* Withdrawals */}
                             <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
                                 <div className="px-4 py-3 border-b border-gray-200 bg-red-50 flex justify-between items-center">
                                     <h3 className="font-bold text-red-800 flex items-center gap-2">
                                         <span className="w-2 h-2 bg-red-500 rounded-full"></span> รายการถอน (รออนุมัติ)
                                     </h3>
                                     <span className="bg-red-200 text-red-800 text-xs px-2 py-0.5 rounded-full font-bold">1</span>
                                 </div>
                                 <div className="p-0">
                                     {transactions.filter(t => t.type === 'withdraw' && t.status === 'pending').map((txn, i) => (
                                        <div key={i} className="p-4 border-b border-gray-100 flex justify-between items-center hover:bg-gray-50">
                                            <div>
                                                <div className="font-bold text-gray-800">{txn.user}</div>
                                                <div className="text-xs text-gray-500">{txn.bank} • {txn.time}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-red-600">-{txn.amount.toLocaleString()}</div>
                                                <div className="flex gap-2 mt-1">
                                                    <button className="bg-green-500 text-white text-xs px-2 py-1 rounded hover:bg-green-600">โอนแล้ว</button>
                                                    <button className="bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600">ปฏิเสธ</button>
                                                </div>
                                            </div>
                                        </div>
                                     ))}
                                 </div>
                             </div>
                         </div>
                    </div>
                )}

                {/* BETS */}
                {activeTab === 'bets' && (
                     <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="font-bold text-gray-800">รายการโพยหวยล่าสุด</h2>
                            <button className="text-sm text-blue-600 hover:underline">ดูทั้งหมด</button>
                        </div>
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-600 font-medium">
                                <tr>
                                    <th className="px-6 py-3">ID</th>
                                    <th className="px-6 py-3">User</th>
                                    <th className="px-6 py-3">ประเภทหวย</th>
                                    <th className="px-6 py-3">เลข/ประเภท</th>
                                    <th className="px-6 py-3 text-right">จำนวนเงิน</th>
                                    <th className="px-6 py-3 text-center">สถานะ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {bets.map((bet) => (
                                    <tr key={bet.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-3 text-gray-500">{bet.id}</td>
                                        <td className="px-6 py-3 font-bold">{bet.user}</td>
                                        <td className="px-6 py-3">
                                            <div>{bet.lotto}</div>
                                            <div className="text-xs text-gray-400">รอบ: {bet.round}</div>
                                        </td>
                                        <td className="px-6 py-3">
                                            <span className="font-bold text-lg tracking-widest">{bet.numbers}</span>
                                            <span className="text-xs text-gray-500 ml-2">({bet.type})</span>
                                        </td>
                                        <td className="px-6 py-3 text-right font-bold">{bet.amount}</td>
                                        <td className="px-6 py-3 text-center">
                                            {bet.status === 'win' && <span className="bg-green-500 text-white px-2 py-0.5 rounded text-xs font-bold">ชนะ</span>}
                                            {bet.status === 'loss' && <span className="bg-red-500 text-white px-2 py-0.5 rounded text-xs font-bold">แพ้</span>}
                                            {bet.status === 'pending' && <span className="bg-yellow-400 text-white px-2 py-0.5 rounded text-xs font-bold">รอผล</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* RESULTS (Simple) */}
                {activeTab === 'results' && (
                    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">คีย์ผลรางวัล (โหมดด่วน)</h2>
                            <p className="text-sm text-gray-500 mb-4">* แนะนำให้ใช้เมนู "จัดการระบบหวย" เพื่อความแม่นยำสูงสุด</p>
                            
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">เลือกหวย</label>
                                <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#b08528] outline-none">
                                    <option>จับยี่กี VIP - รอบที่ 46</option>
                                    <option>หวยฮานอย (ปกติ)</option>
                                    <option>หวยลาว</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">3 ตัวบน</label>
                                    <input type="text" maxLength={3} className="w-full text-center text-2xl tracking-[0.5em] border border-gray-300 rounded px-3 py-2 focus:border-[#b08528] outline-none font-bold" placeholder="000" />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">2 ตัวล่าง</label>
                                    <input type="text" maxLength={2} className="w-full text-center text-2xl tracking-[0.5em] border border-gray-300 rounded px-3 py-2 focus:border-[#b08528] outline-none font-bold" placeholder="00" />
                                </div>
                            </div>

                            <Button onClick={() => alert('บันทึกผลสำเร็จ (Demo)')}>บันทึกผลรางวัล</Button>
                        </div>
                    </div>
                )}
                
                {/* SETTINGS (Legacy) */}
                {activeTab === 'settings' && (
                     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center animate-fade-in">
                         <div className="text-6xl mb-4">⚙️</div>
                         <h2 className="text-xl font-bold text-gray-800">ตั้งค่าระบบทั่วไป</h2>
                         <p className="text-gray-500">กรุณาไปที่เมนู "จัดการระบบหวย {'>'} ตั้งค่า/คืนโพย" สำหรับการตั้งค่าเชิงลึก</p>
                     </div>
                )}

            </div>
        </main>
    </div>
  );
};