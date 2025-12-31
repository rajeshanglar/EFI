// Global handler for authentication errors
let onAuthErrorCallback: ((shouldRedirectToLogin: boolean) => void) | null = null;

export const setAuthErrorHandler = (callback: (shouldRedirectToLogin: boolean) => void) => {
  onAuthErrorCallback = callback;
};

export const handleAuthError = async (shouldRedirectToLogin: boolean = true) => {
  if (onAuthErrorCallback) {
    onAuthErrorCallback(shouldRedirectToLogin);
  }
};

export const clearAuthErrorHandler = () => {
  onAuthErrorCallback = null;
};

