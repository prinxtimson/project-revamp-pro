import React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Container from "../../components/Container";
import { connect } from "react-redux";
import { requestLivecall, getLivecalls } from "../../actions/livecall";
import { requestCallback, getCallbacks } from "../../actions/callback";
import CallbackDialog from "../../components/CallbackDialog";

const LiveSupport = ({
    livecall,
    loading,
    requestLivecall,
    getLivecalls,
    requestCallback,
    callbackLoading,
    getCallbacks,
}) => {
    const d = new Date();
    const [open, setOpen] = React.useState(false);
    const [data, setData] = React.useState({
        query_type: "",
    });
    const [formData, setFormData] = React.useState({
        name: "",
        email: "",
        phone: "",
        time: "",
        date: "",
    });

    const handleOnChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSuccessful = () => {
        handleClose();
        setFormData({ name: "", email: "", phone: "", time: "", date: "" });
    };

    React.useState(() => {
        getLivecalls();
        getCallbacks();
    }, []);

    const handleConnect = () => {
        requestLivecall(data);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = () => {
        //console.log(formData);

        requestCallback(formData, onSuccessful);
    };

    const scrollToBottom = () => {
        window.scrollTo({});
    };
    return (
        <Container>
            <Box
                sx={{
                    marginTop: 5,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <CallbackDialog
                    open={open}
                    data={formData}
                    handleClose={handleClose}
                    handleSubmit={handleSubmit}
                    handleOnChange={handleOnChange}
                    loading={callbackLoading}
                />
                <Typography component="h2" variant="h5">
                    Tritek Live Support
                </Typography>
                <Box
                    sx={{
                        marginTop: 4,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Box
                        sx={{
                            padding: 2,
                            backgroundColor: "#fff",
                            borderRadius: 1.5,
                            marginBottom: 2,
                        }}
                    >
                        <Typography component="p" variant="p">
                            Hello! Thank you for using Tritek Live Support
                        </Typography>
                        <Typography component="p" variant="p">
                            What can we help you with?
                        </Typography>
                    </Box>
                    <Grid container justifyContent="center">
                        <Grid item xs>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    margin: 0.5,
                                    borderRadius: 1,
                                    backgroundColor: "#bec8f7",
                                    height: "100%",
                                }}
                            >
                                <Typography component="p" variant="h6">
                                    Project
                                </Typography>
                                <List>
                                    <ListItem
                                        alignItems="center"
                                        button
                                        disabled={Boolean(data.query_type)}
                                        onClick={() =>
                                            setData({
                                                ...data,
                                                query_type:
                                                    "Second Project Request",
                                            })
                                        }
                                    >
                                        <ListItemText secondary="Second Project Request" />
                                    </ListItem>
                                    <ListItem
                                        alignItems="center"
                                        button
                                        disabled={Boolean(data.query_type)}
                                        onClick={() =>
                                            setData({
                                                ...data,
                                                query_type: "Mentor Request",
                                            })
                                        }
                                    >
                                        <ListItemText secondary="Mentor Request" />
                                    </ListItem>
                                    <ListItem
                                        alignItems="center"
                                        button
                                        disabled={Boolean(data.query_type)}
                                        onClick={() =>
                                            setData({
                                                ...data,
                                                query_type: "Developer Request",
                                            })
                                        }
                                    >
                                        <ListItemText secondary="Developer Request" />
                                    </ListItem>
                                    <ListItem
                                        alignItems="center"
                                        button
                                        disabled={Boolean(data.query_type)}
                                        onClick={() =>
                                            setData({
                                                ...data,
                                                query_type: "Referencing",
                                            })
                                        }
                                    >
                                        <ListItemText secondary="Referencing" />
                                    </ListItem>
                                </List>
                            </Box>
                        </Grid>
                        <Grid item xs>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    margin: 0.5,
                                    borderRadius: 1,
                                    backgroundColor: "#bec8f7",
                                    height: "100%",
                                }}
                            >
                                <Typography component="p" variant="h6">
                                    Admin
                                </Typography>
                                <List>
                                    <ListItem
                                        alignItems="center"
                                        button
                                        disabled={Boolean(data.query_type)}
                                        onClick={() =>
                                            setData({
                                                ...data,
                                                query_type: "Taster Session",
                                            })
                                        }
                                    >
                                        <ListItemText secondary="Taster Session" />
                                    </ListItem>
                                    <ListItem
                                        alignItems="center"
                                        button
                                        disabled={Boolean(data.query_type)}
                                        onClick={() =>
                                            setData({ ...data, query_type: "" })
                                        }
                                    >
                                        <ListItemText secondary="" />
                                    </ListItem>
                                    <ListItem
                                        alignItems="center"
                                        button
                                        disabled={Boolean(data.query_type)}
                                        onClick={() =>
                                            setData({
                                                ...data,
                                                query_type: "Enquiry",
                                            })
                                        }
                                    >
                                        <ListItemText secondary="Enquiry" />
                                    </ListItem>
                                    <ListItem
                                        alignItems="center"
                                        button
                                        disabled={Boolean(data.query_type)}
                                        onClick={() =>
                                            setData({
                                                ...data,
                                                query_type:
                                                    "New Candidate Support",
                                            })
                                        }
                                    >
                                        <ListItemText secondary="New Candidate Support" />
                                    </ListItem>
                                </List>
                            </Box>
                        </Grid>
                        <Grid item xs>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    margin: 0.5,
                                    borderRadius: 1,
                                    backgroundColor: "#bec8f7",
                                    height: "100%",
                                }}
                            >
                                <Typography component="p" variant="h6">
                                    IT
                                </Typography>
                                <List>
                                    <ListItem
                                        alignItems="center"
                                        button
                                        disabled={Boolean(data.query_type)}
                                        onClick={() =>
                                            setData({
                                                ...data,
                                                query_type: "Software issues",
                                            })
                                        }
                                    >
                                        <ListItemText secondary="Software issues" />
                                    </ListItem>
                                    <ListItem
                                        alignItems="center"
                                        button
                                        disabled={Boolean(data.query_type)}
                                        onClick={() =>
                                            setData({
                                                ...data,
                                                query_type: "LMS queries",
                                            })
                                        }
                                    >
                                        <ListItemText secondary="LMS queries" />
                                    </ListItem>
                                    <ListItem
                                        alignItems="center"
                                        button
                                        disabled={Boolean(data.query_type)}
                                        onClick={() =>
                                            setData({
                                                ...data,
                                                query_type: "Access issue",
                                            })
                                        }
                                    >
                                        <ListItemText secondary="Access issue" />
                                    </ListItem>
                                    <ListItem
                                        alignItems="center"
                                        button
                                        disabled={Boolean(data.query_type)}
                                        onClick={() =>
                                            setData({
                                                ...data,
                                                query_type: "Other IT issues",
                                            })
                                        }
                                    >
                                        <ListItemText secondary="Other IT issues" />
                                    </ListItem>
                                </List>
                            </Box>
                        </Grid>
                    </Grid>
                    {data.query_type && (
                        <Box
                            sx={{
                                padding: 2,
                                backgroundColor: "#fff",
                                borderRadius: 1.5,
                                marginTop: 5,
                            }}
                        >
                            <Typography component="p" variant="p">
                                You will now be connected to a live agent.
                                Please click the button below to proceed,
                            </Typography>

                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                disabled={loading || Boolean(livecall)}
                                onClick={handleConnect}
                            >
                                {data.query_type && loading
                                    ? "Connecting"
                                    : "Connect"}
                            </Button>
                        </Box>
                    )}

                    {data.query_type && livecall && (
                        <Box
                            sx={{
                                padding: 2,
                                backgroundColor: "#fff",
                                borderRadius: 1.5,
                                marginTop: 5,
                            }}
                        >
                            <Typography component="p" variant="p">
                                Thank you! it will take approximately 4 minutes
                                to connect you to a live agent via audio and/or
                                video call.
                            </Typography>
                            <Typography component="p" variant="p">
                                Would you like to request a call back instead?
                            </Typography>
                            <Grid
                                sx={{ marginTop: 2 }}
                                container
                                justifyContent="center"
                            >
                                <Grid item xs>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleClickOpen}
                                        size="small"
                                    >
                                        Request Call Back
                                    </Button>
                                </Grid>
                                <Grid item xs>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                    >
                                        Wait to speak to agent
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </Box>
            </Box>
        </Container>
    );
};

const mapStateToProps = (state) => ({
    livecall: state.livecall.livecall,
    loading: state.livecall.loading,
    callbackLoading: state.callback.loading,
});

export default connect(mapStateToProps, {
    requestLivecall,
    getLivecalls,
    requestCallback,
    getCallbacks,
})(LiveSupport);
