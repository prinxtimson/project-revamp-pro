import { useState } from "react";
import { useSelector } from "react-redux";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import Collapse from "@mui/material/Collapse";
import Badge from "@mui/material/Badge";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import FeedbackIcon from "@mui/icons-material/Feedback";
import PhoneCallbackIcon from "@mui/icons-material/PhoneCallback";
import MessageRoundedIcon from "@mui/icons-material/MessageRounded";
import ErrorIcon from "@mui/icons-material/Error";
import SecurityIcon from "@mui/icons-material/Security";
import SettingsIcon from "@mui/icons-material/Settings";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import LineChartIcon from "@mui/icons-material/StackedLineChart";
import { FaChartBar } from "react-icons/fa";
import { Link } from "react-router-dom";

const ListItems = () => {
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(!open);
    };

    const { livecalls } = useSelector((state) => state.livecall);
    const { user } = useSelector((state) => state.auth);

    return (
        <div>
            <Link to="/admin/dashboard">
                <ListItem>
                    <ListItemIcon>
                        <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItem>
            </Link>

            {user?.roles[0].name === "super-admin" && (
                <Link to="/admin/dashboard/account">
                    <ListItem>
                        <ListItemIcon>
                            <PeopleIcon />
                        </ListItemIcon>
                        <ListItemText primary="Account" />
                    </ListItem>
                </Link>
            )}

            {user?.roles[0].name != "agent" && (
                <Link to="/admin/dashboard/agent">
                    <ListItem>
                        <ListItemIcon>
                            <PeopleIcon />
                        </ListItemIcon>
                        <ListItemText primary="Agent Profile" />
                    </ListItem>
                </Link>
            )}

            {user?.roles[0].name != "manager" && (
                <>
                    <Link to="/admin/dashboard/livecall">
                        <ListItem>
                            <ListItemIcon>
                                <VideoCallIcon />
                            </ListItemIcon>
                            <Badge
                                badgeContent={
                                    livecalls?.data.filter(
                                        (val) =>
                                            !val.answered_at && !val.left_at
                                    ).length
                                }
                                color="error"
                            >
                                <ListItemText primary="Live Call" />
                            </Badge>
                        </ListItem>
                    </Link>

                    <Link to="/admin/dashboard/livechat">
                        <ListItem>
                            <ListItemIcon>
                                <MessageRoundedIcon />
                            </ListItemIcon>
                            <ListItemText primary="Live Chat" />
                        </ListItem>
                    </Link>

                    <Link to="/admin/dashboard/callback">
                        <ListItem>
                            <ListItemIcon>
                                <PhoneCallbackIcon />
                            </ListItemIcon>
                            <ListItemText primary="Call Back" />
                        </ListItem>
                    </Link>

                    <Link to="/admin/dashboard/ticket">
                        <ListItem>
                            <ListItemIcon>
                                <ErrorIcon />
                            </ListItemIcon>
                            <ListItemText primary="Raised Ticket" />
                        </ListItem>
                    </Link>
                    <Link to="/admin/dashboard/e-learning">
                        <ListItem>
                            <ListItemIcon>
                                <SecurityIcon />
                            </ListItemIcon>
                            <ListItemText primary="E-Learning" />
                        </ListItem>
                    </Link>
                </>
            )}
            {user?.roles[0].name != "agent" && (
                <>
                    <Link to="/admin/dashboard/feedback">
                        <ListItem>
                            <ListItemIcon>
                                <FeedbackIcon />
                            </ListItemIcon>
                            <ListItemText primary="Feedback" />
                        </ListItem>
                    </Link>
                    <Link to="/admin/dashboard/performance-tracking">
                        <ListItem>
                            <ListItemIcon>
                                <FaChartBar />
                            </ListItemIcon>
                            <ListItemText primary="Performance Tracking" />
                        </ListItem>
                    </Link>
                    <Link to="/admin/dashboard/report">
                        <ListItem>
                            <ListItemIcon>
                                <FeedbackIcon />
                            </ListItemIcon>
                            <ListItemText primary="Report" />
                        </ListItem>
                    </Link>
                    <ListItem onClick={handleClick}>
                        <ListItemIcon>
                            <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Setting" />
                        {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <List component="div">
                            <Link to="/admin/dashboard/notification-preference">
                                <ListItem>
                                    <ListItemText primary="Notification Preference" />
                                </ListItem>
                            </Link>
                        </List>
                    </Collapse>
                </>
            )}
        </div>
    );
};

export default ListItems;
