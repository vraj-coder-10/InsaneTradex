import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts';

const initialStocks = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', sector: 'Energy', price: 2942.50, change: 1.42, color: '#8b5cf6' },
  { symbol: 'TCS', name: 'Tata Consultancy Services', sector: 'IT', price: 3890.20, change: 0.86, color: '#38bdf8' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', sector: 'Banking', price: 1678.30, change: -0.42, color: '#22c55e' },
  { symbol: 'INFY', name: 'Infosys', sector: 'IT', price: 1852.75, change: 1.18, color: '#f59e0b' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', sector: 'Banking', price: 1244.60, change: 0.64, color: '#fb7185' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors', sector: 'Automobile', price: 972.40, change: -1.12, color: '#a78bfa' },
  { symbol: 'SBIN', name: 'State Bank of India', sector: 'Banking', price: 812.15, change: 0.35, color: '#2dd4bf' },
  { symbol: 'ITC', name: 'ITC Limited', sector: 'FMCG', price: 438.90, change: 0.21, color: '#f97316' }
];

const makeHistory = (price, seed) => Array.from({ length: 24 }, (_, i) => ({
  time: `${String(Math.floor(i / 2)).padStart(2, '0')}:${i % 2 ? '30' : '00'}`,
  value: Number((price * (0.975 + ((i * 17 + seed * 13) % 31) / 1000)).toFixed(2))
}));

const money = n => new Intl.NumberFormat('en-IN', {
  style: 'currency', currency: 'INR', maximumFractionDigits: 2
}).format(n);

function App() {
  const [stocks] = useState(initialStocks);
  const [selected, setSelected] = useState('RELIANCE');
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Overview');
  const [watchlist, setWatchlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('it-watchlist')) || ['RELIANCE', 'TCS', 'INFY']; }
    catch { return ['RELIANCE', 'TCS', 'INFY']; }
  });
  const [portfolio, setPortfolio] = useState(() => {
    try { return JSON.parse(localStorage.getItem('it-portfolio')) || {}; }
    catch { return {}; }
  });
  const [balance, setBalance] = useState(() => Number(localStorage.getItem('it-balance')) || 100000);
  const [tradeType, setTradeType] = useState('BUY');
  const [quantity, setQuantity] = useState(1);
  const [notice, setNotice] = useState('');

  useEffect(() => localStorage.setItem('it-watchlist', JSON.stringify(watchlist)), [watchlist]);
  useEffect(() => localStorage.setItem('it-portfolio', JSON.stringify(portfolio)), [portfolio]);
  useEffect(() => localStorage.setItem('it-balance', String(balance)), [balance]);

  const current = stocks.find(s => s.symbol === selected) || stocks[0];
  const history = useMemo(() => makeHistory(current.price, stocks.indexOf(current) + 1), [current, stocks]);
  const filteredStocks = stocks.filter(s =>
    `${s.symbol} ${s.name} ${s.sector}`.toLowerCase().includes(query.toLowerCase())
  );
  const holdings = Object.entries(portfolio).filter(([, qty]) => qty > 0);
  const invested = holdings.reduce((sum, [symbol, qty]) =>
    sum + qty * stocks.find(s => s.symbol === symbol).price, 0);
  const totalValue = balance + invested;
  const qty = Math.max(1, Math.floor(Number(quantity) || 1));
  const tradeValue = current.price * qty;

  const toggleWatch = symbol => setWatchlist(old =>
    old.includes(symbol) ? old.filter(s => s !== symbol) : [...old, symbol]
  );

  const executeTrade = () => {
    const owned = portfolio[current.symbol] || 0;
    if (tradeType === 'BUY') {
      if (tradeValue > balance) { setNotice('Not enough virtual balance for this order.'); return; }
      setBalance(v => v - tradeValue);
      setPortfolio(p => ({ ...p, [current.symbol]: owned + qty }));
      setNotice(`Buy order simulated: ${qty} ${current.symbol} share(s).`);
    } else {
      if (qty > owned) { setNotice(`You only own ${owned} ${current.symbol} share(s).`); return; }
      setBalance(v => v + tradeValue);
      setPortfolio(p => ({ ...p, [current.symbol]: owned - qty }));
      setNotice(`Sell order simulated: ${qty} ${current.symbol} share(s).`);
    }
    setQuantity(1);
  };

  const resetAccount = () => {
    if (!window.confirm('Reset your virtual account to ₹1,00,000 and clear holdings?')) return;
    setBalance(100000);
    setPortfolio({});
    setNotice('Your virtual account has been reset.');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">I</span><span>Insane<span className="brand-accent">Tradex</span></span></div>
        <div className="side-label">WORKSPACE</div>
        <nav>
          {['Overview', 'Markets', 'Watchlist', 'Portfolio'].map((tab, i) => (
            <button key={tab} className={`nav-item ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
              <span className="nav-icon">{['◫', '↗', '☆', '▤'][i]}</span>{tab}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="learning-card">
            <div className="learning-icon">✦</div>
            <strong>Practice makes progress</strong>
            <p>Learn how markets work with virtual money.</p>
          </div>
          <div className="profile-row"><div className="avatar">ST</div><div><strong>Student Trader</strong><small>Demo account</small></div><span className="dots">•••</span></div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div><div className="eyebrow">INDIAN EQUITY MARKET</div><h1>{activeTab === 'Overview' ? 'Market overview' : activeTab}</h1></div>
          <div className="top-actions"><span className="market-status"><i /> Demo market</span><button className="reset-btn" onClick={resetAccount}>↻ Reset demo</button><div className="avatar">ST</div></div>
        </header>

        <div className="demo-banner"><span>ⓘ</span><div><strong>Educational demo — simulated prices and trades</strong><small>This project does not connect to NSE/BSE or place real orders. Figures are sample data, not investment advice.</small></div><span className="banner-tag">VIRTUAL MODE</span></div>

        <section className="index-grid">
          <IndexCard name="NIFTY 50" value="24,850.40" change="+0.72%" positive />
          <IndexCard name="SENSEX" value="81,365.20" change="+0.64%" positive />
          <IndexCard name="BANK NIFTY" value="52,140.85" change="-0.28%" />
          <div className="stat-card balance-card"><span className="stat-label">VIRTUAL BALANCE</span><strong>{money(balance)}</strong><span className="stat-foot">Available to trade</span><span className="wallet-icon">₹</span></div>
        </section>

        <section className="content-grid">
          <div className="panel chart-panel">
            <div className="panel-heading">
              <div><div className="eyebrow">STOCK PERFORMANCE</div><h2>{current.name}</h2><span className="symbol-label">{current.symbol} · NSE (sample)</span></div>
              <button className={`star-btn ${watchlist.includes(current.symbol) ? 'starred' : ''}`} onClick={() => toggleWatch(current.symbol)}>{watchlist.includes(current.symbol) ? '★' : '☆'} Watchlist</button>
            </div>
            <div className="price-row"><strong>{money(current.price)}</strong><span className={current.change >= 0 ? 'positive' : 'negative'}>{current.change >= 0 ? '↗ +' : '↘ '}{Math.abs(current.change).toFixed(2)}%</span><small>Sample price</small></div>
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history} margin={{ top: 12, right: 8, left: -18, bottom: 0 }}>
                  <defs><linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#25d6a2" stopOpacity={0.28}/><stop offset="100%" stopColor="#25d6a2" stopOpacity={0}/></linearGradient></defs>
                  <CartesianGrid stroke="#202b3d" strokeDasharray="4 5" vertical={false}/>
                  <XAxis dataKey="time" tick={{ fill: '#718096', fontSize: 10 }} axisLine={false} tickLine={false} interval={5}/>
                  <YAxis domain={['dataMin - 15', 'dataMax + 15']} tick={{ fill: '#718096', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}`}/>
                  <Tooltip contentStyle={{ background: '#111a29', border: '1px solid #2a374b', borderRadius: 10, color: '#fff' }} formatter={v => [money(v), 'Sample price']}/>
                  <Area type="monotone" dataKey="value" stroke="#25d6a2" strokeWidth={2.5} fill="url(#chartFill)" activeDot={{ r: 5, fill: '#25d6a2' }}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-legend"><span><i /> Illustrative intraday movement</span><span>Market data: sample</span></div>
            <div className="stock-metrics"><Metric label="DAY CHANGE" value={`${current.change >= 0 ? '+' : ''}${current.change.toFixed(2)}%`} positive={current.change >= 0}/><Metric label="SECTOR" value={current.sector}/><Metric label="YOUR HOLDING" value={`${portfolio[current.symbol] || 0} shares`}/></div>
          </div>

          <div className="panel trade-panel">
            <div className="panel-heading"><div><div className="eyebrow">QUICK ORDER</div><h2>Trade {current.symbol}</h2></div><span className="order-icon">⇄</span></div>
            <div className="trade-switch"><button className={tradeType === 'BUY' ? 'buy-active' : ''} onClick={() => {setTradeType('BUY'); setNotice('');}}>Buy</button><button className={tradeType === 'SELL' ? 'sell-active' : ''} onClick={() => {setTradeType('SELL'); setNotice('');}}>Sell</button></div>
            <label className="field-label">Selected stock</label><div className="selected-stock"><span className="stock-dot" style={{background: current.color}}/><div><strong>{current.symbol}</strong><small>{current.name}</small></div><b>{money(current.price)}</b></div>
            <label className="field-label" htmlFor="quantity">Quantity</label><div className="quantity-control"><button onClick={() => setQuantity(Math.max(1, qty - 1))}>−</button><input id="quantity" type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)}/><button onClick={() => setQuantity(qty + 1)}>+</button></div>
            <div className="order-summary"><span>Estimated order value</span><strong>{money(tradeValue)}</strong></div>
            <div className="order-summary muted"><span>Available balance</span><span>{money(balance)}</span></div>
            <button className={`execute-btn ${tradeType === 'SELL' ? 'execute-sell' : ''}`} onClick={executeTrade}>{tradeType === 'BUY' ? 'Buy' : 'Sell'} {current.symbol} <span>→</span></button>
            {notice && <div className={`notice ${notice.includes('Not') || notice.includes('only own') ? 'notice-error' : ''}`}>{notice}</div>}
            <p className="trade-disclaimer">Virtual order only. No real money is used.</p>
          </div>
        </section>

        <section className="lower-grid">
          <div className="panel stocks-panel">
            <div className="panel-heading"><div><div className="eyebrow">DISCOVER</div><h2>Popular Indian stocks</h2></div><span className="count-pill">{filteredStocks.length} stocks</span></div>
            <div className="search-box"><span>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search company or symbol..."/></div>
            <div className="stock-table">
              <div className="table-head"><span>COMPANY</span><span>PRICE</span><span>CHANGE</span><span></span></div>
              {filteredStocks.map(stock => <button className={`stock-row ${selected === stock.symbol ? 'selected-row' : ''}`} key={stock.symbol} onClick={() => setSelected(stock.symbol)}>
                <span className="company-cell"><i style={{background: stock.color}}>{stock.symbol[0]}</i><span><strong>{stock.symbol}</strong><small>{stock.name}</small></span></span>
                <strong>{money(stock.price)}</strong><span className={stock.change >= 0 ? 'positive' : 'negative'}>{stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%</span><span className="row-arrow">›</span>
              </button>)}
              {filteredStocks.length === 0 && <div className="empty-state">No matching stocks found.</div>}
            </div>
          </div>

          <div className="panel portfolio-panel">
            <div className="panel-heading"><div><div className="eyebrow">YOUR ACCOUNT</div><h2>Portfolio summary</h2></div><span className="portfolio-icon">▤</span></div>
            <div className="portfolio-total"><small>TOTAL ACCOUNT VALUE</small><strong>{money(totalValue)}</strong><span>Virtual balance + holdings at sample prices</span></div>
            <div className="portfolio-bars"><div><span>Available cash</span><strong>{money(balance)}</strong></div><div className="bar-track"><i style={{width: `${totalValue ? balance / totalValue * 100 : 0}%`}}/></div><div><span>Stock holdings</span><strong>{money(invested)}</strong></div><div className="bar-track"><i className="holdings-bar" style={{width: `${totalValue ? invested / totalValue * 100 : 0}%`}}/></div></div>
            <div className="holdings-title">YOUR HOLDINGS <span>{holdings.length} positions</span></div>
            {holdings.length ? holdings.map(([symbol, count]) => {
              const stock = stocks.find(s => s.symbol === symbol);
              return <button className="holding-row" key={symbol} onClick={() => setSelected(symbol)}><span><strong>{symbol}</strong><small>{count} shares</small></span><b>{money(stock.price * count)}</b></button>;
            }) : <div className="empty-holdings">No holdings yet.<br/>Choose a stock and place a virtual buy order.</div>}
          </div>
        </section>
        <footer>© 2026 InsaneTradex · College Web Development Project · For educational use only</footer>
      </main>
    </div>
  );
}

function IndexCard({ name, value, change, positive = false }) {
  return <div className="stat-card"><span className="stat-label">{name}</span><strong>{value}</strong><span className={positive ? 'positive stat-change' : 'negative stat-change'}>{positive ? '↗ ' : '↘ '}{change}</span><div className="sparkline"><span style={{height:'35%'}}/><span style={{height:'52%'}}/><span style={{height:'44%'}}/><span style={{height:'68%'}}/><span style={{height:'57%'}}/><span style={{height:'82%'}}/><span style={{height:'72%'}}/><span style={{height:'96%'}}/></div></div>;
}
function Metric({ label, value, positive }) {
  return <div className="metric"><small>{label}</small><strong className={positive === undefined ? '' : positive ? 'positive' : 'negative'}>{value}</strong></div>;
}
export default App;