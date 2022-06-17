import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
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
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <Stack sx={{ width: "100%" }} spacing={2}>
                    {alerts.map(
                        (alert) =>
                            alert.alertType === "success" && (
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
                                        severity="success"
                                        variant="filled"
                                        sx={{ width: "100%" }}
                                    >
                                        {alert.msg}
                                    </Alert>
                                </Snackbar>
                            )
                    )}
                </Stack>
                <CssBaseline />
                {children}
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider>
    );
};

const mapStateToProps = (state) => ({
    alerts: state.alert,
});

export default connect(mapStateToProps)(MainContainer);
