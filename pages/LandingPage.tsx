import React from 'react';

interface LandingPageProps {
  onRegister: () => void;
  onLogin: (e: React.FormEvent) => void;
  onHelp: () => void;
  username: string;
  setUsername: (s: string) => void;
  password: string;
  setPassword: (s: string) => void;
  onGoAdmin?: () => void;
  onRiskSimulator?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onRegister, 
  onLogin, 
  onHelp,
  username, 
  setUsername, 
  password, 
  setPassword,
  onGoAdmin,
  onRiskSimulator
}) => {
  return (
    <div className="min-h-screen bg-[#111] font-sans text-white pb-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
      
      {/* 1. Gold Header Bar */}
      <header className="bg-gradient-to-b from-[#eebf34] via-[#d4a017] to-[#b08528] h-[50px] shadow-md relative z-50">
        <div className="max-w-[1200px] mx-auto px-2 sm:px-4 h-full flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center border border-gold-300 shadow-sm">
                <span className="text-[#eebf34] font-serif font-bold text-xl">B</span>
            </div>
            <span className="text-black font-black text-2xl tracking-tight drop-shadow-sm font-sans">บ้านหวย</span>
          </div>

          {/* Top Right Buttons */}
          <div className="flex gap-2">
            <button className="flex items-center gap-1 bg-white text-[#333] px-3 py-1 rounded shadow-sm text-sm font-bold hover:bg-gray-100 transition">
              <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20"><path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"></path><path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2h-1z"></path></svg>
              ติดต่อเรา
            </button>
            <button 
                onClick={onRegister}
                className="flex items-center gap-1 bg-[#233142] text-white px-3 py-1 rounded shadow-sm text-sm font-bold hover:bg-[#34495e] transition"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"></path></svg>
              สมัครสมาชิก
            </button>
          </div>
        </div>
      </header>

      {/* 2. Login Bar (Black Box with Gold Border) */}
      <div className="max-w-[1200px] mx-auto px-2 sm:px-4 mt-6">
        <div className="bg-[#1a1a1a] border-2 border-[#bfa15f] rounded-lg p-3 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
            
            <form onSubmit={onLogin} className="flex flex-col lg:flex-row items-center gap-3 relative z-10">
                <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                        </div>
                        <input 
                            type="text" 
                            placeholder="ชื่อผู้ใช้" 
                            className="w-full pl-9 pr-3 py-1.5 rounded bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#bfa15f]"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path></svg>
                        </div>
                        <input 
                            type="password" 
                            placeholder="รหัสผ่าน" 
                            className="w-full pl-9 pr-3 py-1.5 rounded bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#bfa15f]"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-white whitespace-nowrap">
                    <label className="flex items-center gap-1 cursor-pointer select-none">
                        <input type="checkbox" className="rounded border-gray-600 bg-gray-700 text-[#bfa15f] focus:ring-[#bfa15f]" />
                        จำฉันไว้ในระบบ
                    </label>
                    <a href="#" className="flex items-center gap-1 text-[#bfa15f] hover:underline">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path></svg>
                        ลืมรหัสผ่าน
                    </a>
                </div>

                <div className="hidden sm:flex items-center bg-white rounded px-2 py-1.5 gap-2 cursor-pointer">
                    <img src="https://flagcdn.com/w40/th.png" className="w-5 h-auto rounded-sm" alt="TH" />
                    <span className="text-gray-800 text-sm font-medium">ไทย</span>
                    <svg className="w-3 h-3 text-gray-500 ml-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </div>

                <div className="flex-1"></div>

                <div className="flex gap-2 w-full lg:w-auto">
                     <button 
                        type="button" 
                        onClick={onRegister}
                        className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-[#374151] hover:bg-[#4b5563] text-white px-4 py-1.5 rounded border border-gray-600 text-sm font-medium transition"
                     >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M8 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                        สมัครสมาชิก
                     </button>
                     <button 
                        type="submit"
                        className="flex-1 lg:flex-none bg-gradient-to-b from-[#eebf34] to-[#b08528] hover:from-[#fcd34d] hover:to-[#ca8a04] text-[#3e2e04] px-6 py-1.5 rounded shadow-[0_2px_5px_rgba(0,0,0,0.3)] text-sm font-bold border border-[#bfa15f] transition transform active:scale-95"
                     >
                        เข้าสู่ระบบ
                     </button>
                </div>
            </form>
        </div>
      </div>

      {/* 3. Jackpot Section */}
      <div className="max-w-[1200px] mx-auto px-2 sm:px-4 mt-4">
         <div className="bg-[#1f1f1f] border border-[#bfa15f]/50 rounded px-4 py-3 flex flex-col md:flex-row justify-between items-center shadow-md">
            <div className="flex items-center gap-2">
                 <span className="text-white text-lg font-serif italic tracking-wider shadow-black drop-shadow-md">Jackpot สะสม</span>
                 <span className="text-[#eebf34] text-2xl font-black font-mono tracking-widest drop-shadow-[0_0_5px_rgba(238,191,52,0.6)]">1,000,000</span>
            </div>
            <div className="flex gap-4 text-sm mt-2 md:mt-0">
                <a href="#" className="text-gray-300 hover:text-white transition">อัตราจ่าย</a>
                <span className="text-gray-600">|</span>
                <span className="text-gray-300 hover:text-white transition cursor-pointer" onClick={onHelp}>กฎและกติกา</span>
            </div>
         </div>
      </div>

      {/* 4. Banner Section */}
      <div className="max-w-[1200px] mx-auto px-2 sm:px-4 mt-4">
         <div className="w-full aspect-[21/6] bg-gray-800 rounded-lg overflow-hidden shadow-xl border border-gray-800 relative group cursor-pointer">
             <img 
                src="https://placehold.co/1200x350/111/eebf34?text=Baan+Huay+Promotion" 
                alt="Banner" 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
             />
         </div>
      </div>

      {/* 6. Main Lotto Results Section (Yi Ki, Govt, BAAC) */}
      <div className="max-w-[1200px] mx-auto px-2 sm:px-4 mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Yi Ki VIP Top */}
          <div className="bg-[#e8e8e8] rounded-lg border-2 border-[#eebf34] p-1 shadow-sm">
              <div className="flex items-center gap-2 mb-2 px-2 pt-1">
                  <span className="text-[#b08528]">💎</span>
                  <span className="text-[#b08528] font-bold text-sm">จับยี่กี VIP - รอบที่ 33</span>
                  <span className="bg-[#b08528] text-white text-xs px-2 py-0.5 rounded">18 January 2026</span>
              </div>
              <div className="grid grid-cols-2 gap-2 p-2 bg-gray-50 rounded">
                  <div className="bg-white border border-[#eebf34]/30 rounded p-2 text-center">
                      <div className="text-[#b08528] text-xs mb-1">3ตัวบน</div>
                      <div className="text-xl font-bold text-gray-800">XXX</div>
                  </div>
                  <div className="bg-white border border-[#eebf34]/30 rounded p-2 text-center">
                      <div className="text-[#b08528] text-xs mb-1">2ตัวล่าง</div>
                      <div className="text-xl font-bold text-gray-800">XX</div>
                  </div>
              </div>
          </div>

          {/* Government Lotto */}
          <div className="bg-white rounded-lg border border-gray-300 p-1 shadow-sm">
              <div className="flex items-center gap-2 mb-2 px-2 pt-1 bg-gray-100 rounded-t py-1">
                  <img src="https://flagcdn.com/w40/th.png" alt="TH" className="w-6 h-4 shadow-sm" />
                  <span className="text-black font-bold text-sm">หวยรัฐบาล</span>
                  <span className="bg-[#333] text-white text-xs px-2 py-0.5 rounded">17 January 2026</span>
              </div>
              <div className="p-2 space-y-2">
                  <div className="bg-white border border-gray-300 rounded p-2 text-center">
                      <div className="text-2xl font-bold text-gray-800 tracking-widest">878972</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                      <div className="bg-white border border-gray-300 rounded p-1 text-center">
                          <div className="text-[#b08528] text-xs mb-1">3ตัวหน้า</div>
                          <div className="text-sm font-bold text-gray-800">299, 815</div>
                      </div>
                      <div className="bg-white border border-gray-300 rounded p-1 text-center">
                          <div className="text-[#b08528] text-xs mb-1">3ตัวล่าง</div>
                          <div className="text-sm font-bold text-gray-800">662, 363</div>
                      </div>
                      <div className="bg-white border border-gray-300 rounded p-1 text-center">
                          <div className="text-[#b08528] text-xs mb-1">2ตัวล่าง</div>
                          <div className="text-sm font-bold text-gray-800">02</div>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* BAAC Lotto (Full Width) */}
      <div className="max-w-[1200px] mx-auto px-2 sm:px-4 mt-4">
          <div className="bg-white rounded-lg border border-gray-300 p-1 shadow-sm">
              <div className="flex items-center gap-2 mb-2 px-2 pt-1 bg-gray-100 rounded-t py-1">
                  <div className="w-6 h-4 bg-blue-900 rounded-sm"></div>
                  <span className="text-black font-bold text-sm">หวย ธกส.</span>
                  <span className="bg-[#333] text-white text-xs px-2 py-0.5 rounded">17 January 2026</span>
              </div>
              <div className="p-2 space-y-2">
                  <div className="bg-white border border-gray-300 rounded p-2 text-center">
                      <div className="text-[#b08528] text-xs mb-1">เลขที่ออก</div>
                      <div className="text-2xl font-bold text-gray-800 tracking-widest">5389559</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white border border-gray-300 rounded p-2 text-center">
                          <div className="text-[#b08528] text-xs mb-1">3ตัวบน</div>
                          <div className="text-xl font-bold text-gray-800">559</div>
                      </div>
                      <div className="bg-white border border-gray-300 rounded p-2 text-center">
                          <div className="text-[#b08528] text-xs mb-1">2ตัวล่าง</div>
                          <div className="text-xl font-bold text-gray-800">89</div>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* 7. Foreign Stock / Index Lottery Grid */}
      <div className="max-w-[1200px] mx-auto px-2 sm:px-4 mt-4">
         <div className="flex items-center gap-2 mb-2">
             <span className="text-white text-sm">⭐ ผลหุ้นต่างประเทศ</span>
             <span className="bg-[#333] text-white text-xs px-2 py-0.5 rounded">18 January 2026</span>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {stockLottoData.map((lotto, idx) => (
               <div key={idx} className="bg-white rounded border border-gray-300 overflow-hidden shadow-sm flex flex-col">
                  {/* Header */}
                  <div className="flex items-center gap-2 px-2 py-1.5 border-b border-gray-100">
                      {lotto.flag}
                      <span className="text-[#b08528] text-sm font-bold truncate">{lotto.name}</span>
                  </div>
                  {/* Results */}
                  <div className="grid grid-cols-2 h-full">
                      <div className="flex flex-col items-center justify-center p-2 border-r border-gray-100">
                          <span className="text-[10px] text-gray-500 mb-1">3ตัวบน</span>
                          <span className="text-gray-800 font-bold text-lg">{lotto.top3}</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-2">
                          <span className="text-[10px] text-gray-500 mb-1">2ตัวล่าง</span>
                          <span className="text-gray-800 font-bold text-lg">{lotto.bottom2}</span>
                      </div>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* 8. Yi Ki VIP Round History Grid */}
      <div className="max-w-[1200px] mx-auto px-2 sm:px-4 mt-8">
         <div className="flex items-center gap-2 mb-2">
             <span className="text-[#eebf34]">💎</span>
             <span className="text-white text-sm font-bold">จับยี่กี VIP</span>
             <span className="bg-[#333] text-white text-xs px-2 py-0.5 rounded">18 January 2026</span>
         </div>
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
             {yiKiRounds.map((round) => (
                 <div key={round.id} className="bg-white rounded border border-gray-300 shadow-sm overflow-hidden text-center">
                     <div className="bg-gray-50 border-b border-gray-200 py-1 px-2">
                         <span className="text-[#b08528] text-xs font-bold">ยี่กี VIP - รอบที่ {round.id}</span>
                     </div>
                     <div className="grid grid-cols-2">
                         <div className="p-2 border-r border-gray-200">
                             <div className="text-[9px] text-gray-400 mb-0.5">3ตัวบน</div>
                             <div className="text-sm font-bold text-gray-700">{round.top}</div>
                         </div>
                         <div className="p-2">
                             <div className="text-[9px] text-gray-400 mb-0.5">2ตัวล่าง</div>
                             <div className="text-sm font-bold text-gray-700">{round.bottom}</div>
                         </div>
                     </div>
                 </div>
             ))}
         </div>
      </div>

      {/* Footer copyright */}
      <div className="text-center text-gray-600 text-xs py-8 mt-8 border-t border-gray-800 relative group">
           <p>SECURE WEBSITE 🔒 GUARANTEED 100%</p>
           <p className="mt-1">© 2026 Copyright • บ้านหวย ALL RIGHTS RESERVED.</p>
           <p className="mt-1">
               <span className="text-[#b08528] cursor-pointer hover:underline" onClick={onHelp}>กฎกติกา</span> • <span className="text-[#b08528] cursor-pointer hover:underline">ติดต่อเรา</span>
           </p>
           {/* Secret Admin Entry */}
           {onGoAdmin && (
             <div onClick={onGoAdmin} className="absolute bottom-2 right-2 w-4 h-4 opacity-0 hover:opacity-100 cursor-pointer text-gray-800" title="Admin">⚙️</div>
           )}
           {/* Risk Simulator Entry */}
           {onRiskSimulator && (
             <div onClick={onRiskSimulator} className="absolute bottom-2 right-12 px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded cursor-pointer text-xs font-bold shadow-lg transition" title="Risk Simulator">🎯 Risk Simulator</div>
           )}
      </div>

    </div>
  );
};

// Mock Data for Stock Lotteries
const stockLottoData = [
    { name: 'หุ้นเกาหลี', flag: <img src="https://flagcdn.com/w40/kr.png" className="w-5 shadow-sm" />, top3: 'XXX', bottom2: 'XX' },
    { name: 'นิเคอิเช้า', flag: <img src="https://flagcdn.com/w40/jp.png" className="w-5 shadow-sm" />, top3: 'XXX', bottom2: 'XX' },
    { name: 'นิเคอิเช้า II', flag: <img src="https://flagcdn.com/w40/jp.png" className="w-5 shadow-sm" />, top3: 'XXX', bottom2: 'XX' },
    { name: 'จีนเช้า', flag: <img src="https://flagcdn.com/w40/cn.png" className="w-5 shadow-sm" />, top3: 'XXX', bottom2: 'XX' },
    { name: 'ฮั่งเส็งเช้า', flag: <img src="https://flagcdn.com/w40/hk.png" className="w-5 shadow-sm" />, top3: 'XXX', bottom2: 'XX' },
    { name: 'ฮั่งเส็งเช้า II', flag: <img src="https://flagcdn.com/w40/hk.png" className="w-5 shadow-sm" />, top3: 'XXX', bottom2: 'XX' },
    { name: 'หุ้นไต้หวัน', flag: <img src="https://flagcdn.com/w40/tw.png" className="w-5 shadow-sm" />, top3: 'XXX', bottom2: 'XX' },
    { name: 'หุ้นสิงคโปร์', flag: <img src="https://flagcdn.com/w40/sg.png" className="w-5 shadow-sm" />, top3: 'XXX', bottom2: 'XX' },
    { name: 'หุ้นอียิปต์', flag: <img src="https://flagcdn.com/w40/eg.png" className="w-5 shadow-sm" />, top3: 'XXX', bottom2: 'XX' },
    { name: 'หุ้นเยอรมัน', flag: <img src="https://flagcdn.com/w40/de.png" className="w-5 shadow-sm" />, top3: 'XXX', bottom2: 'XX' },
    { name: 'หุ้นอังกฤษ', flag: <img src="https://flagcdn.com/w40/gb.png" className="w-5 shadow-sm" />, top3: 'XXX', bottom2: 'XX' },
    { name: 'หุ้นรัสเซีย', flag: <img src="https://flagcdn.com/w40/ru.png" className="w-5 shadow-sm" />, top3: 'XXX', bottom2: 'XX' },
    { name: 'หุ้นอินเดีย', flag: <img src="https://flagcdn.com/w40/in.png" className="w-5 shadow-sm" />, top3: 'XXX', bottom2: 'XX' },
    { name: 'หุ้นดาวโจนส์', flag: <img src="https://flagcdn.com/w40/us.png" className="w-5 shadow-sm" />, top3: 'XXX', bottom2: 'XX' },
    { name: 'หวยมาเลย์', flag: <img src="https://flagcdn.com/w40/my.png" className="w-5 shadow-sm" />, top3: 'XXX', bottom2: 'XX' },
    { name: 'หวยลาว', flag: <img src="https://flagcdn.com/w40/la.png" className="w-5 shadow-sm" />, top3: 'XXX', bottom2: 'XX' },
    { name: 'หวยลาว Super', flag: <img src="https://flagcdn.com/w40/la.png" className="w-5 shadow-sm" />, top3: 'XXX', bottom2: 'XX' },
    { name: 'หวยเวียดนาม/ฮานอย', flag: <img src="https://flagcdn.com/w40/vn.png" className="w-5 shadow-sm" />, top3: 'XXX', bottom2: 'XX' },
    { name: 'หวยเวียดนาม/ฮานอยพิเศษ', flag: <img src="https://flagcdn.com/w40/vn.png" className="w-5 shadow-sm" />, top3: 'XXX', bottom2: 'XX' },
    { name: 'หวยเวียดนาม/ฮานอย VIP', flag: <img src="https://flagcdn.com/w40/vn.png" className="w-5 shadow-sm" />, top3: 'XXX', bottom2: 'XX' },
];

// Mock Data for Yi Ki Rounds (33 to 1)
const yiKiRounds = Array.from({ length: 33 }, (_, i) => ({
    id: 33 - i,
    top: Math.floor(Math.random() * 900 + 100), // Random 3 digits
    bottom: Math.floor(Math.random() * 90 + 10) // Random 2 digits
}));