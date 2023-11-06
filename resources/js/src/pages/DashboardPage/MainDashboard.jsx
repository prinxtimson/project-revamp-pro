import { useSelector } from "react-redux";
import DrawerContainer from "./DrawerContainer";
import ManagementDashboard from "./ManagementDashboard";
import Dashboard from "./Dashboard";

const MainDashboard = () => {
    const { user, isLoading } = useSelector((state) => state.auth);

    if (isLoading) {
        return (
            <DrawerContainer>
                <div className="tw-grow tw-p-4 tw-flex tw-flex-col tw-items-center tw-justify-center">
                    <i
                        className="pi pi-spin pi-spinner"
                        style={{ fontSize: "3em" }}
                    ></i>
                </div>
            </DrawerContainer>
        );
    }

    if (user?.roles[0].name === "agent") {
        return <Dashboard />;
    } else {
        return <ManagementDashboard />;
    }
};

export default MainDashboard;
