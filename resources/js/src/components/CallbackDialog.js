import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormHelperText from "@mui/material/FormHelperText";
import "react-phone-input-2/lib/material.css";
import PhoneInput from "react-phone-input-2";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import moment from "moment";
import { connect } from "react-redux";
import {
    requestCallback,
    getCallbacksByDate,
    clearCallback,
    getCallbackById,
    updateCallback,
    cancelCallback,
} from "../actions/callback";
import TimePicker from "./TimePicker";

const QUERY_TYPE = [
    "Second Project Request",
    "Mentor Request",
    "Developer Request",
    "Referencing",
    "Taster Session",
    "Course Enquiry",
    "New Candidate Support",
    "Software Issues",
    "LMS Queries",
    "Access Issue",
    "Other IT Issues",
];

const CallbackDialog = ({
    id,
    open,
    callbacks,
    callback,
    livecall,
    handleClose,
    handleOpen,
    loading,
    requestCallback,
    getCallbacksByDate,
    clearCallback,
    getCallbackById,
    updateCallback,
    cancelCallback,
}) => {
    const [openRes, setOpenRes] = useState(false);
    const [msg, setMsg] = useState("");
    let minDate = new Date().toISOString();
    let maxDate = new Date(moment().add("2", "weeks")).toISOString();
    const [formError, setFormError] = useState({});
    const [selectedTime, setSelectedTime] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        query_type: "",
        phone: "",
        time: "",
        date: new Date().toISOString().split("T")[0],
    });
    const emailValidation =
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const handleOnChange = (e) => {
        if (e.target.name == "date") {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value,
                time: "",
            });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    useEffect(() => {
        let endOfWeek = moment().endOf("week");
        let _dd = moment(endOfWeek.toDate()).add("2", "weeks");
        console.log(_dd.toDate());
    }, []);

    const handleSubmit = () => {
        setFormError({});
        let name, email, phone, query_type;
        if (!formData.name) {
            name = "Name is required!";
        }

        if (!formData.email) {
            email = "Email is required!";
        }

        if (!formData.phone) {
            phone = "Phone number is required!";
        }

        if (!formData.query_type) {
            query_type = "Query Type is required!";
        }

        if (name || email || phone || query_type) {
            setFormError({ name, email, phone, query_type });
            return;
        }

        if (!formData.email.match(emailValidation)) {
            setFormError({ email: "Email is invalid" });
            return;
        }
        requestCallback(livecall?.id, formData, onSuccessful);
    };

    const handleEditCallback = () => {
        setFormError({});
        let name, email, phone, query_type;
        if (!formData.name) {
            name = "Name is required!";
        }

        if (!formData.email) {
            email = "Email is required!";
        }

        if (!formData.phone) {
            phone = "Phone number is required!";
        }

        if (!formData.query_type) {
            query_type = "Query Type is required!";
        }

        if (name || email || phone || query_type) {
            setFormError({ name, email, phone, query_type });
            return;
        }

        if (!formData.email.match(emailValidation)) {
            setFormError({ email: "Email is invalid" });
            return;
        }
        updateCallback(id, formData, onSuccessful);
    };

    const onSuccessful = () => {
        setMsg(
            "Booking successful. A confirmation will be sent to your email shortly."
        );
        if (!id) {
            setFormData({
                name: "",
                email: "",
                phone: "",
                query_type: "",
                time: "",
                date: new Date().toISOString().split("T")[0],
            });
        }

        setOpenRes(true);
    };

    const handleResClose = () => {
        setOpenRes(false);
        clearCallback();
        setMsg("");
        handleClose();
    };

    useEffect(() => {
        if (id) {
            getCallbackById(id);
        }
    }, [id]);

    useEffect(() => {
        if (callback) {
            const { id, name, email, phone, query_type, time, date } = callback;
            setFormData({
                id,
                name,
                email,
                phone,
                query_type,
                time,
                date: new Date(date).toISOString().split("T")[0],
            });
            handleOpen();
        }
    }, [callback]);

    useEffect(() => {
        getCallbacksByDate(formData.date);
    }, [formData.date]);

    useEffect(() => {
        if (callbacks) {
            let _t = callbacks.data.map((item) =>
                item.status == "CANCELED" ? null : item.time
            );

            setSelectedTime(_t);
        }
    }, [callbacks]);

    return (
        <div>
            <Dialog open={open} onClose={handleClose} sx={{ padding: 5 }}>
                <DialogTitle>Book a Callback</DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    <DialogContentText>
                        We will be delighted to speak to you about our services
                        and offer advice Please provide your contact information
                        below and a member of our team will call you back at a
                        convenient time.
                    </DialogContentText>
                    <Box sx={{ mt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    margin="none"
                                    required
                                    fullWidth
                                    label="Name"
                                    name="name"
                                    autoComplete="name"
                                    value={formData.name}
                                    onChange={handleOnChange}
                                    autoFocus
                                    error={Boolean(formError.name)}
                                    helperText={formError.name}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl
                                    fullWidth
                                    margin="none"
                                    error={Boolean(formError.query_type)}
                                >
                                    <InputLabel id="query-type-label">
                                        Query Type
                                    </InputLabel>
                                    <Select
                                        labelId="query-type-label"
                                        name="query_type"
                                        value={formData.query_type}
                                        label="Query Type"
                                        onChange={handleOnChange}
                                    >
                                        {QUERY_TYPE.map((val) => (
                                            <MenuItem key={val} value={val}>
                                                {val}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {formError.query_type && (
                                        <FormHelperText>
                                            {formError.query_type}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    margin="none"
                                    fullWidth
                                    required
                                    label="Email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleOnChange}
                                    autoComplete="email"
                                    error={Boolean(formError.email)}
                                    helperText={formError.email}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <PhoneInput
                                    isValid={!Boolean(formError.phone)}
                                    inputStyle={{
                                        paddingTop: "14.5px",
                                        paddingBottom: "14.5px",
                                        width: "100%",
                                    }}
                                    specialLabel="Enter Phone Number *"
                                    country={"gb"}
                                    value={formData.phone}
                                    onChange={(val) =>
                                        setFormData({ ...formData, phone: val })
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    margin="none"
                                    fullWidth
                                    required
                                    name="date"
                                    label="Date"
                                    value={
                                        formData.date || minDate.split("T")[0]
                                    }
                                    onChange={(e) => {
                                        let _d = new Date(e.target.value);
                                        if (
                                            _d.getDay() == 0 ||
                                            _d.getDay() == 6
                                        ) {
                                            alert("Weekends days not allow");
                                        } else {
                                            handleOnChange(e);
                                        }
                                    }}
                                    type="date"
                                    helperText="you can only select available date in the current week."
                                    inputProps={{
                                        min: minDate.split("T")[0],
                                        max: maxDate.split("T")[0],
                                    }}
                                    error={Boolean(formError.date)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TimePicker
                                    handleOnClick={(val) =>
                                        setFormData({ ...formData, time: val })
                                    }
                                    choosenTime={selectedTime}
                                    time={formData.time}
                                />
                            </Grid>
                        </Grid>
                        <div className="tw-pb-5 tw-flex tw-mt-5 tw-justify-between">
                            {id && (
                                <button
                                    className={`tw-p-4 tw-font-semibold tw-text-sm  tw-text-indigo-500 tw-rounded-md tw-border-2 tw-m-auto tw-self-center tw-w-48 ${
                                        loading
                                            ? "tw-border-indigo-300"
                                            : "tw-border-indigo-500 hover:tw-border-indigo-700"
                                    }`}
                                    onClick={() =>
                                        cancelCallback(id, handleClose)
                                    }
                                    disabled={loading}
                                >
                                    Cancel Booking
                                </button>
                            )}
                            <button
                                className={`tw-p-4 tw-font-semibold tw-text-sm  tw-text-white tw-rounded-md tw-shadow-lg tw-border-2 tw-m-auto tw-self-center tw-w-48 ${
                                    loading
                                        ? "tw-bg-indigo-300 tw-border-indigo-300"
                                        : "tw-bg-indigo-500 tw-border-indigo-500 hover:tw-bg-indigo-700 hover:tw-border-indigo-700"
                                }`}
                                onClick={id ? handleEditCallback : handleSubmit}
                                disabled={loading}
                            >
                                {id ? "Confirm Booking" : "Submit Booking"}
                            </button>
                        </div>
                    </Box>
                    <Dialog open={openRes} maxWidth="xs">
                        <DialogContent className="tw-bg-gray-200">
                            <div className="">
                                <p className="tw-text-xl tw-font-medium">
                                    {msg}
                                </p>
                            </div>
                        </DialogContent>
                        <DialogActions className="tw-bg-gray-200">
                            <Button onClick={handleResClose}>Ok</Button>
                        </DialogActions>
                    </Dialog>
                </DialogContent>
            </Dialog>
        </div>
    );
};

const mapStateToProps = (state) => ({
    livecall: state.livecall.livecall,
    loading: state.callback.loading,
    callbacks: state.callback.callbacks,
    callback: state.callback.callback,
});

export default connect(mapStateToProps, {
    requestCallback,
    getCallbacksByDate,
    updateCallback,
    clearCallback,
    getCallbackById,
    cancelCallback,
})(CallbackDialog);
