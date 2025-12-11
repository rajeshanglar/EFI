// Date formatting utilities - shared across components

// Format date: "2025-12-31" -> "31 Dec 2025"
export const formatDate = (dateString: string | null): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    const day = date.getDate();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  } catch (error) {
    return dateString;
  }
};

// Date prefix constants
export const DATE_PREFIXES = {
  UPTO: 'Upto',
  AFTER: 'After',
} as const;

