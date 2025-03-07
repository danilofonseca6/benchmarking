import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";

const ProtectedRoute = ({ children }) => {
    const { userLoggedIn, loading } = useAuth();

    if (loading) return null; // Prevent redirecting before authentication check completes

    return userLoggedIn ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
