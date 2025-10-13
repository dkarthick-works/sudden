import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
import { Trade, getTradeStatus, calculateProfitLoss, calculateProfitLossPercentage } from '../types/trade';

interface TradeCardProps {
  trade: Trade;
  onClick?: (trade: Trade) => void;
}

const TradeCard = ({ trade, onClick }: TradeCardProps) => {
  const status = getTradeStatus(trade);
  const profitLoss = calculateProfitLoss(trade);
  const profitLossPercentage = calculateProfitLossPercentage(trade);

  const isProfit = profitLoss !== null && profitLoss > 0;
  const isLoss = profitLoss !== null && profitLoss < 0;

  return (
    <div
      onClick={() => onClick?.(trade)}
      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-bold text-gray-900">{trade.symbol}</h3>
            <span
              className={`px-2 py-1 text-xs font-medium rounded ${
                status === 'OPEN'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {status}
            </span>
          </div>
          <p className="text-sm text-gray-500">{trade.entryType}</p>
        </div>

        {status === 'CLOSED' && profitLoss !== null && (
          <div className="text-right">
            <div className={`flex items-center gap-1 justify-end ${
              isProfit ? 'text-green-600' : isLoss ? 'text-red-600' : 'text-gray-600'
            }`}>
              {isProfit ? (
                <ArrowUpRight size={20} />
              ) : isLoss ? (
                <ArrowDownRight size={20} />
              ) : (
                <TrendingUp size={20} />
              )}
              <span className="text-lg font-bold">
                ₹{Math.abs(profitLoss).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </span>
            </div>
            {profitLossPercentage !== null && (
              <p className={`text-sm ${
                isProfit ? 'text-green-600' : isLoss ? 'text-red-600' : 'text-gray-600'
              }`}>
                {profitLossPercentage > 0 ? '+' : ''}{profitLossPercentage.toFixed(2)}%
              </p>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Capital</p>
          <p className="text-sm font-semibold text-gray-900">
            ₹{trade.capital.toLocaleString('en-IN')}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Buy Price</p>
          <p className="text-sm font-semibold text-gray-900">
            ₹{trade.buyPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </p>
        </div>
        {trade.sellPrice !== null && (
          <div>
            <p className="text-xs text-gray-500 mb-1">Sell Price</p>
            <p className="text-sm font-semibold text-gray-900">
              ₹{trade.sellPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </p>
          </div>
        )}
        {status === 'OPEN' && (
          <div>
            <p className="text-xs text-gray-500 mb-1">Quantity</p>
            <p className="text-sm font-semibold text-gray-900">
              {(trade.capital / trade.buyPrice).toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradeCard;
