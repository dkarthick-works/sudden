/**
 * Formats a date string for display (e.g., "Jan 7, 2026")
 */
export const formatDateForDisplay = (dateString: string | null | undefined): string => {
  if (!dateString) return '';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Formats a date string for HTML date input (YYYY-MM-DD)
 */
export const formatDateForInput = (dateString: string | null | undefined): string => {
  if (!dateString) return '';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

/**
 * Checks if a date string represents a future date
 */
export const isFutureDate = (dateString: string): boolean => {
  if (!dateString) return false;

  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return date > today;
};

/**
 * Checks if the first date is before the second date
 */
export const isDateBefore = (dateString1: string, dateString2: string): boolean => {
  if (!dateString1 || !dateString2) return false;

  const date1 = new Date(dateString1);
  const date2 = new Date(dateString2);

  return date1 < date2;
};
