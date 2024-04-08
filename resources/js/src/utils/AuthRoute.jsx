import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const AuthRoute = ({ children }) => {
    const location = useLocation();
    const { user, isAuthenticated, isLoading } = useSelector(
        (state) => state.auth
    );

    if (!isLoading && !isAuthenticated) {
        return (
            <Navigate to="/admin/logout" state={{ path: location.pathname }} />
        );
    }

    if (!isLoading && isAuthenticated && !user) {
        return (
            <Navigate
                to="/admin/two-factor-auth"
                state={{ path: location.pathname }}
            />
        );
    }

    return children;
};

export default AuthRoute;
