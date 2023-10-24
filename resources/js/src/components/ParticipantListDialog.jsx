import { useState } from "react";
import { useSelector } from "react-redux";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import MoreIcon from "@mui/icons-material/MoreVert";
import PersonIcon from "@mui/icons-material/Person";
import { useParams } from "react-router-dom";

import useParticipants from "../hooks/useParticipants";
import useVideoContext from "../hooks/useVideoContext";

const axios = window.axios;

const ITEM_HEIGHT = 48;

const ParticipantListDialog = ({ open, onClose }) => {
    const participants = useParticipants();
    const { room, mainRoom } = useVideoContext();
    const localParticipant = room?.localParticipant;
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);

    const { user } = useSelector((state) => state.auth);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleRemoveParticipant = (name) => {
        axios
            .post("/api/room/remove_participant", {
                roomName: room.name,
                participant: name,
            })
            .then((res) => console.log(res.data))
            .catch((err) => console.log(err));
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="xs">
            <DialogTitle>
                Participants {`(${participants.length + 1})`}
            </DialogTitle>
            <Divider />
            <List dense={true}>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar>
                            <PersonIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={`${localParticipant.identity} (You)`}
                    />
                </ListItem>
                {participants.map((participant) => (
                    <ListItem
                        key={participant.sid}
                        secondaryAction={
                            mainRoom?.host == user?.id && (
                                <IconButton
                                    edge="end"
                                    aria-label="more"
                                    id="long-button"
                                    aria-controls={
                                        openMenu ? "long-menu" : undefined
                                    }
                                    aria-expanded={
                                        openMenu ? "true" : undefined
                                    }
                                    aria-haspopup="true"
                                    onClick={handleClick}
                                >
                                    <MoreIcon />
                                </IconButton>
                            )
                        }
                    >
                        {mainRoom?.host == user?.id && (
                            <Menu
                                id="long-menu"
                                MenuListProps={{
                                    "aria-labelledby": "long-button",
                                }}
                                anchorEl={anchorEl}
                                open={openMenu}
                                onClose={handleClose}
                                PaperProps={{
                                    style: {
                                        maxHeight: ITEM_HEIGHT * 4.5,
                                        width: "20ch",
                                    },
                                }}
                                transformOrigin={{
                                    horizontal: "right",
                                    vertical: "top",
                                }}
                                anchorOrigin={{
                                    horizontal: "right",
                                    vertical: "bottom",
                                }}
                            >
                                <MenuItem
                                    onClick={() => {
                                        handleRemoveParticipant(
                                            participant.identity
                                        );
                                        handleClose();
                                    }}
                                >
                                    Remove Caller
                                </MenuItem>
                            </Menu>
                        )}
                        <ListItemAvatar>
                            <Avatar>
                                <PersonIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={participant.identity} />
                    </ListItem>
                ))}
            </List>
            <Divider />
            <DialogActions>
                <Button
                    onClick={onClose}
                    color="primary"
                    variant="contained"
                    autoFocus
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ParticipantListDialog;
