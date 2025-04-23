/**
 * Formats a date to a readable string
 * @param date The date to format
 * @returns A formatted date string
 */
export const formatDate = (date: Date | string): string => {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Formats a timestamp to minutes and seconds
 * @param seconds The time in seconds
 * @returns A formatted time string (MM:SS)
 */
export const formatTime = (seconds: number): string => {
  if (!seconds && seconds !== 0) return '--:--';
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Truncates a string to a maximum length
 * @param str The string to truncate
 * @param maxLength The maximum length
 * @returns The truncated string
 */
export const truncateString = (str: string, maxLength: number): string => {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  
  return `${str.substring(0, maxLength - 3)}...`;
};

/**
 * Creates a deep copy of an object
 * @param obj The object to clone
 * @returns A deep copy of the object
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Generates a random string of specified length
 * @param length The length of the string to generate
 * @returns A random string
 */
export const generateRandomString = (length: number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
};

/**
 * Shuffles an array using Fisher-Yates algorithm
 * @param array The array to shuffle
 * @returns A new shuffled array
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  
  return newArray;
};

/**
 * Debounces a function
 * @param func The function to debounce
 * @param wait The time to wait in milliseconds
 * @returns A debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(later, wait);
  };
}; 