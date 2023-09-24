import React from "react";
import { connect } from "react-redux";
import { confirmDialog } from "primereact/confirmdialog";
import LivecallRequest from "./LivecallRequest";
import SupportOption from "./SupportOption";
import Survey from "./Survey";
import Welcome from "./Welcome";
import {
    requestLivecall,
    getConnectedLivecalls,
    clearLivecall,
} from "../../actions/livecall";
import ThankYou from "./ThankYou";
import UserMainContainer from "../../components/UserMainContainer";

const LiveSupport = ({
    livecall,
    count,
    step,
    setStep,
    loading,
    handleClickOpen,
    requestLivecall,
    getConnectedLivecalls,
    clearLivecall,
}) => {
    const [data, setData] = React.useState({
        query_type: "",
    });

    const handleOnClick = (query) => {
        setData({ query_type: query });
    };

    const handleStepChange = (val) => setStep(val);

    const handleConnect = () => {
        requestLivecall(data, onSuccessful, confirm);
    };

    const confirm = (e) => {
        confirmDialog({
            message: "You will now be transferred to an agent.",
            header: "Confirmation",
            icon: "pi pi-exclamation-triangle",
            accept: () => {
                setStep("thank-you");
                window.open(`/conferencing/${e.data.id}?pwd=${e.password}`);
            },
            reject: () => setStep("thank-you"),
        });
    };

    const onSuccessful = () => setStep("waiting");

    React.useEffect(() => {
        getConnectedLivecalls();

        return () => {
            clearLivecall();
        };
    }, []);
    {
        /* <Welcome
                    handleClickOpen={handleClickOpen}
                    handleStepChange={handleStepChange}
                /> */
    }
    switch (step) {
        case "welcome":
            return <Welcome handleCallbackOpen={handleClickOpen} />;
        case "initiate":
            return (
                <SupportOption
                    data={data}
                    loading={loading}
                    handleOnClick={handleOnClick}
                    handleStepChange={handleStepChange}
                    handleConnect={handleConnect}
                />
            );
        case "waiting":
            return (
                <LivecallRequest
                    handleClickOpen={handleClickOpen}
                    livecall={livecall}
                    count={count}
                />
            );
        case "thank-you":
            return <ThankYou handleStepChange={handleStepChange} />;
        case "survey":
            return <Survey livecall={livecall} />;
        default:
            break;
    }
};

const mapStateToProps = (state) => ({
    livecall: state.livecall.livecall,
    count: state.livecall.count,
    loading: state.livecall.loading,
});

export default connect(mapStateToProps, {
    requestLivecall,
    getConnectedLivecalls,
    clearLivecall,
})(LiveSupport);
