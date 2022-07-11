import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";

function enhanceMessage(message = "", code) {
    switch (true) {
        case code === 20101: // Invalid token error
            return (
                message +
                ". Please make sure you are using the correct credentials."
            );
        case message === "Permission denied by system":
            return "Unable to share your screen. Please make sure that your operating system has the correct permissions enabled for screen sharing.";
        default:
            return message;
    }
}

function ErrorDialog({ dismissError, error }) {
    const { message, code } = error || {};
    const enhancedMessage = enhanceMessage(message, code);

    return (
        <Dialog
            open={error !== null}
            onClose={() => dismissError()}
            fullWidth={true}
            maxWidth="xs"
        >
            <DialogTitle>ERROR</DialogTitle>
            <DialogContent>
                <DialogContentText>{enhancedMessage}</DialogContentText>
                {Boolean(code) && (
                    <pre>
                        <code>Error Code: {code}</code>
                    </pre>
                )}
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => dismissError()}
                    color="primary"
                    autoFocus
                >
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ErrorDialog;
