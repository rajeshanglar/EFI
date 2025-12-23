// Global handler for authentication errors
let onAuthErrorCallback: (() => void) | null = null;

export const setAuthErrorHandler = (callback: () => void) => {
  onAuthErrorCallback = callback;
};

export const handleAuthError = async () => {
  if (onAuthErrorCallback) {
    onAuthErrorCallback();
  }
};

export const clearAuthErrorHandler = () => {
  onAuthErrorCallback = null;
};

