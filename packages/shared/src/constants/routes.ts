export const ROUTES = {
  // Auth routes
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  
  // Main routes
  HOME: '/',
  NEW_CALL: '/call/new',
  CALL_DETAILS: '/call/:id',
  CALL_HISTORY: '/history',
  SUBSCRIPTION: '/subscription',
  SETTINGS: '/settings',
  
  // Settings subroutes
  ACCOUNT_SETTINGS: '/settings/account',
  SUBSCRIPTION_SETTINGS: '/settings/subscription',
  LANGUAGE_SETTINGS: '/settings/language',
  HELP_SUPPORT: '/settings/help',
  ABOUT: '/settings/about'
};

// Helper to generate dynamic route paths
export function generatePath(route: string, params: Record<string, string | number> = {}): string {
  let path = route;
  
  Object.entries(params).forEach(([key, value]) => {
    path = path.replace(`:${key}`, String(value));
  });
  
  return path;
}
