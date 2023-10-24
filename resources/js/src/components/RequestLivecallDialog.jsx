import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { confirmDialog } from "primereact/confirmdialog";
import FormHelperText from "@mui/material/FormHelperText";
import DialogTitle from "@mui/material/DialogTitle";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import {
    requestLivecall,
    leaveLivecall,
} from "../features/livecall/livecallSlice";
import axios from "axios";

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

const RequestLivecallDialog = ({ open, handleClose, handleOpenRes }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        query_type: "",
    });
    const [formError, setFormError] = useState({});
    const emailValidation =
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const dispatch = useDispatch();

    const { livecall, count, isLoading, isSuccess, type, isError, message } =
        useSelector((state) => state.livecall);

    const handleOnChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = () => {
        setFormError({});
        let name, email, query_type;
        if (!formData.name) {
            name = "Name is required!";
        }

        if (!formData.email) {
            email = "Email is required!";
        }

        if (!formData.query_type) {
            query_type = "Query Type is required!";
        }

        if (name || email || query_type) {
            setFormError({ name, email, phone, query_type });
            return;
        }

        if (!formData.email.match(emailValidation)) {
            setFormError({ email: "Email is invalid" });
            return;
        }

        dispatch(requestLivecall(formData));
    };

    const onSuccessful = () => {
        setFormData({
            name: "",
            email: "",
            query_type: "",
        });
    };

    const confirm = (e) => {
        handleClose();
        confirmDialog({
            message: "You will now be transferred to an agent.",
            header: "Confirmation",
            icon: "pi pi-exclamation-triangle",
            accept: () => {
                axios.get(`/api/livecall/send_survey/${e.data.livecall.id}`);

                window.open(
                    `/conferencing/${e.data.id}?pwd=${e.password}&name=${e.data.livecall.name}`
                );
            },
            reject: () => dispatch(leaveLivecall(livecall?.id)),
        });
    };

    useEffect(() => {
        if (isSuccess && type == "livecall/request/fulfilled") {
            onSuccessful();
            if (livecall) {
                window.Echo.channel(`livecall.${livecall.id}`).listen(
                    "AgentConnected",
                    (e) => {
                        confirm(e);
                    }
                );
            }
        }
    }, [isLoading, isSuccess, type, isError, message]);

    useEffect(() => {
        if (count && count > 0 && livecall) {
            let msg = `You are number ${count} on the waiting list`;
            handleOpenRes(msg);
        }
    }, [count]);

    return (
        <div>
            <BootstrapDialog open={open} onClose={handleClose}>
                <DialogTitle sx={{ m: 0, p: 2 }}>Join Live Call </DialogTitle>
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

                        <div className="tw-pb-5 tw-flex tw-mt-3">
                            <button
                                className={`tw-p-4 tw-font-semibold tw-text-sm  tw-text-white tw-rounded-md tw-shadow-lg tw-m-auto tw-self-center tw-w-48 ${
                                    isLoading
                                        ? "tw-bg-indigo-300"
                                        : "tw-bg-indigo-500 hover:tw-bg-indigo-700"
                                }`}
                                onClick={handleSubmit}
                                disabled={isLoading}
                            >
                                Request Livecall
                            </button>
                        </div>
                    </Box>
                </DialogContent>
            </BootstrapDialog>
        </div>
    );
};

export default RequestLivecallDialog;
