import { LogEntry } from '../types/trade';

interface LogFieldProps {
  label: string;
  existingLogs: LogEntry[] | null;
  newLogValue: string;
  onNewLogChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
}

const LogField = ({
  label,
  existingLogs,
  newLogValue,
  onNewLogChange,
  placeholder,
  required = false
}: LogFieldProps) => {
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Previous Entries */}
      {existingLogs && existingLogs.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-500 mb-2">📝 Previous Entries</p>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {existingLogs.map((entry, index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex gap-3"
              >
                <p className="text-sm text-gray-700 whitespace-pre-wrap flex-1">
                  {entry.log}
                </p>
                <p className="text-xs text-gray-500 flex-shrink-0 self-start">
                  {formatTimestamp(entry.timestamp)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Entry */}
      <div>
        <p className="text-xs font-medium text-gray-600 mb-2">
          {existingLogs && existingLogs.length > 0 ? '✍️ Add New Entry' : ''}
        </p>
        <textarea
          value={newLogValue}
          onChange={(e) => onNewLogChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          required={required}
        ></textarea>
      </div>
    </div>
  );
};

export default LogField;
