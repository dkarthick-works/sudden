import { X } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { formatDateForDisplay, isFutureDate, isDateBefore } from '../utils/dateUtils';

interface AddTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddTradeModal = ({ isOpen, onClose }: AddTradeModalProps) => {
  const [entryDate, setEntryDate] = useState('');
  const [exitDate, setExitDate] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [dateErrors, setDateErrors] = useState<{ entryDate?: string; exitDate?: string }>({});

  if (!isOpen) return null;

  const validateDates = (): boolean => {
    const errors: { entryDate?: string; exitDate?: string } = {};

    // Validate entry date
    if (!entryDate) {
      errors.entryDate = 'Buy date is required';
    } else if (isFutureDate(entryDate)) {
      errors.entryDate = 'Buy date cannot be in the future';
    }

    // Validate exit date
    if (exitDate) {
      if (isFutureDate(exitDate)) {
        errors.exitDate = 'Sell date cannot be in the future';
      } else if (entryDate && isDateBefore(exitDate, entryDate)) {
        errors.exitDate = 'Sell date cannot be before buy date';
      }
    }

    // If sell price is provided, exit date is required
    if (sellPrice && !exitDate) {
      errors.exitDate = 'Sell date is required when sell price is provided';
    }

    setDateErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate dates first
    if (!validateDates()) {
      return;
    }

    // Handle form submission logic here
    console.log('Form submitted');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Add New Trade</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Stock Ticker and Capital Deployed Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Ticker <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="AAPL"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capital Deployed <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="1000"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Buy Date and Sell Date Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buy Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={entryDate}
                    onChange={(e) => {
                      setEntryDate(e.target.value);
                      setDateErrors({ ...dateErrors, entryDate: undefined });
                    }}
                    className={`w-full px-4 py-3 border ${dateErrors.entryDate ? 'border-red-500' : 'border-gray-200'} rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 ${dateErrors.entryDate ? 'focus:ring-red-500' : 'focus:ring-blue-500'} focus:border-transparent`}
                    required
                  />
                  {dateErrors.entryDate && (
                    <p className="mt-1 text-sm text-red-500">{dateErrors.entryDate}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sell Date {sellPrice && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="date"
                    value={exitDate}
                    onChange={(e) => {
                      setExitDate(e.target.value);
                      setDateErrors({ ...dateErrors, exitDate: undefined });
                    }}
                    className={`w-full px-4 py-3 border ${dateErrors.exitDate ? 'border-red-500' : 'border-gray-200'} rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 ${dateErrors.exitDate ? 'focus:ring-red-500' : 'focus:ring-blue-500'} focus:border-transparent`}
                  />
                  {dateErrors.exitDate && (
                    <p className="mt-1 text-sm text-red-500">{dateErrors.exitDate}</p>
                  )}
                </div>
              </div>

              {/* Buy Price and Sell Price Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buy Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="150.00"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sell Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={sellPrice}
                    onChange={(e) => setSellPrice(e.target.value)}
                    placeholder="160.00"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Buy Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buy Reason
                </label>
                <textarea
                  placeholder="Why did you buy this stock?"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                ></textarea>
              </div>

              {/* Exit Plan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exit Plan
                </label>
                <textarea
                  placeholder="What's your exit strategy?"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                ></textarea>
              </div>

              {/* Mistakes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mistakes
                </label>
                <textarea
                  placeholder="What mistakes did you make in this trade?"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                ></textarea>
              </div>

              {/* Takeaways */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Takeaways
                </label>
                <textarea
                  placeholder="What did you learn? What went well or what would you do differently?"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Save Trade
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTradeModal;
