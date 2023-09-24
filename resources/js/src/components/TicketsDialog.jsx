import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import FormHelperText from "@mui/material/FormHelperText";
import "react-phone-input-2/lib/material.css";
import PhoneInput from "react-phone-input-2";
import DialogTitle from "@mui/material/DialogTitle";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import { connect } from "react-redux";
import { submitTicket, clearTicket } from "../actions/ticket";

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

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));

const TicketsDialog = ({
    open,
    handleClose,
    loading,
    message,
    submitTicket,
    clearTicket,
}) => {
    const [openRes, setOpenRes] = useState(false);
    const [remainingWords, setRemainingWords] = useState(500);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        query_type: "",
        phone: "",
        description: "",
    });
    const [formError, setFormError] = useState({});
    const emailValidation =
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const handleOnChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = () => {
        const { name, email, query_type, phone, description } = formData;
        if (!name) {
            setFormError({ name: "Name is required!" });
            return;
        }
        if (!email) {
            setFormError({ email: "Email is required!" });
            return;
        }
        if (!phone) {
            setFormError({ phone: "Phone number is required!" });
            return;
        }
        if (!query_type) {
            setFormError({
                query_type: "Query Type is required!",
            });
            return;
        }
        if (!description) {
            setFormError({
                description: "Description is required!",
            });
            return;
        }
        if (!email.match(emailValidation)) {
            setFormError({ email: "Email is invalid" });
            return;
        }
        if (
            description.split(" ").length < 50 ||
            description.split(" ").length > 500
        ) {
            setFormError({
                description:
                    "It must be at least 50 words and not more than 500 words",
            });
            return;
        }

        submitTicket(formData, onSuccessful);
    };

    const onSuccessful = () => {
        setFormData({
            name: "",
            email: "",
            query_type: "",
            phone: "",
            description: "",
        });
    };

    useEffect(() => {
        if (message) {
            setOpenRes(true);
        }
    }, [message]);

    const handleResClose = () => {
        setOpenRes(false);
        clearTicket();
        handleClose();
    };

    return (
        <div>
            <BootstrapDialog open={open} onClose={handleClose}>
                <DialogTitle sx={{ m: 0, p: 2 }}>Raise Ticket</DialogTitle>
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
                    <Box>
                        <TextField
                            margin="normal"
                            fullWidth
                            error={Boolean(formError.name)}
                            helperText={formError.name}
                            label="Enter your Name *"
                            name="name"
                            value={formData.name}
                            onChange={handleOnChange}
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Enter Email *"
                            name="email"
                            value={formData.email}
                            onChange={handleOnChange}
                            error={Boolean(formError.email)}
                            helperText={formError.email}
                        />
                        <PhoneInput
                            inputProps={{
                                required: true,
                                //error: formError.phone,
                            }}
                            isValid={!Boolean(formError.phone)}
                            inputStyle={{
                                width: "100%",
                                paddingTop: "14.5px",
                                paddingBottom: "14.5px",
                            }}
                            containerStyle={{
                                marginBottom: 5,
                                marginTop: 10,
                            }}
                            specialLabel="Enter Phone Number *"
                            country={"gb"}
                            value={formData.phone}
                            onChange={(val) =>
                                setFormData({ ...formData, phone: val })
                            }
                        />
                        {formError.phone && (
                            <FormHelperText style={{ color: "red" }}>
                                {formError.phone}
                            </FormHelperText>
                        )}
                        <FormControl
                            fullWidth
                            sx={{
                                marginTop: 2,
                                marginBottom: 1,
                            }}
                            error={Boolean(formError.query_type)}
                        >
                            <InputLabel id="query-type-label">
                                Query Type
                            </InputLabel>
                            <Select
                                labelId="query-type-label"
                                name="query_type"
                                value={formData.query_type}
                                label="Select Query Type *"
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
                        <TextField
                            margin="normal"
                            multiline
                            rows={5}
                            fullWidth
                            name="description"
                            label="Enter a brief description of your inquiry *"
                            value={formData.description}
                            onChange={handleOnChange}
                            onKeyPress={() => {
                                let totalWords =
                                    formData.description?.split(" ").length;
                                let _remainingWords = 500 - totalWords;
                                setRemainingWords(_remainingWords);
                            }}
                            error={Boolean(formError.description)}
                            helperText={
                                <span className="tw-flex tw-justify-between">
                                    <span className="">{`50/500   ${
                                        formError.description || ""
                                    }`}</span>
                                    <span className="">{`${remainingWords}   remaining`}</span>
                                </span>
                            }
                        />
                        <div className="tw-pb-5 tw-flex tw-mt-3">
                            <button
                                className={`tw-p-4 tw-font-semibold tw-text-sm  tw-text-white tw-rounded-md tw-shadow-lg tw-m-auto tw-self-center tw-w-48 ${
                                    loading
                                        ? "tw-bg-indigo-300"
                                        : "tw-bg-indigo-500 hover:tw-bg-indigo-700"
                                }`}
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                Submit Ticket
                            </button>
                        </div>
                    </Box>
                    <Dialog open={openRes} maxWidth="xs">
                        <DialogContent className="tw-bg-gray-200">
                            <div className="">
                                <p className="tw-text-xl tw-font-medium">
                                    {message}
                                </p>
                            </div>
                        </DialogContent>
                        <DialogActions className="tw-bg-gray-200">
                            <Button onClick={handleResClose}>Ok</Button>
                        </DialogActions>
                    </Dialog>
                </DialogContent>
            </BootstrapDialog>
        </div>
    );
};

const mapStateToProps = (state) => ({
    loading: state.ticket.loading,
    message: state.ticket.message,
});

export default connect(mapStateToProps, { submitTicket, clearTicket })(
    TicketsDialog
);
