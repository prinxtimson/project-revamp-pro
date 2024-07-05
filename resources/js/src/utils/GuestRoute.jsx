import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const GuestRoute = ({ children }) => {
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);

    const redirectPath = location.state?.path || "/dashboard";

    if (user) {
        return <Navigate to={redirectPath} />;
    }

    return children;
};

export default GuestRoute;
