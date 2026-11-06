/**
 * Authentication Middleware
 * Enforces authenticated sessions for protected endpoints.
 */
export function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      error: 'Authentication required. Please sign in to continue.'
    });
  }
  
  req.userId = req.session.userId;
  next();
}
