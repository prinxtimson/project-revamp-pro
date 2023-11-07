import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
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
import { InputText } from "primereact/inputtext";
import Link from "@mui/material/Link";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import MainListItems from "./ListItems";
import { Menu as PRMenu } from "primereact/menu";
import { Link as RouterLink } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";
import { getLivecalls, clear } from "../../features/livecall/livecallSlice";
import {
    getNotification,
    markNotification,
    onNewNotification,
} from "../../features/notification/notificationSlice";
import moment from "moment";
import searchData from "../../utils/searchData";

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
    { name: "Profile", route: "../profile" },
    { name: "Change Password", route: "../change-password" },
    { name: "Dashboard", route: "../" },
    { name: "Logout", route: "/logout" },
];

const DrawerContainer = ({ children }) => {
    const [filteredSearch, setFilteredSearch] = useState([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [searchShow, setSearchShow] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [open, setOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const notificationRef = useRef(null);

    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const { notifications, count } = useSelector((state) => state.notification);

    useEffect(() => {
        dispatch(getLivecalls());

        return () => dispatch(clear());
    }, []);

    useEffect(() => {
        window.addEventListener("resize", updateWindowWidth);
        return () => window.removeEventListener("resize", updateWindowWidth);
    }, []);

    useEffect(() => {
        if (windowWidth >= 640) {
            setSearchOpen(false);
        }
    }, [windowWidth]);

    const updateWindowWidth = () => {
        setWindowWidth(window.innerWidth);
    };

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
        dispatch(logout());
    };

    useEffect(() => {
        if (searchText.length > 0) {
            let _filteredSearch = searchData.filter(
                (data) =>
                    data.content
                        .toLowerCase()
                        .includes(searchText.toLowerCase()) ||
                    data.name.toLowerCase().includes(searchText.toLowerCase())
            );

            setFilteredSearch(_filteredSearch);

            setSearchShow(true);
        } else {
            setSearchShow(false);
        }

        return () => setFilteredSearch([]);
    }, [searchText]);

    return (
        <Box
            sx={{
                display: "flex",
                flexGrow: 1,
                maxWidth: "100%",
                backgroundColor: "#f5f7ff",
            }}
        >
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
                            ...(searchOpen && { display: "none" }),
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
                            ...(searchOpen && { display: "none" }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <div
                        className={`${
                            searchOpen ? "tw-flex" : "tw-hidden"
                        } tw-flex-grow  sm:tw-flex tw-items-center tw-justify-center tw-flex-col tw-relative`}
                    >
                        <span className="p-input-icon-left tw-w-full sm:tw-w-96">
                            <i className="pi pi-search" />
                            <InputText
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                placeholder="Search"
                                className="tw-w-full"
                            />
                        </span>
                        <div
                            className={`tw-w-full tw-min-h-fit tw-bg-white tw-absolute tw-top-12 tw-border tw-rounded-lg tw-overflow-hidden ${
                                searchShow ? "" : "tw-hidden"
                            }`}
                        >
                            {filteredSearch.length > 0 ? (
                                filteredSearch.map((value) => (
                                    <RouterLink
                                        className=""
                                        key={value.id}
                                        to={value.link}
                                    >
                                        <div className="tw-py-3 tw-px-4 tw-border-b hover:tw-bg-gray-100 ">
                                            <p className="tw-text-lg tw-text-black tw-my-0">
                                                {value.name}
                                            </p>
                                        </div>
                                    </RouterLink>
                                ))
                            ) : (
                                <div className="tw-py-3 tw-px-4 tw-border-b ">
                                    <p className="tw-my-2">
                                        No search result found
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div
                        className={`${
                            searchShow ? "" : "tw-flex-grow"
                        } sm:tw-flex-grow`}
                    ></div>
                    <div className="sm:tw-hidden">
                        <IconButton
                            color="inherit"
                            style={{ marginRight: 5 }}
                            onClick={() => setSearchOpen(!searchOpen)}
                        >
                            <SearchIcon />
                        </IconButton>
                    </div>
                    <IconButton
                        color="inherit"
                        onClick={(e) => notificationRef.current?.toggle(e)}
                        style={{ marginRight: 10 }}
                    >
                        <Badge badgeContent={0} color="secondary">
                            <NotificationsIcon />
                        </Badge>

                        <PRMenu
                            baseZIndex={5000}
                            model={[
                                {
                                    label: "Notification history",
                                    template: (item) => (
                                        <div className="tw-px-4 tw-py-2 tw-bg-gray-200 ">
                                            <div className="tw-float-right">
                                                <RouterLink
                                                    to="/admin/dashboard/notification-history"
                                                    className="tw-text-blue-500 "
                                                >
                                                    {item.label}
                                                </RouterLink>
                                            </div>
                                            <div className="tw-clear-both"></div>
                                        </div>
                                    ),
                                },
                                notifications && notifications.length > 0
                                    ? notifications.slice(0, 9).map((val) =>
                                          val.type ==
                                          "App\\Notifications\\NegativeFeedback"
                                              ? {
                                                    label: val.data.read_at,
                                                    template: (
                                                        item,
                                                        options
                                                    ) => (
                                                        <div className="tw-py-2 tw-px-4">
                                                            <div className="tw-flex tw-mb-0 tw-items-center tw-gap-2">
                                                                <p className="tw-my-0 tw-grow">
                                                                    A new
                                                                    negative
                                                                    feedback had
                                                                    been
                                                                    submitted.
                                                                </p>
                                                                <div className="tw-rounded-full tw-border-2 tw-border-black"></div>
                                                                <small>
                                                                    {item.label
                                                                        ? "Read"
                                                                        : "New"}
                                                                </small>
                                                            </div>
                                                            <small>
                                                                {moment().fromNow()}
                                                            </small>
                                                        </div>
                                                    ),
                                                }
                                              : val.type ==
                                                "App\\Notifications\\BookingComplete"
                                              ? {
                                                    label: val.data.read_at,
                                                    template: (
                                                        item,
                                                        options
                                                    ) => (
                                                        <div className="tw-py-2 tw-px-4">
                                                            <div className="tw-flex tw-mb-0 tw-items-center tw-gap-2">
                                                                <p className="tw-my-0 tw-grow">
                                                                    Booking had
                                                                    been
                                                                    completed
                                                                </p>
                                                                <div className="tw-rounded-full tw-border-2 tw-border-black"></div>
                                                                <small>
                                                                    {item.label
                                                                        ? "Read"
                                                                        : "New"}
                                                                </small>
                                                            </div>
                                                            <small>
                                                                {moment().fromNow()}
                                                            </small>
                                                        </div>
                                                    ),
                                                }
                                              : val.type ==
                                                "App\\Notifications\\BookingRescheduled"
                                              ? {
                                                    label: val.data.read_at,
                                                    template: (
                                                        item,
                                                        options
                                                    ) => (
                                                        <div className="tw-py-2 tw-px-4">
                                                            <div className="tw-flex tw-mb-0 tw-items-center tw-gap-2">
                                                                <p className="tw-my-0 tw-grow">
                                                                    Booking had
                                                                    been
                                                                    rescheduled
                                                                </p>
                                                                <div className="tw-rounded-full tw-border-2 tw-border-black"></div>
                                                                <small>
                                                                    {item.label
                                                                        ? "Read"
                                                                        : "New"}
                                                                </small>
                                                            </div>
                                                            <small>
                                                                {moment().fromNow()}
                                                            </small>
                                                        </div>
                                                    ),
                                                }
                                              : val.type ==
                                                "App\\Notifications\\CheckIn"
                                              ? {
                                                    label: val.data.read_at,
                                                    template: (
                                                        item,
                                                        options
                                                    ) => (
                                                        <div className="tw-py-2 tw-px-4">
                                                            <div className="tw-flex tw-mb-0 tw-items-center tw-gap-2">
                                                                <p className="tw-my-0 tw-grow">
                                                                    A candidate
                                                                    had joined
                                                                    the meeting
                                                                </p>
                                                                <div className="tw-rounded-full tw-border-2 tw-border-black"></div>
                                                                <small>
                                                                    {item.label
                                                                        ? "Read"
                                                                        : "New"}
                                                                </small>
                                                            </div>
                                                            <small>
                                                                {moment().fromNow()}
                                                            </small>
                                                        </div>
                                                    ),
                                                }
                                              : val.type ==
                                                "App\\Notifications\\CheckOut"
                                              ? {
                                                    label: val.data.read_at,
                                                    template: (
                                                        item,
                                                        options
                                                    ) => (
                                                        <div className="tw-py-2 tw-px-4">
                                                            <div className="tw-flex tw-mb-0 tw-items-center tw-gap-2">
                                                                <p className="tw-my-0 tw-grow">
                                                                    A candidate
                                                                    had left the
                                                                    meeting
                                                                </p>
                                                                <div className="tw-rounded-full tw-border-2 tw-border-black"></div>
                                                                <small>
                                                                    {item.label
                                                                        ? "Read"
                                                                        : "New"}
                                                                </small>
                                                            </div>
                                                            <small>
                                                                {moment().fromNow()}
                                                            </small>
                                                        </div>
                                                    ),
                                                }
                                              : {}
                                      )
                                    : [
                                          {
                                              label: "No notiffication yet...",
                                              template: (item, options) => (
                                                  <div className="tw-py-2 tw-px-4">
                                                      <div className="tw-flex tw-mb-0 tw-items-center tw-gap-2">
                                                          <p className="tw-my-0 tw-grow">
                                                              {item.label}
                                                          </p>
                                                          <div className="tw-rounded-full tw-border-2 tw-border-black"></div>
                                                      </div>
                                                  </div>
                                              ),
                                          },
                                      ],
                            ].flat()}
                            popup
                            ref={notificationRef}
                            onShow={() => dispatch(markNotification())}
                            style={{ width: 460 }}
                            //className="tw-w-full sm:tw-w-[640px]"
                        />
                    </IconButton>
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
                                        <MenuItem onClick={handleCloseNavMenu}>
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
                                        <MenuItem onClick={handleCloseNavMenu}>
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
                    backgroundColor: "#f5f7ff",
                    flexGrow: 1,
                    height: "100vh",
                    overflow: "auto",
                    display: "flex",
                    flexDirection: "column",
                    width: { sm: `calc(100vw - ${drawerWidth}px)` },
                }}
            >
                <Toolbar />

                <Container
                    maxWidth="lg"
                    sx={{
                        mt: 2,
                        mb: 2,
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {children}
                    <Copyright sx={{ pt: 4 }} />
                </Container>
            </Box>
        </Box>
    );
};

export default DrawerContainer;
