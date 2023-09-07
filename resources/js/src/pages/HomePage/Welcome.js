import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CallIcon from "@mui/icons-material/Call";

const Welcome = ({ handleClickOpen, handleStepChange }) => {
    return (
        <Box
            sx={{
                marginY: 5,
                maxWidth: 546,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography component="h6" variant="h4" mb={3} align="center">
                    Hello
                </Typography>
                <Typography component="p" variant="h5" mb={1} align="center">
                    Welcome to Tritek Live Support
                </Typography>
                <Typography component="p" variant="h5" mb={1} align="center">
                    We are live Monday - Friday, 9am - 4pm to take calls.
                </Typography>
                <Box>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleStepChange("initiate")}
                        startIcon={<CallIcon />}
                        size="large"
                    >
                        Initiate a Call
                    </Button>
                </Box>
                <Box
                    sx={{
                        marginTop: 5,
                    }}
                >
                    <Typography
                        component="p"
                        variant="h5"
                        mb={1}
                        align="center"
                    >
                        You can explore our FAQ page or drop your details for a
                        call back using any of the links below.
                    </Typography>
                    <Box
                        sx={{
                            display: "block",
                        }}
                        style={{
                            marginTop: 3,
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleClickOpen}
                            size="large"
                        >
                            Request Call Back
                        </Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            href="https://tritekconsulting.co.uk/faq"
                            target="_blank"
                            size="large"
                            style={{ width: 200 }}
                        >
                            FAQ
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Welcome;
