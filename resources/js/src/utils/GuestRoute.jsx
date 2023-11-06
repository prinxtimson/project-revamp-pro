import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const GuestRoute = ({ children }) => {
    const location = useLocation();
    const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

    const redirectPath = location.state?.path || "/admin/dashboard";

    if (!isLoading && isAuthenticated) {
        return <Navigate to={redirectPath} />;
    }

    return children;
};

export default GuestRoute;
