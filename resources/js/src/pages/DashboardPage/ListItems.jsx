import { useSelector } from "react-redux";
import ListItem from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import Badge from "@mui/material/Badge";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import FeedbackIcon from "@mui/icons-material/Feedback";
import PhoneCallbackIcon from "@mui/icons-material/PhoneCallback";
import ErrorIcon from "@mui/icons-material/Error";
import SecurityIcon from "@mui/icons-material/Security";
import { Link } from "react-router-dom";

const ListItems = () => {
    const { livecalls } = useSelector((state) => state.livecall);
    const { user } = useSelector((state) => state.auth);

    return (
        <div>
            <Link to="../">
                <ListItem>
                    <ListItemIcon>
                        <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItem>
            </Link>

            {user?.roles[0].name === "super-admin" && (
                <Link to="../account">
                    <ListItem>
                        <ListItemIcon>
                            <PeopleIcon />
                        </ListItemIcon>
                        <ListItemText primary="Account" />
                    </ListItem>
                </Link>
            )}

            <Link to="../livecall">
                <ListItem>
                    <ListItemIcon>
                        <VideoCallIcon />
                    </ListItemIcon>
                    <Badge
                        badgeContent={
                            livecalls?.data.filter(
                                (val) => !val.answered_at && !val.left_at
                            ).length
                        }
                        color="error"
                    >
                        <ListItemText primary="Live Call" />
                    </Badge>
                </ListItem>
            </Link>
            <Link to="../callback">
                <ListItem>
                    <ListItemIcon>
                        <PhoneCallbackIcon />
                    </ListItemIcon>
                    <ListItemText primary="Call Back" />
                </ListItem>
            </Link>
            <Link to="../ticket">
                <ListItem>
                    <ListItemIcon>
                        <ErrorIcon />
                    </ListItemIcon>
                    <ListItemText primary="Ticket Raised" />
                </ListItem>
            </Link>
            <a href="https://www.sans.org/uk_en/" target="_blank">
                <ListItem>
                    <ListItemIcon>
                        <SecurityIcon />
                    </ListItemIcon>
                    <ListItemText primary="E-Learning" />
                </ListItem>
            </a>
            <Link to="../feedback">
                <ListItem>
                    <ListItemIcon>
                        <FeedbackIcon />
                    </ListItemIcon>
                    <ListItemText primary="Feedback" />
                </ListItem>
            </Link>
        </div>
    );
};

export default ListItems;
