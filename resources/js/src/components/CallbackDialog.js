import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";

const CallbackDialog = ({
    open,
    data,
    handleClose,
    handleSubmit,
    handleOnChange,
    loading,
}) => {
    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Request Callback</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        We will be delighted to speak to you about our services
                        and offer advice Please provide your contact information
                        below and a member of our team will call you back at a
                        convenient time.
                    </DialogContentText>
                    <Box sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Name"
                            name="name"
                            autoComplete="name"
                            value={data.name}
                            onChange={handleOnChange}
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            value={data.email}
                            onChange={handleOnChange}
                            autoComplete="email"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="phone"
                            label="Phone Number"
                            id="phone"
                            value={data.phone}
                            onChange={handleOnChange}
                            autoComplete="phone"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="time"
                            label="Time"
                            id="time"
                            type="time"
                            value={data.time}
                            onChange={handleOnChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="date"
                            label="Date"
                            id="date"
                            value={data.date}
                            onChange={handleOnChange}
                            type="date"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default CallbackDialog;
