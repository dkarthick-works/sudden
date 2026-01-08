import { DateRange, DateRangePreset } from '../types/trade';

interface DateRangeFilterProps {
  dateRange: DateRange;
  onDateRangeChange: (dateRange: DateRange) => void;
}

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const getThisMonthRange = (): { fromDate: string; toDate: string } => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  return {
    fromDate: formatDate(firstDay),
    toDate: formatDate(now),
  };
};

const getLast30DaysRange = (): { fromDate: string; toDate: string } => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return {
    fromDate: formatDate(thirtyDaysAgo),
    toDate: formatDate(now),
  };
};

const getYTDRange = (): { fromDate: string; toDate: string } => {
  const now = new Date();
  const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
  return {
    fromDate: formatDate(firstDayOfYear),
    toDate: formatDate(now),
  };
};

export const getDefaultDateRange = (): DateRange => {
  const { fromDate, toDate } = getLast30DaysRange();
  return { fromDate, toDate, preset: 'last-30-days' };
};

const DateRangeFilter = ({ dateRange, onDateRangeChange }: DateRangeFilterProps) => {
  const presets: { key: DateRangePreset; label: string; getRange: () => { fromDate: string; toDate: string } }[] = [
    { key: 'this-month', label: 'This Month', getRange: getThisMonthRange },
    { key: 'last-30-days', label: 'Last 30 Days', getRange: getLast30DaysRange },
    { key: 'ytd', label: 'YTD', getRange: getYTDRange },
  ];

  const handlePresetClick = (preset: DateRangePreset, getRange: () => { fromDate: string; toDate: string }) => {
    const { fromDate, toDate } = getRange();
    onDateRangeChange({ fromDate, toDate, preset });
  };

  const handleDateChange = (field: 'fromDate' | 'toDate', value: string) => {
    onDateRangeChange({
      ...dateRange,
      [field]: value,
      preset: 'custom',
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex gap-2">
        {presets.map(({ key, label, getRange }) => (
          <button
            key={key}
            onClick={() => handlePresetClick(key, getRange)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              dateRange.preset === key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <label className="text-sm text-gray-600">From:</label>
        <input
          type="date"
          value={dateRange.fromDate}
          onChange={(e) => handleDateChange('fromDate', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <label className="text-sm text-gray-600">To:</label>
        <input
          type="date"
          value={dateRange.toDate}
          onChange={(e) => handleDateChange('toDate', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
};

export default DateRangeFilter;
