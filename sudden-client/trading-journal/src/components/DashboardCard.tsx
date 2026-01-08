import { ReactNode } from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  valueColor?: 'default' | 'positive' | 'negative';
  loading?: boolean;
}

const DashboardCard = ({
  title,
  value,
  subtitle,
  icon,
  valueColor = 'default',
  loading = false
}: DashboardCardProps) => {
  const valueColorClasses = {
    default: 'text-gray-900',
    positive: 'text-green-600',
    negative: 'text-red-600',
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-20"></div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
          {icon}
        </div>
        <span className="text-sm font-medium text-gray-500">{title}</span>
      </div>
      <div className={`text-2xl font-bold ${valueColorClasses[valueColor]}`}>
        {value}
      </div>
      {subtitle && (
        <div className="text-sm text-gray-500 mt-1">{subtitle}</div>
      )}
    </div>
  );
};

export default DashboardCard;
