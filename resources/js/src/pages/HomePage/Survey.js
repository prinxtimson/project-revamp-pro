import React from "react";
import Grid from "@mui/material/Grid";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

const axios = window.axios;

const SurveyQuestions = [
    "How would you rate the support you received today?",
    "How happy are you with our Live Support System?",
    "How likely are you to recommend this service to a friend or colleague?",
];

const Survey = ({ livecall }) => {
    const [survey, setSurvey] = React.useState({
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
            livecall: livecall.id,
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

    return (
        <Box>
            {survey.successfull ? (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Typography component="p" variant="h5" mb={2}>
                        Thank you for your feedback.
                    </Typography>
                    <Button
                        variant="text"
                        color="primary"
                        href="https://tritekconsulting.co.uk/"
                        size="small"
                    >
                        Return to Home
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
                            <Typography component="legend" align="center">
                                {question}
                            </Typography>
                            <Rating
                                name={question}
                                value={survey.ratings[index]?.rating || 0}
                                onChange={(event, newValue) => {
                                    let currentRatings = survey.ratings;
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
                    <TextField
                        label="Your comment"
                        fullWidth
                        multiline
                        rows={4}
                        onChange={handleOnChange}
                    />
                    <Grid container spacing={2} sx={{ marginTop: 4 }}>
                        <Grid item xs={12} sm>
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
                        </Grid>
                        <Grid item xs={12} sm>
                            <Button
                                variant="text"
                                color="primary"
                                href="https://tritekconsulting.co.uk/"
                                size="small"
                            >
                                Return to Home
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            )}
        </Box>
    );
};

export default Survey;
