import * as React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import Badge from "@mui/material/Badge";
import PhoneIcon from "@mui/icons-material/Phone";
import PhoneCallbackIcon from "@mui/icons-material/PhoneCallback";
import { Link } from "react-router-dom";

import { connect } from "react-redux";

const ListItems = ({ livecalls }) => {
    return (
        <div>
            <Link to="">
                <ListItem button>
                    <ListItemIcon>
                        <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItem>
            </Link>
            <Link to="add-user">
                <ListItem button>
                    <ListItemIcon>
                        <PersonAddIcon />
                    </ListItemIcon>
                    <ListItemText primary="Add Agent" />
                </ListItem>
            </Link>
            <Link to="users">
                <ListItem button>
                    <ListItemIcon>
                        <PeopleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Agents" />
                </ListItem>
            </Link>
            <Link to="livecall">
                <ListItem button>
                    <ListItemIcon>
                        <PhoneIcon />
                    </ListItemIcon>
                    <Badge
                        badgeContent={
                            livecalls?.data.filter(
                                (val) => !val.answered_at && !val.left_at
                            ).length
                        }
                        color="success"
                    >
                        <ListItemText primary="Livecall" />
                    </Badge>
                </ListItem>
            </Link>
            <Link to="callback">
                <ListItem button>
                    <ListItemIcon>
                        <PhoneCallbackIcon />
                    </ListItemIcon>
                    <ListItemText primary="Callback" />
                </ListItem>
            </Link>
            <Link to="reports">
                <ListItem button>
                    <ListItemIcon>
                        <BarChartIcon />
                    </ListItemIcon>
                    <ListItemText primary="Reports" />
                </ListItem>
            </Link>
        </div>
    );
};
const mapStateToProps = (state) => ({
    livecalls: state.livecall.livecalls,
});

export default connect(mapStateToProps)(ListItems);
