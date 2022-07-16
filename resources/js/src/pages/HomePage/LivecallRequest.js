import React from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const speech = new SpeechSynthesisUtterance();

const LivecallRequest = ({ livecall, handleClickOpen, count }) => {
    const [min, setMin] = React.useState(0);

    React.useEffect(() => {
        let total = count * 5;

        setMin(total);
    }, [count]);

    React.useEffect(() => {
        if (min > 0) {
            if ("speechSynthesis" in window) {
                speech.text =
                    document.getElementById("text-to-speech").innerText;
                window.speechSynthesis.speak(speech);
            }
        }
    }, [min]);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: 5,
            }}
        >
            <Typography
                align="center"
                component="p"
                variant="h5"
                mb={1}
                id="text-to-speech"
            >
                Thank you! it will take approximately {min} minutes to connect
                you to a live agent via audio and/or video call.
            </Typography>
            <Typography align="center" component="p" variant="h5" mb={2}>
                Would you like to request a call back instead?
            </Typography>
            <Box
                sx={{
                    marginTop: 2,
                }}
            >
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleClickOpen}
                    //size="small"
                    disabled={Boolean(livecall.left_at)}
                >
                    Request Call Back
                </Button>
            </Box>
        </Box>
    );
};

export default LivecallRequest;
