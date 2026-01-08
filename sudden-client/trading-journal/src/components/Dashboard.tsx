import { useState, useEffect } from 'react';
import { Activity, TrendingUp, IndianRupee, Layers, AlertCircle } from 'lucide-react';
import { DashboardData, DateRange } from '../types/trade';
import { fetchDashboardData } from '../services/api';
import DashboardCard from './DashboardCard';
import DateRangeFilter, { getDefaultDateRange } from './DateRangeFilter';

const Dashboard = () => {
  const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange());
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDashboardData(dateRange.fromDate, dateRange.toDate);
      setDashboardData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [dateRange]);

  const calculateWinRate = (data: DashboardData): number => {
    if (data.totalTrades === 0) return 0;
    return (data.positiveTradesCount / data.totalTrades) * 100;
  };

  const getPnLColor = (value: number): 'positive' | 'negative' | 'default' => {
    if (value > 0) return 'positive';
    if (value < 0) return 'negative';
    return 'default';
  };

  const formatPnL = (value: number): string => {
    const prefix = value > 0 ? '+' : '';
    return `${prefix}₹${Math.abs(value).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="space-y-6">
      <DateRangeFilter dateRange={dateRange} onDateRangeChange={setDateRange} />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
          <span className="text-red-700">{error}</span>
          <button
            onClick={loadDashboardData}
            className="ml-auto text-red-600 hover:text-red-800 font-medium"
          >
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Total Trades"
          value={dashboardData?.totalTrades ?? 0}
          icon={<Activity size={20} />}
          loading={loading}
        />
        <DashboardCard
          title="Win Rate"
          value={dashboardData ? `${calculateWinRate(dashboardData).toFixed(1)}%` : '0%'}
          subtitle={dashboardData ? `${dashboardData.positiveTradesCount}W / ${dashboardData.negativeTradesCount}L` : ''}
          icon={<TrendingUp size={20} />}
          valueColor={dashboardData && calculateWinRate(dashboardData) >= 50 ? 'positive' : 'negative'}
          loading={loading}
        />
        <DashboardCard
          title="Net P&L"
          value={dashboardData ? formatPnL(dashboardData.netRealisedProfitAndLoss) : '₹0'}
          icon={<IndianRupee size={20} />}
          valueColor={dashboardData ? getPnLColor(dashboardData.netRealisedProfitAndLoss) : 'default'}
          loading={loading}
        />
        <DashboardCard
          title="Symbols Traded"
          value={dashboardData?.entitiesTraded?.length ?? 0}
          icon={<Layers size={20} />}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Dashboard;
