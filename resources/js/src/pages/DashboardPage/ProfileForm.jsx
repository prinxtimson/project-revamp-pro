import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import CssBaseline from "@mui/material/CssBaseline";
import Avatar from "@mui/material/Avatar";
import CameraIcon from "@mui/icons-material/CameraAlt";
import PhoneInput from "react-phone-input-2";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import {
    deleteAccount,
    updateUser,
    reset,
} from "../../features/auth/authSlice";
import DrawerContainer from "./DrawerContainer";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ProfileForm = () => {
    const [inputRef, setInputRef] = useState(null);
    const [file, setFile] = useState(null);
    const [data, setData] = useState({
        firstname: "",
        lastname: "",
        avatar: "",
        phone: "",
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user, isLoading, isSuccess, type, isError, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (user) {
            setData({
                firstname: user?.profile?.firstname || "",
                lastname: user?.profile?.lastname || "",
                avatar: user?.avatar || "",
                phone: user?.phone || "",
            });
        }
    }, [user]);

    useEffect(() => {
        if (isSuccess && message) {
            toast.success(message);
        }

        if (isError) {
            toast.error(message);
        }

        dispatch(reset());
    }, [isLoading, isSuccess, type, isError, message]);

    const handleSubmit = (e) => {
        e.preventDefault();
        let formData = new FormData();
        if (file) {
            formData.append("avatar", file);
        }
        formData.append("_method", "put");

        formData.append("firstname", data.firstname);
        formData.append("lastname", data.lastname);

        dispatch(updateUser(formData));
    };

    const onHandleChange = (event) => {
        setData({ ...data, [event.target.name]: event.target.value });
    };

    const handleFileSelect = (e) => {
        setFile(e.target.files[0]);
        setData({
            ...data,
            avatar: URL.createObjectURL(e.target.files[0]),
        });
    };

    return (
        <DrawerContainer>
            <Container component="main" maxWidth="sm">
                <CssBaseline />
                <input
                    id="avatar"
                    name="avatar"
                    hidden
                    onChange={(e) => handleFileSelect(e)}
                    type="file"
                    accept="image/*"
                    ref={(ref) => setInputRef(ref)}
                />
                <div className="form-demo tw-bg-white tw-rounded tw-p-8">
                    <div className="card">
                        <h2 className="tw-text-center tw-font-semibold tw-text-2xl tw-mt-0">
                            Profile
                        </h2>
                        <Stack sx={{ width: "100%" }} spacing={2}>
                            {isError && message && (
                                <Alert severity="error">{message}</Alert>
                            )}
                        </Stack>
                        <form onSubmit={handleSubmit} className="p-fluid">
                            <div className="tw-mb-8 tw-flex tw-justify-center">
                                <Badge
                                    overlap="circular"
                                    anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "right",
                                    }}
                                    badgeContent={
                                        <IconButton
                                            onClick={() => navigate("upload")}
                                        >
                                            <CameraIcon />
                                        </IconButton>
                                    }
                                >
                                    <Avatar
                                        alt={user?.name}
                                        src={data.avatar}
                                        sx={{ width: 100, height: 100, mb: 2 }}
                                    >
                                        {`${data.firstname.charAt(
                                            0
                                        )}${data.lastname.charAt(0)}`}
                                    </Avatar>
                                </Badge>
                            </div>

                            <div className="field">
                                <span className="p-float-label custom-label">
                                    <InputText
                                        name="firstname"
                                        value={data.firstname}
                                        autoFocus
                                        onChange={onHandleChange}
                                        required
                                    />
                                    <label htmlFor="firstname">
                                        Firstname *
                                    </label>
                                </span>
                            </div>
                            <div className="field">
                                <span className="p-float-label custom-label">
                                    <InputText
                                        name="lastname"
                                        value={data.lastname}
                                        autoFocus
                                        onChange={onHandleChange}
                                        required
                                    />
                                    <label htmlFor="lastname">Lastname *</label>
                                </span>
                            </div>
                            <div className="field">
                                <PhoneInput
                                    inputProps={{
                                        required: true,
                                    }}
                                    inputStyle={{
                                        width: "100%",
                                        paddingTop: "14.5px",
                                        paddingBottom: "14.5px",
                                    }}
                                    containerStyle={{
                                        marginBottom: 5,
                                        marginTop: 10,
                                    }}
                                    specialLabel="Phone *"
                                    country={"gb"}
                                    value={data.phone}
                                    onChange={(val) =>
                                        setData({ ...data, phone: val })
                                    }
                                />
                            </div>
                            <Button
                                className="tw-w-full"
                                type="submit"
                                label="Save"
                                loading={isLoading}
                                disabled={isLoading}
                            />
                        </form>
                    </div>
                </div>
            </Container>
        </DrawerContainer>
    );
};

export default ProfileForm;
