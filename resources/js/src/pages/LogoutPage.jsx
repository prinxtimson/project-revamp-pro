import React from "react";
import { Button } from "primereact/button";
import { useNavigate, Link } from "react-router-dom";
import MainContainer from "../components/MainContainer";

const LogoutPage = () => {
    const navigate = useNavigate();

    return (
        <MainContainer>
            <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-w-[35rem] tw-bg-white tw-h-[25rem]">
                <h1 className="tw-text-5xl tw-font-bold">Logout successful</h1>
                <h4 className="tw-text-xl tw-mt-0">
                    Click{" "}
                    <Link to="/admin" className="tw-underline tw-text-blue-500">
                        here
                    </Link>{" "}
                    to login again
                </h4>
                <Button label="Login" onClick={() => navigate("/admin")} />
            </div>
        </MainContainer>
    );
};

export default LogoutPage;
