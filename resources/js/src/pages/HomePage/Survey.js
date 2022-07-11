import React from "react";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const axios = window.axios;

const SurveyQuestions = [
    "How would you rate the support you received today?",
    "How happy are you with our Live Support System?",
    "How likely are you to recommend this service to a friend or colleague?",
];

const Survey = () => {
    const [survey, setSurvey] = React.useState({
        ratings: [],
        loading: false,
        successfull: false,
        error: null,
    });

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

    return (
        <Box>
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
            <Button
                variant="contained"
                color="primary"
                size="small"
                disabled={survey.ratings.length < 3 || survey.successfull}
                onClick={handleSubmitSurvey}
            >
                Submit Rating
            </Button>
        </Box>
    );
};

export default Survey;
