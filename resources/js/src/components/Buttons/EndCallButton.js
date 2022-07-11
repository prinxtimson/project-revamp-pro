import React from "react";
import { Button } from "@mui/material";

import useVideoContext from "../../hooks/useVideoContext";
import { connect } from "react-redux";
import { endLivecall } from "../../actions/livecall";

const EndCallButton = ({ endLivecall, loading }) => {
    const { room } = useVideoContext();

    return (
        <Button
            onClick={() => endLivecall(room.sid)}
            variant="contained"
            color="error"
            data-cy-disconnect
            size="small"
        >
            End call
        </Button>
    );
};

const mapStateToProps = (state) => ({
    loading: state.livecall.loading,
});

export default connect(mapStateToProps, { endLivecall })(EndCallButton);
