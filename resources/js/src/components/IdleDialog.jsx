import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const IdleDialog = ({ open, remaining, onClose }) => {
    return (
        <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="xs">
            <DialogTitle>Are you still there?</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    if not, we'll close this session in {remaining} seconds
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button
                    onClick={onClose}
                    color="primary"
                    variant="contained"
                    autoFocus
                >
                    I'm still here
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default IdleDialog;
