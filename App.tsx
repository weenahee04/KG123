import React, { useState } from 'react';
import { Input } from './components/Input';
import { Button } from './components/Button';
import { Captcha } from './components/Captcha';
import { Dashboard } from './pages/Dashboard';
import { LandingPage } from './pages/LandingPage';
import { Register } from './pages/Register';
import { AddBankAccount } from './pages/AddBankAccount';
import { Profile } from './pages/Profile';
import { Help } from './pages/Help';
import { Affiliate } from './pages/Affiliate';
import { Deposit } from './pages/Deposit';
import { Withdraw } from './pages/Withdraw';
import { Betting } from './pages/Betting';
import { Results } from './pages/Results';
import { Contact } from './pages/Contact';
import { Poy } from './pages/Poy';
import { Jackpot } from './pages/Jackpot';
import { Games } from './pages/Games';
import { NumberSets } from './pages/NumberSets';
import { InviteFriend } from './pages/InviteFriend';
import { AdminDashboard } from './pages/AdminDashboard';
import { RiskSimulator } from './pages/RiskSimulator';
import { RiskLogicSimulator } from './pages/RiskLogicSimulator';
import { BetTrackingGrid } from './pages/BetTrackingGrid';
import { BotSimulator } from './pages/BotSimulator';
import AdminDashboardV2 from './pages/AdminDashboardV2';
import MemberManagement from './pages/MemberManagement';
import BetManagement from './pages/BetManagement';
import DepositWithdrawal from './pages/DepositWithdrawal';
import ResultAnnouncement from './pages/ResultAnnouncement';
import RealTimeRisk from './pages/RealTimeRisk';
import ReportsAnalytics from './pages/ReportsAnalytics';
import NotificationSystem from './pages/NotificationSystem';
import AdvancedFeatures from './pages/AdvancedFeatures';
import IntegrationSettings from './pages/IntegrationSettings';
import ModernAdminLayout from './pages/ModernAdminLayout';
import CleanAdminLayout from './pages/CleanAdminLayout';
import SidebarAdminLayout from './pages/SidebarAdminLayout';
import LotteryRoundManagement from './pages/LotteryRoundManagement';
import LotterySettings from './pages/LotterySettings';
import AgentManagement from './pages/AgentManagement';
import BankAccountManagement from './pages/BankAccountManagement';
import AdminRoleManagement from './pages/AdminRoleManagement';
import FraudDetection from './pages/FraudDetection';
import SystemSettings from './pages/SystemSettings';
import LotteryNumberGrid from './pages/LotteryNumberGrid';
import RiskManagementSystem from './pages/RiskManagementSystem';
import EnhancedAdminDashboard from './pages/EnhancedAdminDashboard';
import EnhancedRiskManagement from './pages/EnhancedRiskManagement';
import LotteryOperations from './pages/LotteryOperations';
import { PageView } from './types';

