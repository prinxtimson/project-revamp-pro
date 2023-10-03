import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { connect } from "react-redux";

function Copyright(props) {
    return (
        <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            {...props}
        >
            {"Copyright © "}
            <Link color="inherit" href="https://tritekconsulting.co.uk">
                Tritek Consulting Ltd
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}

const theme = createTheme();

const MainContainer = ({ children, alerts }) => {
    return (
        <div className="tw-w-full tw-flex-1 tw-flex tw-flex-col">
            <Stack sx={{ width: "100%" }} spacing={2}>
                {alerts.map((alert) => (
                    <Snackbar
                        anchorOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                        open={Boolean(alert.id)}
                        key={alert.id}
                        autoHideDuration={6000}
                    >
                        <Alert
                            severity={alert.alertType}
                            variant="filled"
                            sx={{ width: "100%" }}
                        >
                            {alert.msg}
                        </Alert>
                    </Snackbar>
                ))}
            </Stack>

            <Box
                sx={{
                    margin: 2,
                }}
            >
                <Avatar
                    variant="square"
                    alt="Tritek Live"
                    src="/images/logo.png"
                    sx={{ width: 168 }}
                >
                    Tritek Live
                </Avatar>
            </Box>
            <div className="tw-flex-1">{children}</div>

            <Copyright sx={{ mt: 2, mb: 2 }} />
        </div>
    );
};

const mapStateToProps = (state) => ({
    alerts: state.alert,
});

export default connect(mapStateToProps)(MainContainer);
