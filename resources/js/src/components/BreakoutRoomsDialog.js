import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import FormLabel from "@mui/material/FormLabel";
import Collapse from "@mui/material/Collapse";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useParams } from "react-router-dom";

import useVideoContext from "../hooks/useVideoContext";
import useParticipants from "../hooks/useParticipants";
import { connect } from "react-redux";
import { useAppState } from "../state";

const axios = window.axios;

const BreakoutRoomsDialog = ({ open, onClose, password, user }) => {
    const participants = useParticipants();
    const { URLRoomID } = useParams();
    const { getToken, isFetching } = useAppState();
    const {
        room,
        mainRoom,
        connect: videoConnect,
        isAcquiringLocalTracks,
        isConnecting,
        getLocalVideoTrack,
        getLocalAudioTrack,
        getAudioAndVideoTracks,
    } = useVideoContext();
    const localParticipant = room?.localParticipant;
    const [loading, setLoading] = React.useState(false);
    const [breakouts, setBreakouts] = React.useState([]);
    const [formOpen, setFormOpen] = React.useState(false);
    const [state, setState] = React.useState({
        roomName: "",
        participants: [],
    });

    const disableButtons = isFetching || isAcquiringLocalTracks || isConnecting;

    const handleClick = () => {
        setFormOpen(!formOpen);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        axios
            .post(`/api/room/breakout/${URLRoomID}`, state)
            .then((res) => {
                //setBreakouts([res.data, ...breakouts]);
                setState({
                    roomName: "",
                    participants: [],
                });
                setLoading(false);
            })
            .catch((err) => console.log(err));
    };

    React.useEffect(() => {
        if (mainRoom) {
            setBreakouts(mainRoom.breakouts);
        }

        return () => setBreakouts(null);
    }, [mainRoom]);

    React.useEffect(() => {
        if (mainRoom?.host == user?.id) {
            setState({
                ...state,
                participants: [
                    ...state.participants,
                    localParticipant.identity,
                ],
            });
        }

        return () => setState(null);
    }, [mainRoom, user]);

    const handleChange = (e) => {
        let checked = e.target.checked;
        if (checked) {
            state.participants.push(e.target.name);
            setState({ ...state, participants: [...state.participants] });
        } else {
            let data = state.participants.filter(
                (val) => val !== e.target.name
            );

            setState({ ...state, participants: [...data] });
        }
    };

    const changeRoom = (sid) => {
        joinRoom(sid);
    };

    const joinRoom = async (roomSid) => {
        try {
            const identity = localParticipant.identity;
            // If you're already in another video room, disconnect from that room first
            if (room) {
                console.log("I run well well");
                room.disconnect();
            }

            getAudioAndVideoTracks();

            if (roomSid) {
                getToken(identity, URLRoomID, password, roomSid).then(
                    ({ token }) => {
                        videoConnect(token);
                    }
                );
            } else {
                getToken(identity, URLRoomID, password).then(({ token }) => {
                    videoConnect(token);
                });
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="xs">
            <DialogTitle>Breakout Rooms</DialogTitle>
            <List dense={true} sx={{ pt: 0 }}>
                <ListItem>
                    <ListItemText primary={`${room.name} (Active Room)`} />
                </ListItem>
                {breakouts &&
                    breakouts.map(
                        (breakout) =>
                            room.sid !== breakout.id && (
                                <ListItem
                                    key={breakout.id}
                                    secondaryAction={
                                        mainRoom?.host == user?.id ||
                                        breakout.participants.includes(
                                            localParticipant.identity
                                        ) ? (
                                            <Button
                                                variant="text"
                                                disabled={disableButtons}
                                                onClick={() =>
                                                    changeRoom(breakout.id)
                                                }
                                            >
                                                Join
                                            </Button>
                                        ) : null
                                    }
                                >
                                    <ListItemText primary={breakout.name} />
                                </ListItem>
                            )
                    )}
            </List>
            <Box sx={{ padding: 2 }}>
                <Button
                    variant="contained"
                    disabled={disableButtons || room.sid === URLRoomID}
                    onClick={() => changeRoom()}
                >
                    Return to Main Room
                </Button>
            </Box>
            {mainRoom && mainRoom.host == user?.id && (
                <Box>
                    <ListItem
                        autoFocus
                        button
                        onClick={handleClick}
                        sx={{ marginY: 2 }}
                    >
                        <ListItemAvatar>
                            <Avatar>
                                <AddIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary="Add Breakout Room" />
                    </ListItem>
                    <Collapse in={formOpen} timeout="auto" unmountOnExit>
                        <Divider />
                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            noValidate
                            sx={{ mt: 2, paddingX: 4 }}
                        >
                            <TextField
                                margin="dense"
                                required
                                fullWidth
                                id="roomName"
                                label="Room Name"
                                name="roomName"
                                value={state.roomName}
                                autoFocus
                                onChange={(e) =>
                                    setState({
                                        ...state,
                                        roomName: e.target.value,
                                    })
                                }
                            />
                            <FormGroup>
                                <FormLabel component="legend">
                                    Please select Room Participants
                                </FormLabel>
                                {participants.map((val) => (
                                    <FormControlLabel
                                        key={val.sid}
                                        control={
                                            <Checkbox
                                                checked={state.participants.includes(
                                                    val.identity
                                                )}
                                                onChange={handleChange}
                                                name={val.identity}
                                            />
                                        }
                                        label={val.identity}
                                    />
                                ))}
                            </FormGroup>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                disabled={loading || !state.roomName}
                            >
                                Submit
                            </Button>
                        </Box>
                    </Collapse>
                </Box>
            )}
        </Dialog>
    );
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
});

export default connect(mapStateToProps)(BreakoutRoomsDialog);
