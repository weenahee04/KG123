export default function Home() {
  return (
    <div style={{ 
      fontFamily: 'system-ui, sans-serif', 
      maxWidth: '800px', 
      margin: '50px auto', 
      padding: '20px',
      lineHeight: '1.6'
    }}>
      <h1>🎰 Lottery Backend API</h1>
      <p>Backend server is running successfully!</p>
      
      <h2>📋 Available API Endpoints:</h2>
      
      <h3>Dashboard APIs:</h3>
      <ul>
        <li><a href="/api/dashboard/stats">/api/dashboard/stats</a> - Get dashboard statistics</li>
        <li><a href="/api/dashboard/actions">/api/dashboard/actions</a> - Get pending actions</li>
        <li><a href="/api/dashboard/health">/api/dashboard/health</a> - System health check</li>
      </ul>

      <h3>Risk Management APIs:</h3>
      <ul>
        <li>/api/risk/numbers - Get risk numbers</li>
        <li>/api/risk/config - Get/Update risk configuration</li>
        <li>/api/risk/close - Close a number</li>
        <li>/api/risk/open - Open a number</li>
        <li>/api/risk/limit - Set manual limit</li>
      </ul>

      <h3>Lottery Operations APIs:</h3>
      <ul>
        <li>/api/lottery/rounds - Get/Create lottery rounds</li>
        <li>/api/lottery/rounds/yiki/generate - Generate Yiki rounds</li>
        <li>/api/lottery/results - Submit results</li>
        <li>/api/lottery/results/fetch/:roundId - Fetch results from external API</li>
        <li>/api/lottery/results/process/:roundId - Process and pay winners</li>
      </ul>

      <h3>Financial APIs:</h3>
      <ul>
        <li>/api/financial/transactions - Get transactions</li>
        <li>/api/financial/transactions/:id/approve - Approve transaction</li>
        <li>/api/financial/transactions/:id/reject - Reject transaction</li>
        <li>/api/financial/verify-slip - Verify bank slip</li>
      </ul>

      <h3>Member APIs:</h3>
      <ul>
        <li>/api/members - Get all members</li>
        <li>/api/members/:id - Get member details</li>
        <li>/api/members/:id/suspend - Suspend member</li>
        <li>/api/members/:id/unsuspend - Unsuspend member</li>
        <li>/api/members/:id/adjust-balance - Adjust member balance</li>
      </ul>

      <h3>Ticket/Bet APIs:</h3>
      <ul>
        <li>/api/tickets - Get all tickets</li>
        <li>/api/tickets/:id - Get ticket details</li>
        <li>/api/tickets/:id/cancel - Cancel ticket</li>
        <li>/api/tickets/by-number - Get tickets by number</li>
      </ul>

      <div style={{ 
        marginTop: '30px', 
        padding: '15px', 
        backgroundColor: '#f0f0f0', 
        borderRadius: '5px' 
      }}>
        <strong>Server Info:</strong>
        <ul>
          <li>Port: 3001</li>
          <li>Database: SQLite (dev.db)</li>
          <li>Status: ✅ Running</li>
        </ul>
      </div>
    </div>
  );
}
