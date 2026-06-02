/**
 * Public routes - accessible without authentication
 */
export const publicRoutes: string[] = [
  "/",
  "/about",
  "/contact",
];

/**
 * Auth routes - redirect logged in users to dashboard
 */
export const authRoutes = [
  "/login",
  "/register",
  "/error",
  "/reset",
  "/new-password",
];

/**
 * API auth prefix
 */
export const apiAuthPrefix = "/api/auth";

/**
 * Default redirect after login
 */
export const DEFAULT_LOGIN_REDIRECT = "/";
