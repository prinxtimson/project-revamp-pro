import React from "react";
import { Box, Typography } from "@mui/material";

const ErrorPage = () => {
    return (
        <Box
            component="main"
            sx={{
                backgroundColor: (theme) =>
                    theme.palette.mode === "light"
                        ? theme.palette.grey[100]
                        : theme.palette.grey[900],
                flexGrow: 1,
                height: "100vh",
                overflow: "auto",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                }}
            >
                <Typography component="h1" variant="h1">
                    404
                </Typography>
                <Typography component="h3" variant="h5">
                    PAGE NOT FOUND
                </Typography>
            </Box>
        </Box>
    );
};

export default ErrorPage;
