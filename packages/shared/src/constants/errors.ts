// Error codes
export enum ErrorCode {
  // Auth errors
  AUTH_INVALID_CREDENTIALS = 'auth/invalid-credentials',
  AUTH_EMAIL_ALREADY_IN_USE = 'auth/email-already-in-use',
  AUTH_WEAK_PASSWORD = 'auth/weak-password',
  AUTH_USER_NOT_FOUND = 'auth/user-not-found',
  AUTH_EXPIRED_SESSION = 'auth/expired-session',
  
  // Subscription errors
  SUBSCRIPTION_PAYMENT_FAILED = 'subscription/payment-failed',
  SUBSCRIPTION_ALREADY_EXISTS = 'subscription/already-exists',
  SUBSCRIPTION_INACTIVE = 'subscription/inactive',
  SUBSCRIPTION_NO_CALLS_REMAINING = 'subscription/no-calls-remaining',
  
  // Call errors
  CALL_INVALID_PHONE_NUMBER = 'call/invalid-phone-number',
  CALL_MISSING_VARIABLES = 'call/missing-variables',
  CALL_QUEUE_FAILED = 'call/queue-failed',
  CALL_NOT_FOUND = 'call/not-found',
  CALL_ALREADY_COMPLETED = 'call/already-completed',
  CALL_PROVIDER_ERROR = 'call/provider-error',
  
  // Network errors
  NETWORK_ERROR = 'network/error',
  NETWORK_TIMEOUT = 'network/timeout',
  
  // General
  UNKNOWN_ERROR = 'unknown/error'
}

// Error messages for user display
export const ErrorMessages: Record<ErrorCode, string> = {
  [ErrorCode.AUTH_INVALID_CREDENTIALS]: 'Invalid email or password',
  [ErrorCode.AUTH_EMAIL_ALREADY_IN_USE]: 'Email is already in use',
  [ErrorCode.AUTH_WEAK_PASSWORD]: 'Password is too weak',
  [ErrorCode.AUTH_USER_NOT_FOUND]: 'User not found',
  [ErrorCode.AUTH_EXPIRED_SESSION]: 'Your session has expired. Please sign in again',
  
  [ErrorCode.SUBSCRIPTION_PAYMENT_FAILED]: 'Payment failed. Please try again or use a different payment method',
  [ErrorCode.SUBSCRIPTION_ALREADY_EXISTS]: 'You already have an active subscription',
  [ErrorCode.SUBSCRIPTION_INACTIVE]: 'Your subscription is inactive',
  [ErrorCode.SUBSCRIPTION_NO_CALLS_REMAINING]: 'No calls remaining in your subscription',
  
  [ErrorCode.CALL_INVALID_PHONE_NUMBER]: 'Invalid phone number',
  [ErrorCode.CALL_MISSING_VARIABLES]: 'Missing required information for the call',
  [ErrorCode.CALL_QUEUE_FAILED]: 'Failed to queue the call',
  [ErrorCode.CALL_NOT_FOUND]: 'Call not found',
  [ErrorCode.CALL_ALREADY_COMPLETED]: 'Call already completed',
  [ErrorCode.CALL_PROVIDER_ERROR]: 'An error occurred with the call provider',
  
  [ErrorCode.NETWORK_ERROR]: 'Network error, please check your connection and try again',
  [ErrorCode.NETWORK_TIMEOUT]: 'Request timed out, please try again',
  
  [ErrorCode.UNKNOWN_ERROR]: 'An unknown error occurred'
};

// Custom error class with error code
export class AppError extends Error {
  code: ErrorCode;
  
  constructor(code: ErrorCode, message?: string) {
    super(message || ErrorMessages[code]);
    this.code = code;
    this.name = 'AppError';
  }
}

// Helper to get user-friendly error message
export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return ErrorMessages[ErrorCode.UNKNOWN_ERROR];
}
