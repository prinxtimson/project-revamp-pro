import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { useParams } from "react-router-dom";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Container from "../../components/Container";
import MainContainer from "../../components/MainContainer";

const axios = window.axios;

const LiveSupportSurveyQuestions = [
    "How user-friendly did you find our live support platform?",
    "Did the support agent communicate clearly and effectively resolve your query?",
    "How satisfied are you with your overall experience?",
];

const CallbackSurveyQuestion = [
    "Did you find the call back request process user friendly?",
    "Did the support agent successfully resolve or answer your questions on the call?",
    "How satisfied are you with your overall experience?",
];

const TicketSurveyQuestion = [
    "How quickly were you able find the option to raise a ticket and was it user friendly?",
    "Did the support agent successfully resolve or answer your questions?",
    "How satisfied are you with your overall experience?",
];

const Survey = ({ livecall }) => {
    const [support, setSupport] = useState(null);
    const [surveyQuestions, setSurveyQuestion] = useState([]);
    const { channel, id } = useParams();
    const [survey, setSurvey] = useState({
        ratings: [],
        comment: "",
        loading: false,
        successfull: false,
        error: null,
    });

    const handleSubmitSurvey = () => {
        setSurvey({ ...survey, loading: true });

        let surveyData = {
            ratings: survey.ratings,
            support_type: channel,
            support_id: support.id,
            user_id: support.user_id || support.agent_id,
            comment: survey.comment,
        };

        axios
            .post("/api/feedback", surveyData)
            .then((res) => {
                setSurvey({ ...survey, loading: false, successfull: true });
            })
            .catch((err) => {
                console.log(err);
                setSurvey({ ...survey, loading: false });
            });
    };

    const handleOnChange = (e) => {
        setSurvey({ ...survey, comment: e.target.value });
    };

    const getTicket = (id) => {
        axios
            .get(`/api/tickets/${id}`)
            .then((res) => setSupport(res.data))
            .catch((e) => console.log(e.response.data));
    };

    const getLivecall = (id) => {
        axios
            .get(`/api/livecall/${id}`)
            .then((res) => setSupport(res.data))
            .catch((e) => console.log(e.response.data));
    };

    const getCallback = (id) => {
        axios
            .get(`/api/callback/${id}`)
            .then((res) => setSupport(res.data))
            .catch((e) => console.log(e.response.data));
    };

    useEffect(() => {
        if (channel) {
            switch (channel) {
                case "livecall":
                    getLivecall(id);
                    setSurveyQuestion(LiveSupportSurveyQuestions);
                    break;
                case "callback":
                    getCallback(id);
                    setSurveyQuestion(CallbackSurveyQuestion);
                    break;
                case "ticket":
                    getTicket(id);
                    setSurveyQuestion(TicketSurveyQuestion);
                    break;
                default:
                    break;
            }
        }
    }, [channel]);

    return (
        <MainContainer>
            <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-p-2 tw-h-full">
                <div className="tw-shadow-md tw-rounded-md tw-border tw-p-2 md:tw-p-5">
                    <div className="tw-my-2 ">
                        <h2 className="tw-text-2xl tw-font-semibold tw-text-center">
                            {survey.successfull
                                ? "Thank You!"
                                : "Leave Your Feedback"}
                        </h2>
                    </div>
                    <Box maxWidth={545} minWidth={465}>
                        {survey.successfull ? (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    marginY: 5,
                                }}
                            >
                                <Typography component="p" variant="h5" mb={5}>
                                    Your feedback has been successfully
                                    submitted.
                                </Typography>
                                <Button
                                    variant="text"
                                    color="primary"
                                    href="https://tritekconsulting.co.uk/"
                                    size="small"
                                >
                                    Return to Tritek Consulting Ltd
                                </Button>
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
                                <div className="tw-my-4">
                                    <h3 className="tw-text-xl tw-font-medium">
                                        On a scale of 1 - 10, rate your
                                        experience. 1 being very poor and 10
                                        being excellent.
                                    </h3>
                                </div>
                                {surveyQuestions.map((question, index) => (
                                    <div key={index} className="tw-mb-5">
                                        <div className="tw-flex">
                                            <div className="tw-mr-3">
                                                {index + 1}.
                                            </div>
                                            <div className="">
                                                <Typography component="legend">
                                                    {question}
                                                </Typography>
                                                <Rating
                                                    name={question}
                                                    max={10}
                                                    value={
                                                        survey.ratings[index]
                                                            ?.rating || 0
                                                    }
                                                    onChange={(
                                                        event,
                                                        newValue
                                                    ) => {
                                                        let currentRatings =
                                                            survey.ratings;
                                                        currentRatings[index] =
                                                            {
                                                                question,
                                                                rating: newValue,
                                                            };
                                                        setSurvey({
                                                            ...survey,
                                                            ratings:
                                                                currentRatings,
                                                        });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <TextField
                                    label="Your comment"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    onChange={handleOnChange}
                                    margin="normal"
                                />
                                <Grid
                                    container
                                    spacing={1}
                                    sx={{ marginTop: 1 }}
                                >
                                    <Grid item xs={12} sm />
                                    <Grid item xs={12} sm>
                                        <button
                                            className={`tw-p-4 tw-font-semibold tw-text-sm  tw-text-white tw-rounded-md tw-shadow-lg tw-m-auto tw-self-center tw-w-48 ${
                                                survey.loading
                                                    ? "tw-bg-indigo-300"
                                                    : "tw-bg-indigo-500 hover:tw-bg-indigo-700"
                                            }`}
                                            disabled={
                                                survey.ratings.length < 3 ||
                                                survey.successfull
                                            }
                                            onClick={handleSubmitSurvey}
                                        >
                                            Submit
                                        </button>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}
                    </Box>
                </div>
            </div>
        </MainContainer>
    );
};

export default Survey;
