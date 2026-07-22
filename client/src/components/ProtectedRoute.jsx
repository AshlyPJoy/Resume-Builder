import { Navigate } from "react-router-dom";

/**
 * Wraps any page that should only be visible to logged-in users.
 *
 * Usage in App.jsx:
 *   <Route
 *     path="/dashboard"
 *     element={
 *       <ProtectedRoute>
 *         <Dashboard />
 *       </ProtectedRoute>
 *     }
 *   />
 *
 * How it works:
 * - Checks localStorage for a token (the same one saved after login/register).
 * - If a token exists, it renders whatever was passed in as `children`
 *   (e.g. <Dashboard />) — access granted.
 * - If there's no token, it redirects to /login instead of rendering
 *   the protected page at all.
 *
 * Note: this only checks that a token EXISTS, not that it's still valid
 * (not expired, not tampered with). Real enforcement happens on the
 * backend via the `protect` middleware — this component just gives a
 * clean UX so logged-out users don't even see a protected page flash
 * on screen before being kicked out.
 */
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;