function App() {
  const [page, setPage] = useState<PageView>('landing');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Login Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      alert('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
      return;
    }

    // Backdoor for admin (Demo purpose)
    if (username === 'admin' && password === 'admin') {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setPage('clean-admin');
        }, 1000);
        return;
    }

    setIsLoading(true);

    // Mock Authentication Delay
    setTimeout(() => {
      setIsLoading(false);
      setPage('dashboard');
    }, 1500);
  };

  const handleLogout = () => {
    setUsername('');
    setPassword('');
    setPage('landing');
  };

  const handleRegisterSuccess = (user: string, pass: string) => {
      // Auto login after register
      setUsername(user);
      setPassword(pass);
      // Redirect to Add Bank account first as per typical flow
      setPage('add-bank');
  };

  // Router Switch
  switch (page) {
      case 'dashboard':
          return <Dashboard username={username} onLogout={handleLogout} onNavigate={setPage} />;
      case 'register':
          return <Register onBack={() => setPage('landing')} onRegisterSuccess={handleRegisterSuccess} />;
      case 'add-bank':
          return <AddBankAccount onBack={() => setPage('dashboard')} username={username} />;
      case 'profile':
          return <Profile onBack={() => setPage('dashboard')} username={username} />;
      case 'affiliate':
          return <Affiliate onBack={() => setPage('dashboard')} username={username} />;
      case 'invite_friend':
          return <InviteFriend onBack={() => setPage('dashboard')} username={username} />;
      case 'deposit':
          return <Deposit onBack={() => setPage('dashboard')} />;
      case 'withdraw':
          return <Withdraw onBack={() => setPage('dashboard')} />;
      case 'betting':
          return <Betting onBack={() => setPage('dashboard')} />;
      case 'results':
          return <Results onBack={() => setPage('dashboard')} />;
      case 'contact':
          return <Contact onBack={() => setPage('dashboard')} />;
      case 'poy':
          return <Poy onBack={() => setPage('dashboard')} />;
      case 'jackpot':
          return <Jackpot onBack={() => setPage('dashboard')} />;
      case 'games':
          return <Games onBack={() => setPage('dashboard')} />;
      case 'number-sets':
          return <NumberSets onBack={() => setPage('dashboard')} />;
      case 'admin':
          return <AdminDashboard onLogout={handleLogout} onNavigate={setPage} />;
      case 'admin-dashboard-v2':
          return <SidebarAdminLayout onNavigate={setPage} onLogout={handleLogout}><AdminDashboardV2 /></SidebarAdminLayout>;
      case 'enhanced-admin-dashboard':
          return <SidebarAdminLayout onNavigate={setPage} onLogout={handleLogout}><EnhancedAdminDashboard /></SidebarAdminLayout>;
      case 'member-management':
          return <SidebarAdminLayout onNavigate={setPage} onLogout={handleLogout}><MemberManagement /></SidebarAdminLayout>;
      case 'bet-management':
          return <SidebarAdminLayout onNavigate={setPage} onLogout={handleLogout}><BetManagement /></SidebarAdminLayout>;
      case 'deposit-withdrawal':
          return <SidebarAdminLayout onNavigate={setPage} onLogout={handleLogout}><DepositWithdrawal /></SidebarAdminLayout>;
      case 'result-announcement':
          return <SidebarAdminLayout onNavigate={setPage} onLogout={handleLogout}><ResultAnnouncement /></SidebarAdminLayout>;
      case 'realtime-risk':
          return <SidebarAdminLayout onNavigate={setPage} onLogout={handleLogout}><RealTimeRisk /></SidebarAdminLayout>;
      case 'reports-analytics':
          return <SidebarAdminLayout onNavigate={setPage} onLogout={handleLogout}><ReportsAnalytics /></SidebarAdminLayout>;
      case 'notification-system':
          return <SidebarAdminLayout onNavigate={setPage} onLogout={handleLogout}><NotificationSystem /></SidebarAdminLayout>;
      case 'advanced-features':
          return <SidebarAdminLayout onNavigate={setPage} onLogout={handleLogout}><AdvancedFeatures /></SidebarAdminLayout>;
      case 'integration-settings':
          return <SidebarAdminLayout onNavigate={setPage} onLogout={handleLogout}><IntegrationSettings /></SidebarAdminLayout>;
      case 'lottery-rounds':
          return <SidebarAdminLayout onNavigate={setPage} onLogout={handleLogout}><LotteryRoundManagement /></SidebarAdminLayout>;
      case 'lottery-operations':
          return <SidebarAdminLayout onNavigate={setPage} onLogout={handleLogout}><LotteryOperations /></SidebarAdminLayout>;
      case 'lottery-settings':
          return <SidebarAdminLayout onNavigate={setPage} onLogout={handleLogout}><LotterySettings /></SidebarAdminLayout>;
      case 'agent-management':
          return <SidebarAdminLayout onNavigate={setPage} onLogout={handleLogout}><AgentManagement /></SidebarAdminLayout>;
      case 'bank-accounts':
          return <SidebarAdminLayout onNavigate={setPage} onLogout={handleLogout}><BankAccountManagement /></SidebarAdminLayout>;
      case 'admin-roles':
          return <SidebarAdminLayout onNavigate={setPage} onLogout={handleLogout}><AdminRoleManagement /></SidebarAdminLayout>;
      case 'fraud-detection':
          return <SidebarAdminLayout onNavigate={setPage} onLogout={handleLogout}><FraudDetection /></SidebarAdminLayout>;
      case 'system-settings':
        return (
          <SidebarAdminLayout onNavigate={setPage} onLogout={handleLogout}>
            <SystemSettings />
          </SidebarAdminLayout>
        );
      case 'lottery-number-grid':
        return (
          <SidebarAdminLayout onNavigate={setPage} onLogout={handleLogout}>
            <LotteryNumberGrid />
          </SidebarAdminLayout>
        );
      case 'risk-management-system':
        return (
          <SidebarAdminLayout onNavigate={setPage} onLogout={handleLogout}>
            <RiskManagementSystem />
          </SidebarAdminLayout>
        );
      case 'enhanced-risk-management':
        return (
          <SidebarAdminLayout onNavigate={setPage} onLogout={handleLogout}>
            <EnhancedRiskManagement />
          </SidebarAdminLayout>
        );
      case 'modern-admin':
          return <ModernAdminLayout onNavigate={setPage} onLogout={handleLogout} />;
      case 'clean-admin':
          return <SidebarAdminLayout onNavigate={setPage} onLogout={handleLogout} />;
      case 'risk-simulator':
          return <RiskSimulator onBack={() => setPage('landing')} />;
      case 'bet-tracking':
          return <BetTrackingGrid onBack={() => setPage('admin')} />;
      case 'bot-simulator':
          return <BotSimulator onBack={() => setPage('admin')} />;
      case 'risk-logic-simulator':
          return <RiskLogicSimulator onBack={() => setPage('admin')} />;
      case 'help':
          // Contextual back button
          return <Help onBack={() => username ? setPage('dashboard') : setPage('landing')} />;
      case 'landing':
      default:
          return (
            <LandingPage 
              onRegister={() => setPage('register')}
              onHelp={() => setPage('help')}
              username={username}
              setUsername={setUsername}
              password={password}
              setPassword={setPassword}
              onLogin={handleLogin}
              onGoAdmin={() => setPage('admin')}
              onRiskSimulator={() => setPage('risk-simulator')}
            />
          );
  }
}

export default App;
