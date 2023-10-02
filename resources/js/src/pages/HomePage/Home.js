import { useState, useEffect } from "react";
import { ConfirmDialog } from "primereact/confirmdialog";
import { useParams } from "react-router-dom";
import Container from "../../components/Container";
import CallbackDialog from "../../components/CallbackDialog";
import { leaveLivecall } from "../../actions/livecall";
import { connect } from "react-redux";

import Welcome from "./Welcome";

const Home = ({ livecall, leaveLivecall }) => {
    const [open, setOpen] = useState(false);
    const { id } = useParams();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (livecall) {
            window.addEventListener("beforeunload", (e) => {
                e.preventDefault();
                e.returnValue = "Are you sure you want to close?";
            });
            window.addEventListener("unload", (e) => {
                e.preventDefault();
                leaveLivecall(livecall.id);
            });
        }
    }, [livecall]);

    return (
        <Container>
            <CallbackDialog
                open={open}
                id={id}
                handleOpen={handleClickOpen}
                handleClose={handleClose}
            />
            <ConfirmDialog />
            <Welcome handleCallbackOpen={handleClickOpen} />;
        </Container>
    );
};

const mapStateToProps = (state) => ({
    livecall: state.livecall.livecall,
});

export default connect(mapStateToProps, { leaveLivecall })(Home);
