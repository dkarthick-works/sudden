export interface LogEntry {
  timestamp: string;
  log: string;
}

export interface Trade {
  id: string;
  symbol: string;
  entryType: 'BUY' | 'SELL';
  capital: number;
  buyPrice: number;
  sellPrice: number | null;
  entryDate: string;
  exitDate: string | null;
  daysHeld: number;
  buyReasonLogs: LogEntry[] | null;
  exitPlanLogs: LogEntry[] | null;
  mistakeLogs: LogEntry[] | null;
  takeAwayLogs: LogEntry[] | null;
}

export type TradeStatus = 'OPEN' | 'CLOSED';

export const getTradeStatus = (trade: Trade): TradeStatus => {
  return trade.sellPrice === null ? 'OPEN' : 'CLOSED';
};

export const calculateProfitLoss = (trade: Trade): number | null => {
  if (trade.sellPrice === null) return null;
  const quantity = trade.capital / trade.buyPrice;
  return (trade.sellPrice - trade.buyPrice) * quantity;
};

export const calculateProfitLossPercentage = (trade: Trade): number | null => {
  if (trade.sellPrice === null) return null;
  return ((trade.sellPrice - trade.buyPrice) / trade.buyPrice) * 100;
};

// Dashboard types
export interface DashboardData {
  totalTrades: number;
  positiveTradesCount: number;
  negativeTradesCount: number;
  netRealisedProfitAndLoss: number;
  entitiesTraded: string[];
}

export type DateRangePreset = 'this-month' | 'last-30-days' | 'ytd' | 'custom';

export interface DateRange {
  fromDate: string;
  toDate: string;
  preset: DateRangePreset;
}
