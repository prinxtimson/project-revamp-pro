import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const Welcome = ({ handleClickOpen, handleStepChange }) => {
    return (
        <Box
            sx={{
                marginY: 5,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography component="h6" variant="h4" mb={3}>
                    Hello
                </Typography>
                <Typography component="p" variant="h5" mb={1}>
                    Welcome to Tritek Live Support
                </Typography>
                <Typography component="p" variant="h5" mb={1}>
                    We are only available on Wednesdays from 12pm - 4pm for a
                    live call.
                </Typography>
                <Box>
                    <Button
                        variant="text"
                        color="primary"
                        onClick={() => handleStepChange("initiate")}
                    >
                        Initiate a Call
                    </Button>
                </Box>
            </Box>
            <Box
                sx={{
                    marginTop: 5,
                }}
            >
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={6}>
                        <Typography component="p" variant="h5" mb={1}>
                            You can explore our FAQ page or drop your details
                            for a call back using any of the links below.
                        </Typography>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleClickOpen}
                                size="small"
                            >
                                Request Call Back
                            </Button>
                            <Button
                                variant="text"
                                color="primary"
                                href="https://tritekconsulting.co.uk/faq"
                                target="_blank"
                                size="small"
                            >
                                FAQ
                            </Button>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}></Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default Welcome;
