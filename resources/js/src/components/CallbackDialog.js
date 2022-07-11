import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import moment from "moment";
import { connect } from "react-redux";
import { requestCallback } from "../actions/callback";

const CallbackDialog = ({
    open,
    livecall,
    handleClose,
    loading,
    requestCallback,
}) => {
    let minDate = new Date().toISOString();
    let maxDate = new Date(moment().weekday(5)).toISOString();
    const [formData, setFormData] = React.useState({
        name: "",
        email: "",
        phone: "",
        time: "",
        date: new Date().toISOString().split("T")[0],
    });

    const handleOnChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = () => {
        requestCallback(livecall.id, formData, onSuccessful);
    };

    const onSuccessful = () => {
        handleClose();
        setFormData({
            name: "",
            email: "",
            phone: "",
            time: "",
            date: new Date().toISOString().split("T")[0],
        });
    };

    return (
        <div>
            <Dialog open={open} onClose={handleClose} sx={{ padding: 5 }}>
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
                            value={formData.name}
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
                            value={formData.email}
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
                            value={formData.phone}
                            onChange={handleOnChange}
                            autoComplete="phone"
                        />
                        <TextField
                            id="time"
                            select
                            margin="normal"
                            required
                            fullWidth
                            name="time"
                            label="Time"
                            value={formData.time}
                            onChange={handleOnChange}
                            helperText="available time is week days between 8am - 4pm"
                            SelectProps={{
                                native: true,
                            }}
                            variant="outlined"
                        >
                            <option />
                            <option value="10:00 - 11:00">10:00 - 11:00</option>
                            <option value="11:00 - 12:00">11:00 - 12:00</option>
                            <option value="12:00 - 13:00">12:00 - 13:00</option>
                            <option value="13:00 - 14:00">13:00 - 14:00</option>
                            <option value="14:00 - 15:00">14:00 - 15:00</option>
                            <option value="15:00 - 16:00">15:00 - 16:00</option>
                        </TextField>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="date"
                            label="Date"
                            id="date"
                            value={formData.date || minDate.split("T")[0]}
                            onChange={handleOnChange}
                            type="date"
                            inputProps={{
                                min: minDate.split("T")[0],
                                max: maxDate.split("T")[0],
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
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

const mapStateToProps = (state) => ({
    livecall: state.livecall.livecall,
    loading: state.callback.loading,
});

export default connect(mapStateToProps, { requestCallback })(CallbackDialog);
