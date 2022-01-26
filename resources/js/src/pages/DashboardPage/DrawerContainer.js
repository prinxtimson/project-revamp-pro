import React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import Link from "@mui/material/Link";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MainListItems from "./ListItems";
import { Link as RouterLink } from "react-router-dom";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/auth";
import { getLivecalls, clearLivecall } from "../../actions/livecall";

function Copyright(props) {
    return (
        <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            {...props}
        >
            {"Copyright © "}
            <Link color="inherit" href="https://tritekconsulting.co.uk">
                Tritek Consulting Ltd
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    "& .MuiDrawer-paper": {
        position: "relative",
        whiteSpace: "nowrap",
        width: drawerWidth,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        boxSizing: "border-box",
        ...(!open && {
            overflowX: "hidden",
            transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            width: theme.spacing(0),
            [theme.breakpoints.up("sm")]: {
                width: theme.spacing(0),
            },
        }),
    },
}));

const mdTheme = createTheme();

const settings = [
    { name: "Profile", route: "profile" },
    { name: "Change Password", route: "change-password" },
    { name: "Dashboard", route: "/dashboard" },
    { name: "Logout", route: "/logout" },
];

const DrawerContainer = ({
    children,
    logoutUser,
    user,
    alerts,
    getLivecalls,
    clearLivecall,
}) => {
    const [open, setOpen] = React.useState(true);
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    React.useEffect(() => {
        getLivecalls();

        return clearLivecall;
    }, []);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const handleLogout = (e) => {
        e.preventDefault();
        logoutUser();
    };

    return (
        <ThemeProvider theme={mdTheme}>
            <Box sx={{ display: "flex", flexGrow: 1 }}>
                <CssBaseline />
                <AppBar position="absolute" open={open}>
                    <Toolbar
                        sx={{
                            pr: "24px", // keep right padding when drawer closed
                        }}
                    >
                        <Box
                            component="span"
                            sx={{
                                ...(open && { display: "none" }),
                                marginX: 2,
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "white",
                                borderRadius: 2,
                                padding: 1,
                            }}
                        >
                            <Avatar
                                variant="square"
                                alt="Dev Arena"
                                src="/images/logo.png"
                                sx={{ width: 128, height: 32 }}
                            >
                                Dev Arena
                            </Avatar>
                        </Box>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{
                                marginRight: "36px",
                                ...(open && { display: "none" }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{ flexGrow: 1 }}
                        >
                            Dashboard
                        </Typography>
                        {/*<IconButton color="inherit">
                            <Badge badgeContent={0} color="secondary">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>*/}
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <IconButton
                                    onClick={handleOpenUserMenu}
                                    sx={{ p: 0 }}
                                >
                                    <Avatar alt={user?.name} src={user?.avatar}>
                                        {`${user?.profile?.firstname.charAt(
                                            0
                                        )}${user?.profile?.lastname.charAt(0)}`}
                                    </Avatar>
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: "45px" }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {settings.map((setting) =>
                                    setting.name === "Logout" ? (
                                        <Link
                                            key={setting.name}
                                            href={setting.route}
                                            onClick={handleLogout}
                                        >
                                            <MenuItem
                                                onClick={handleCloseNavMenu}
                                            >
                                                <Typography textAlign="center">
                                                    {setting.name}
                                                </Typography>
                                            </MenuItem>
                                        </Link>
                                    ) : (
                                        <RouterLink
                                            to={setting.route}
                                            key={setting.name}
                                        >
                                            <MenuItem
                                                onClick={handleCloseNavMenu}
                                            >
                                                <Typography textAlign="center">
                                                    {setting.name}
                                                </Typography>
                                            </MenuItem>
                                        </RouterLink>
                                    )
                                )}
                            </Menu>
                        </Box>
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open}>
                    <Box sx={{ display: "flex" }}>
                        <Box
                            component="span"
                            sx={{
                                flexGrow: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Avatar
                                variant="square"
                                alt="Dev Arena"
                                src="/images/logo.png"
                                sx={{ width: 128, height: 32 }}
                            >
                                Dev Arena
                            </Avatar>
                        </Box>
                        <Toolbar
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-end",
                                px: [1],
                            }}
                        >
                            <IconButton onClick={toggleDrawer}>
                                <ChevronLeftIcon />
                            </IconButton>
                        </Toolbar>
                    </Box>
                    <Divider />
                    <List>
                        <MainListItems />
                    </List>
                </Drawer>
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === "light"
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: "100vh",
                        overflow: "auto",
                        //width: { sm: `calc(100% - ${drawerWidth}px)` },
                    }}
                >
                    <Toolbar />
                    <Stack sx={{ width: "100%" }} spacing={2}>
                        {alerts.map(
                            (alert) =>
                                alert.alertType === "success" && (
                                    <Snackbar
                                        anchorOrigin={{
                                            vertical: "top",
                                            horizontal: "right",
                                        }}
                                        open={Boolean(alert.id)}
                                        key={alert.id}
                                        autoHideDuration={6000}
                                    >
                                        <Alert
                                            severity="success"
                                            variant="filled"
                                            sx={{ width: "100%" }}
                                        >
                                            {alert.msg}
                                        </Alert>
                                    </Snackbar>
                                )
                        )}
                    </Stack>
                    <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
                        {children}
                        <Copyright sx={{ pt: 4 }} />
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    loading: state.auth.loading,
    user: state.auth.user,
    alerts: state.alert,
});

export default connect(mapStateToProps, {
    logoutUser,
    getLivecalls,
    clearLivecall,
})(DrawerContainer);
