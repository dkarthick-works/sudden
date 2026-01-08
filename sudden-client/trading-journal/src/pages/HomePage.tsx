import { useState, useEffect } from 'react';
import { Search, Plus, TrendingUp, ChevronDown, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Trade } from '../types/trade';
import { fetchTrades } from '../services/api';
import TradeRow from '../components/TradeRow';

function HomePage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [filteredTrades, setFilteredTrades] = useState<Trade[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadTrades();
  }, []);

  useEffect(() => {
    filterTrades();
  }, [trades, searchQuery, filter]);

  const loadTrades = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTrades();
      setTrades(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load trades');
      console.error('Error loading trades:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterTrades = () => {
    let filtered = [...trades];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((trade) =>
        trade.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (filter === 'winning') {
      filtered = filtered.filter(
        (trade) => trade.sellPrice !== null && trade.sellPrice > trade.buyPrice
      );
    } else if (filter === 'losing') {
      filtered = filtered.filter(
        (trade) => trade.sellPrice !== null && trade.sellPrice < trade.buyPrice
      );
    } else if (filter === 'open') {
      filtered = filtered.filter((trade) => trade.sellPrice === null);
    }

    setFilteredTrades(filtered);
  };

  const handleTradeClick = (trade: Trade) => {
    navigate(`/edit-trade/${trade.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Trade Journal</h1>
            <p className="text-gray-600">Track your trades, reflect on decisions, and improve your strategy</p>
          </div>

          {/* Search and Actions Bar */}
          <div className="flex gap-4 items-center">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by ticker..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* All Trades Dropdown */}
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
              >
                <option value="all">All Trades</option>
                <option value="winning">Winning Trades</option>
                <option value="losing">Losing Trades</option>
                <option value="open">Open Trades</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 pointer-events-none" size={20} />
            </div>

            {/* Add Trade Button */}
            <button
              onClick={() => navigate('/add-trade')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
            >
              <Plus size={20} />
              Add Trade
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="text-blue-600 animate-spin mb-4" size={48} />
            <p className="text-gray-600">Loading trades...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24">
            <AlertCircle className="text-red-500 mb-4" size={48} />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Error Loading Trades</h2>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={loadTrades}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredTrades.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <TrendingUp className="text-gray-400 mb-6" size={80} strokeWidth={1.5} />
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">
              {trades.length === 0 ? 'No trades yet' : 'No matching trades'}
            </h2>
            <p className="text-gray-500 mb-8">
              {trades.length === 0
                ? 'Start logging your trades to track your progress'
                : 'Try adjusting your search or filter'}
            </p>
            {trades.length === 0 && (
              <button
                onClick={() => navigate('/add-trade')}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add Your First Trade
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Symbol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Days Held
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capital
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Buy Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sell Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    P&L
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    P&L %
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTrades.map((trade) => (
                  <TradeRow key={trade.id} trade={trade} onClick={handleTradeClick} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
