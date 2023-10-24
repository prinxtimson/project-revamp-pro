import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const ThankYou = ({ handleStepChange }) => {
    return (
        <Box
            sx={{
                marginY: 5,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Typography component="p" variant="h5" mb={1}>
                Thank you for using our Live Support platform.
            </Typography>
            <Typography component="p" variant="h5" mb={2}>
                Please leave a feedback, we love to hear from you to help serve
                you better.
            </Typography>
            <Box>
                <Button
                    variant="text"
                    color="primary"
                    onClick={() => handleStepChange("survey")}
                >
                    Feedback
                </Button>
            </Box>
        </Box>
    );
};

export default ThankYou;
