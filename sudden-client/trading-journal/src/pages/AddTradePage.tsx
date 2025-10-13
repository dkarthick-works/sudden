import { X, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { FormEvent, useState, useEffect } from 'react';
import { Trade, LogEntry } from '../types/trade';
import { createTrade, updateTrade, fetchTradeById } from '../services/api';
import LogField from '../components/LogField';

const AddTradePage = (): JSX.Element => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  // Form state
  const [symbol, setSymbol] = useState('');
  const [entryType, setEntryType] = useState<'BUY' | 'SELL'>('BUY');
  const [capital, setCapital] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [buyReason, setBuyReason] = useState('');
  const [exitPlan, setExitPlan] = useState('');
  const [mistakes, setMistakes] = useState('');
  const [takeaways, setTakeaways] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [fetchingTrade, setFetchingTrade] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingTrade, setExistingTrade] = useState<Trade | null>(null);

  // Fetch trade data in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      loadTradeData(id);
    }
  }, [id, isEditMode]);

  const loadTradeData = async (tradeId: string) => {
    try {
      setFetchingTrade(true);
      setError(null);
      const trade = await fetchTradeById(tradeId);
      setExistingTrade(trade);

      // Pre-fill form fields
      setSymbol(trade.symbol);
      setEntryType(trade.entryType);
      setCapital(trade.capital.toString());
      setBuyPrice(trade.buyPrice.toString());
      setSellPrice(trade.sellPrice ? trade.sellPrice.toString() : '');
      // Note: Log fields stay empty, they will show existing logs via LogField component
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load trade');
      console.error('Error loading trade:', err);
    } finally {
      setFetchingTrade(false);
    }
  };

  const createLogEntry = (logText: string): LogEntry[] | null => {
    if (!logText.trim()) return null;
    return [{
      timestamp: new Date().toISOString(),
      log: logText.trim()
    }];
  };

  const appendLog = (existingLogs: LogEntry[] | null, newLogText: string): LogEntry[] | null => {
    const newLog = createLogEntry(newLogText);
    if (!newLog) return existingLogs;
    return existingLogs ? [...existingLogs, ...newLog] : newLog;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditMode && existingTrade) {
        // Edit mode: Append new logs to existing ones
        const updatedTrade: Trade = {
          ...existingTrade,
          symbol: symbol.toUpperCase().trim(),
          entryType,
          capital: parseFloat(capital),
          buyPrice: parseFloat(buyPrice),
          sellPrice: sellPrice ? parseFloat(sellPrice) : null,
          buyReasonLogs: appendLog(existingTrade.buyReasonLogs, buyReason),
          exitPlanLogs: appendLog(existingTrade.exitPlanLogs, exitPlan),
          mistakeLogs: appendLog(existingTrade.mistakeLogs, mistakes),
          takeAwayLogs: appendLog(existingTrade.takeAwayLogs, takeaways),
        };

        await updateTrade(existingTrade.id, updatedTrade);
      } else {
        // Create mode: Create new trade with logs
        const tradeData = {
          symbol: symbol.toUpperCase().trim(),
          entryType,
          capital: parseFloat(capital),
          buyPrice: parseFloat(buyPrice),
          sellPrice: sellPrice ? parseFloat(sellPrice) : null,
          buyReasonLogs: createLogEntry(buyReason),
          exitPlanLogs: createLogEntry(exitPlan),
          mistakeLogs: createLogEntry(mistakes),
          takeAwayLogs: createLogEntry(takeaways),
        };

        await createTrade(tradeData);
      }

      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save trade');
      console.error('Error saving trade:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (): void => {
    navigate('/');
  };

  if (fetchingTrade) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="text-blue-600 animate-spin mb-4" size={48} />
          <p className="text-gray-600">Loading trade data...</p>
        </div>
      </div>
    );
  }

  if (isEditMode && error && !existingTrade) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-8 max-w-md w-full">
          <div className="flex flex-col items-center text-center">
            <AlertCircle className="text-red-500 mb-4" size={48} />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Failed to Load Trade</h2>
            <p className="text-gray-500 mb-6">{error}</p>
            <div className="flex gap-4">
              <button
                onClick={() => id && loadTradeData(id)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-white rounded-lg">
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                {isEditMode ? 'Edit Trade' : 'Add New Trade'}
              </h2>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {error && existingTrade && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Stock Ticker and Entry Type Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Ticker <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={symbol}
                      onChange={(e) => setSymbol(e.target.value)}
                      placeholder="AAPL"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Entry Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={entryType}
                      onChange={(e) => setEntryType(e.target.value as 'BUY' | 'SELL')}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="BUY">BUY</option>
                      <option value="SELL">SELL</option>
                    </select>
                  </div>
                </div>

                {/* Capital and Buy Price Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Capital Deployed <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={capital}
                      onChange={(e) => setCapital(e.target.value)}
                      placeholder="25000"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Buy Price <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={buyPrice}
                      onChange={(e) => setBuyPrice(e.target.value)}
                      step="0.01"
                      min="0"
                      placeholder="350.00"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Sell Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sell Price
                  </label>
                  <input
                    type="number"
                    value={sellPrice}
                    onChange={(e) => setSellPrice(e.target.value)}
                    step="0.01"
                    min="0"
                    placeholder="160.00"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Buy Reason */}
                {isEditMode ? (
                  <LogField
                    label="Buy Reason"
                    existingLogs={existingTrade?.buyReasonLogs || null}
                    newLogValue={buyReason}
                    onNewLogChange={setBuyReason}
                    placeholder="Add additional notes about why you bought this stock..."
                  />
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Buy Reason
                    </label>
                    <textarea
                      value={buyReason}
                      onChange={(e) => setBuyReason(e.target.value)}
                      placeholder="Why did you buy this stock?"
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    ></textarea>
                  </div>
                )}

                {/* Exit Plan */}
                {isEditMode ? (
                  <LogField
                    label="Exit Plan"
                    existingLogs={existingTrade?.exitPlanLogs || null}
                    newLogValue={exitPlan}
                    onNewLogChange={setExitPlan}
                    placeholder="Add additional notes about your exit strategy..."
                  />
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Exit Plan
                    </label>
                    <textarea
                      value={exitPlan}
                      onChange={(e) => setExitPlan(e.target.value)}
                      placeholder="What's your exit strategy?"
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    ></textarea>
                  </div>
                )}

                {/* Mistakes */}
                {isEditMode ? (
                  <LogField
                    label="Mistakes"
                    existingLogs={existingTrade?.mistakeLogs || null}
                    newLogValue={mistakes}
                    onNewLogChange={setMistakes}
                    placeholder="Add notes about mistakes made in this trade..."
                  />
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mistakes
                    </label>
                    <textarea
                      value={mistakes}
                      onChange={(e) => setMistakes(e.target.value)}
                      placeholder="What mistakes did you make in this trade?"
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    ></textarea>
                  </div>
                )}

                {/* Takeaways */}
                {isEditMode ? (
                  <LogField
                    label="Takeaways"
                    existingLogs={existingTrade?.takeAwayLogs || null}
                    newLogValue={takeaways}
                    onNewLogChange={setTakeaways}
                    placeholder="Add additional learnings or reflections..."
                  />
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Takeaways
                    </label>
                    <textarea
                      value={takeaways}
                      onChange={(e) => setTakeaways(e.target.value)}
                      placeholder="What did you learn? What went well or what would you do differently?"
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    ></textarea>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 !text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 className="animate-spin" size={20} />}
                    {loading ? (isEditMode ? 'Updating...' : 'Saving...') : (isEditMode ? 'Update Trade' : 'Save Trade')}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={loading}
                    className="px-8 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTradePage;
