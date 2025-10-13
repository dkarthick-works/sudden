import { ArrowUpRight, ArrowDownRight, Eye } from 'lucide-react';
import { Trade, getTradeStatus, calculateProfitLoss, calculateProfitLossPercentage } from '../types/trade';

interface TradeRowProps {
  trade: Trade;
  onClick?: (trade: Trade) => void;
}

const TradeRow = ({ trade, onClick }: TradeRowProps) => {
  const status = getTradeStatus(trade);
  const profitLoss = calculateProfitLoss(trade);
  const profitLossPercentage = calculateProfitLossPercentage(trade);
  const quantity = (trade.capital / trade.buyPrice).toFixed(2);

  const isProfit = profitLoss !== null && profitLoss > 0;
  const isLoss = profitLoss !== null && profitLoss < 0;

  return (
    <tr
      className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={() => onClick?.(trade)}
    >
      {/* Symbol */}
      <td className="px-6 py-4">
        <span className="font-semibold text-gray-900">{trade.symbol}</span>
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <span
          className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
            status === 'OPEN'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          {status}
        </span>
      </td>

      {/* Entry Type */}
      <td className="px-6 py-4">
        <span className={`text-sm font-medium ${
          trade.entryType === 'BUY' ? 'text-green-600' : 'text-red-600'
        }`}>
          {trade.entryType}
        </span>
      </td>

      {/* Capital */}
      <td className="px-6 py-4">
        <span className="text-sm text-gray-900">
          ₹{trade.capital.toLocaleString('en-IN')}
        </span>
      </td>

      {/* Buy Price */}
      <td className="px-6 py-4">
        <span className="text-sm text-gray-900">
          ₹{trade.buyPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
        </span>
      </td>

      {/* Sell Price */}
      <td className="px-6 py-4">
        {trade.sellPrice !== null ? (
          <span className="text-sm text-gray-900">
            ₹{trade.sellPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </span>
        ) : (
          <span className="text-sm text-gray-400">—</span>
        )}
      </td>

      {/* Quantity */}
      <td className="px-6 py-4">
        <span className="text-sm text-gray-900">{quantity}</span>
      </td>

      {/* P&L Amount */}
      <td className="px-6 py-4">
        {profitLoss !== null ? (
          <div className={`flex items-center gap-1 ${
            isProfit ? 'text-green-600' : isLoss ? 'text-red-600' : 'text-gray-600'
          }`}>
            {isProfit && <ArrowUpRight size={16} />}
            {isLoss && <ArrowDownRight size={16} />}
            <span className="text-sm font-semibold">
              {isProfit && '+'}₹{Math.abs(profitLoss).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </span>
          </div>
        ) : (
          <span className="text-sm text-gray-400">—</span>
        )}
      </td>

      {/* P&L Percentage */}
      <td className="px-6 py-4">
        {profitLossPercentage !== null ? (
          <span className={`text-sm font-semibold ${
            isProfit ? 'text-green-600' : isLoss ? 'text-red-600' : 'text-gray-600'
          }`}>
            {profitLossPercentage > 0 ? '+' : ''}{profitLossPercentage.toFixed(2)}%
          </span>
        ) : (
          <span className="text-sm text-gray-400">—</span>
        )}
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick?.(trade);
          }}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="View details"
        >
          <Eye size={18} />
        </button>
      </td>
    </tr>
  );
};

export default TradeRow;
