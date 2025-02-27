import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ConfirmDialog } from "primereact/confirmdialog";
import { useParams } from "react-router-dom";
import CallbackDialog from "../../components/CallbackDialog";
import { leaveLivecall } from "../../features/livecall/livecallSlice";

import Welcome from "./Welcome";
import MainContainer from "../../components/MainContainer";

const Home = () => {
    const [open, setOpen] = useState(false);
    const { id } = useParams();

    const { livecall } = useSelector((state) => state.livecall);

    const dispatch = useDispatch();

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
                dispatch(leaveLivecall(livecall.id));
            });
        }
    }, [livecall]);

    return (
        <MainContainer>
            <CallbackDialog
                open={open}
                id={id}
                handleOpen={handleClickOpen}
                handleClose={handleClose}
            />
            <ConfirmDialog />
            <Welcome handleCallbackOpen={handleClickOpen} />;
        </MainContainer>
    );
};

export default Home;
