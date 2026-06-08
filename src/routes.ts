/**
 * Public routes - accessible without authentication.
 * The homepage ("/") is intentionally NOT public: exchange rates are gated
 * behind login. "/about" and "/contact" stay public so guests can read company
 * info and reach the contact form.
 */
export const publicRoutes: string[] = [
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
  "/new-verification",
];

/**
 * API auth prefix
 */
export const apiAuthPrefix = "/api/auth";

/**
 * Default redirect after login
 */
export const DEFAULT_LOGIN_REDIRECT = "/";
