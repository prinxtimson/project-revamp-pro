import React from "react";
import { connect } from "react-redux";
import LivecallRequest from "./LivecallRequest";
import SupportOption from "./SupportOption";
import Survey from "./Survey";
import Welcome from "./Welcome";
import { requestLivecall } from "../../actions/livecall";

const LiveSupport = ({
    livecall,
    count,
    loading,
    handleClickOpen,
    requestLivecall,
}) => {
    const [step, setStep] = React.useState("welcome");
    const [data, setData] = React.useState({
        query_type: "",
    });

    const handleOnClick = (query) => {
        setData({ query_type: query });
    };

    const handleStepChange = (val) => setStep(val);

    const handleConnect = () => {
        requestLivecall(data, onSuccessful, showSurvey);
    };

    const onSuccessful = () => setStep("waiting");

    const showSurvey = () => setStep("survey");

    switch (step) {
        case "welcome":
            return (
                <Welcome
                    handleClickOpen={handleClickOpen}
                    handleStepChange={handleStepChange}
                />
            );
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
        case "survey":
            return <Survey />;
        default:
            break;
    }
};

const mapStateToProps = (state) => ({
    livecall: state.livecall.livecall,
    count: state.livecall.count,
    loading: state.livecall.loading,
});

export default connect(mapStateToProps, { requestLivecall })(LiveSupport);
