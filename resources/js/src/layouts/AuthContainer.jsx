import { Toast } from "primereact/toast";
import { Link } from "react-router-dom";
import TritekFullLogo from "../components/TritekFullLogo";

const AuthContainer = ({ children, toast }) => {
    return (
        <div className="tw-w-full sm:tw-w-[720px] md:tw-w-[960px] lg:tw-w-[1140px] xl:tw-w-[1320px] tw-flex tw-flex-col tw-grow ">
            <Toast ref={toast} />

            <div className="tw-grow tw-flex tw-flex-col tw-items-center tw-justify-center">
                <div className=" tw-mx-5 tw-my-3">
                    <Link to="/">
                        <TritekFullLogo />
                    </Link>
                </div>
                <div className="tw-w-full md:tw-w-[30rem] tw-bg-white tw-shadow-md tw-border tw-rounded-xl tw-p-3 sm:tw-p-6">
                    {children}
                </div>
            </div>

            <div className="tw-my-6 tw-self-center">
                <small className="tw-text-center tw-text-stone-500 tw-w-fit">
                    Copyright &copy;{new Date().getFullYear()}{" "}
                    <a href="https://tritekconsulting.co.uk">
                        Tritek Consulting Ltd.
                    </a>
                </small>
            </div>
        </div>
    );
};

export default AuthContainer;
