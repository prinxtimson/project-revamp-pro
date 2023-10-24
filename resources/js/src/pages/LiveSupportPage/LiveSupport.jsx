import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Container from "../../components/Container";
import Rating from "@mui/material/Rating";
import {
    requestLivecall,
    getWaitingListPosition,
    leaveLivecall,
} from "../../features/livecall/livecallSlice";
import {
    requestCallback,
    getCallbacks,
} from "../../features/callback/callbackSlice";
import CallbackDialog from "../../components/CallbackDialog";

const axios = window.axios;

const Steps = {
    welcome: "welcome",
    connect: "connect",
    waiting: "waiting",
    faq: "faq",
    survey: "survey",
};

const SurveyQuestions = [
    "How would you rate the support you received today?",
    "How happy are you with our Live Support System?",
    "How likely are you to recommend this service to a friend or colleague?",
];

const LiveSupport = () => {
    const [step, setStep] = useState([Steps.welcome]);
    const [open, setOpen] = useState(false);
    const [min, setMin] = useState(0);
    const [data, setData] = useState({
        query_type: "",
    });
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        time: "",
        date: new Date().toISOString().split("T")[0],
    });
    const [survey, setSurvey] = useState({
        ratings: [],
        loading: false,
        successfull: false,
        error: null,
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { livecall, isLoading, isSuccess, isError, count, type, message } =
        useSelector((state) => state.livecall);

    const {
        isLoading: callbackLoading,
        type: callbackType,
        message: callbackMessage,
        isSuccess: callbackSuccess,
    } = useSelector((state) => state.callback);

    const handleSubmitSurvey = () => {
        setSurvey({ ...survey, loading: true });
        let surveyData = {
            ratings: survey.ratings,
            livecall: livecall.id,
        };

        axios
            .post("/api/feedback", surveyData)
            .then((res) => {
                console.log(res.data);
                setSurvey({ ...survey, loading: false, successfull: true });
            })
            .catch((err) => {
                console.log(err);
                setSurvey({ ...survey, loading: false });
            });
    };

    const handleOnClick = (query) => {
        setData({ query_type: query });
        setStep([...step, Steps.connect]);
    };

    const handleOnChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSuccessful = () => {
        handleClose();
        setFormData({
            name: "",
            email: "",
            phone: "",
            time: "",
            date: new Date().toISOString().split("T")[0],
        });
        showSurveyForm();
    };

    useEffect(() => {
        let total = count * 5;

        setMin(total);
    }, [count]);

    useEffect(() => {
        dispatch(getWaitingListPosition());
        dispatch(getCallbacks());
    }, []);

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

    const handleConnect = () => {
        dispatch(requestLivecall(data));
    };

    useEffect(() => {
        if (type == "livecall/request/fulfilled") {
            onLivecallRequest();
            showSurveyForm();
        }
    }, [livecall, isLoading, isSuccess, isError, message]);

    useEffect(() => {
        if (callbackSuccess && callbackType == "callback/new/fulfilled") {
            if (livecall) {
                dispatch(leaveLivecall(livecall.id));
            }
            onSuccessful();
        }
    }, [callbackLoading, callbackType, callbackMessage, callbackSuccess]);

    const onLivecallRequest = () => {
        setStep([...step, Steps.waiting]);

        setTimeout(() => {
            setStep([...step, Steps.waiting, Steps.faq]);
        }, 5000);
    };

    const showSurveyForm = () => {
        setStep([...step, Steps.survey]);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = () => {
        //console.log(formData);
        dispatch(requestCallback(formData));
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
                <Box
                    component="span"
                    sx={{
                        margin: 2,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "white",
                        padding: 2,
                    }}
                >
                    <Avatar
                        variant="square"
                        alt="Dev Arena"
                        src="/images/logo.png"
                        sx={{ width: 128, height: 32 }}
                    >
                        Dev Arena
                    </Avatar>
                </Box>
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
                                            handleOnClick(
                                                "Second Project Request"
                                            )
                                        }
                                    >
                                        <ListItemText secondary="Second Project Request" />
                                    </ListItem>
                                    <ListItem
                                        alignItems="center"
                                        button
                                        disabled={Boolean(data.query_type)}
                                        onClick={() =>
                                            handleOnClick("Mentor Request")
                                        }
                                    >
                                        <ListItemText secondary="Mentor Request" />
                                    </ListItem>
                                    <ListItem
                                        alignItems="center"
                                        button
                                        disabled={Boolean(data.query_type)}
                                        onClick={() =>
                                            handleOnClick("Developer Request")
                                        }
                                    >
                                        <ListItemText secondary="Developer Request" />
                                    </ListItem>
                                    <ListItem
                                        alignItems="center"
                                        button
                                        disabled={Boolean(data.query_type)}
                                        onClick={() =>
                                            handleOnClick("Referencing")
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
                                            handleOnClick("Taster Session")
                                        }
                                    >
                                        <ListItemText secondary="Taster Session" />
                                    </ListItem>
                                    <ListItem
                                        alignItems="center"
                                        button
                                        disabled={Boolean(data.query_type)}
                                        onClick={() => handleOnClick("Enquiry")}
                                    >
                                        <ListItemText secondary="Course Enquiry" />
                                    </ListItem>
                                    <ListItem
                                        alignItems="center"
                                        button
                                        disabled={Boolean(data.query_type)}
                                        onClick={() =>
                                            handleOnClick(
                                                "New Candidate Support"
                                            )
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
                                            handleOnClick("Software issues")
                                        }
                                    >
                                        <ListItemText secondary="Software issues" />
                                    </ListItem>
                                    <ListItem
                                        alignItems="center"
                                        button
                                        disabled={Boolean(data.query_type)}
                                        onClick={() =>
                                            handleOnClick("LMS queries")
                                        }
                                    >
                                        <ListItemText secondary="LMS queries" />
                                    </ListItem>
                                    <ListItem
                                        alignItems="center"
                                        button
                                        disabled={Boolean(data.query_type)}
                                        onClick={() =>
                                            handleOnClick("Access issue")
                                        }
                                    >
                                        <ListItemText secondary="Access issue" />
                                    </ListItem>
                                    <ListItem
                                        alignItems="center"
                                        button
                                        disabled={Boolean(data.query_type)}
                                        onClick={() =>
                                            handleOnClick("Other IT issues")
                                        }
                                    >
                                        <ListItemText secondary="Other IT issues" />
                                    </ListItem>
                                </List>
                            </Box>
                        </Grid>
                    </Grid>
                    {step.includes("connect") && (
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
                                disabled={isLoading || Boolean(livecall)}
                                onClick={handleConnect}
                            >
                                {data.query_type && isLoading
                                    ? "Connecting"
                                    : "Connect"}
                            </Button>
                        </Box>
                    )}

                    {step.includes("waiting") && livecall && (
                        <Box
                            sx={{
                                padding: 2,
                                backgroundColor: "#fff",
                                borderRadius: 1.5,
                                marginTop: 5,
                            }}
                        >
                            <Typography component="p" variant="p">
                                Thank you! it will take approximately {min}{" "}
                                minutes to connect you to a live agent via audio
                                and/or video call.
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
                                        disabled={Boolean(livecall.left_at)}
                                    >
                                        Request Call Back
                                    </Button>
                                </Grid>
                                <Grid item xs>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        disabled={Boolean(livecall.left_at)}
                                        onClick={() => {
                                            setStep([...step, Steps.faq]);
                                        }}
                                    >
                                        Wait to speak to agent
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {step.includes("faq") && livecall && (
                        <Box
                            sx={{
                                padding: 2,
                                backgroundColor: "#fff",
                                borderRadius: 1.5,
                                marginTop: 5,
                            }}
                        >
                            <Typography component="p" variant="p">
                                You can access our FAQ page by clicking on this
                                button. You will be redirected to our FAQ page
                                as you wait to be connected to an agent.
                            </Typography>
                            <Typography component="p" variant="p">
                                Thank you.
                            </Typography>
                            <Grid
                                sx={{ marginTop: 2 }}
                                container
                                justifyContent="center"
                                alignItems="center"
                                spacing={3}
                            >
                                <Grid item xs={4}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{
                                            "&:hover": {
                                                color: "#fff",
                                            },
                                        }}
                                        href="https://tritekconsulting.co.uk/faq"
                                        target="_blank"
                                        size="small"
                                        fullWidth
                                    >
                                        FAQ
                                    </Button>
                                </Grid>
                                <Grid item xs={8}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        disabled={Boolean(livecall.left_at)}
                                        onClick={() => {
                                            setStep([...step, Steps.survey]);
                                        }}
                                    >
                                        Wait to be connected
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                    {step.includes("survey") && livecall && (
                        <Box
                            sx={{
                                padding: 2,
                                borderWidth: 0.5,
                                borderRadius: 1,
                                marginTop: 5,
                            }}
                        >
                            {!survey.loading && survey.successfull ? (
                                <div>
                                    <Typography component="p" variant="h5">
                                        Thank you for completing our survey.
                                    </Typography>
                                </div>
                            ) : (
                                <>
                                    {SurveyQuestions.map((question, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                marginBottom: 10,
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Typography component="legend">
                                                {question}
                                            </Typography>
                                            <Rating
                                                name={question}
                                                value={
                                                    survey.ratings[index]
                                                        ?.rating || 0
                                                }
                                                onChange={(event, newValue) => {
                                                    let currentRatings =
                                                        survey.ratings;
                                                    currentRatings[index] = {
                                                        question,
                                                        rating: newValue,
                                                    };
                                                    setSurvey({
                                                        ...survey,
                                                        ratings: currentRatings,
                                                    });
                                                }}
                                            />
                                        </div>
                                    ))}
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        disabled={
                                            survey.ratings.length < 3 ||
                                            survey.successfull
                                        }
                                        onClick={handleSubmitSurvey}
                                    >
                                        Submit Rating
                                    </Button>
                                </>
                            )}
                        </Box>
                    )}
                </Box>
            </Box>
        </Container>
    );
};

export default LiveSupport;
