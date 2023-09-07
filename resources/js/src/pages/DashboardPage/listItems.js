import * as React from "react";
import ListItem from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import Badge from "@mui/material/Badge";
import PhoneIcon from "@mui/icons-material/Phone";
import FeedbackIcon from "@mui/icons-material/Feedback";
import PhoneCallbackIcon from "@mui/icons-material/PhoneCallback";
import SecurityIcon from "@mui/icons-material/Security";
import { Link } from "react-router-dom";

import { connect } from "react-redux";

const ListItems = ({ livecalls, user }) => {
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
                        <PhoneIcon />
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
const mapStateToProps = (state) => ({
    livecalls: state.livecall.livecalls,
    user: state.auth.user,
});

export default connect(mapStateToProps)(ListItems);
