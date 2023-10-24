import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { styled, useTheme } from "@mui/material/styles";
import {
    Avatar,
    Box,
    Grid,
    Menu,
    MenuItem,
    Typography,
    Card,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PeopleIcon from "@mui/icons-material/People";
import Skeleton from "@mui/material/Skeleton";
import { getLivecalls, clear } from "../features/livecall/livecallSlice";

const CardWrapper = styled(Card)(({ theme }) => ({
    backgroundColor: theme.palette.secondary.dark,
    color: "#fff",
    overflow: "hidden",
    position: "relative",
    "&:after": {
        content: '""',
        position: "absolute",
        width: 210,
        height: 210,
        background: theme.palette.primary[800],
        borderRadius: "50%",
        top: -85,
        right: -95,
        [theme.breakpoints.down("sm")]: {
            top: -105,
            right: -140,
        },
    },
    "&:before": {
        content: '""',
        position: "absolute",
        width: 210,
        height: 210,
        background: theme.palette.primary[800],
        borderRadius: "50%",
        top: -125,
        right: -15,
        opacity: 0.5,
        [theme.breakpoints.down("sm")]: {
            top: -155,
            right: -70,
        },
    },
}));

const queryTypes = [];

const LivecallCard = () => {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState(null);
    const [count, setCount] = useState(0);

    const dispatch = useDispatch();

    const { livecalls, isLoading, isSuccess, type, isError, message } =
        useSelector((state) => state.livecall);

    useEffect(() => {
        dispatch(getLivecalls());

        return () => dispatch(clear());
    }, []);

    useEffect(() => {
        if (livecalls) {
            setCount(livecalls.length);
        }
    }, [livecalls]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleOnLivecalls = () => {
        setCount(livecalls.length);
        handleClose();
    };

    const handleLivecallsType = (val) => {
        handleClose();
    };

    if (isLoading) {
        return <Skeleton variant="rectangular" width={"100%"} height={118} />;
    }

    return (
        <CardWrapper border={false} content={false}>
            <Box sx={{ p: 2.25 }}>
                <Grid container direction="column">
                    <Grid item>
                        <Grid container justifyContent="space-between">
                            <Grid item>
                                <Avatar
                                    variant="rounded"
                                    sx={{
                                        ...theme.typography.commonAvatar,
                                        ...theme.typography.largeAvatar,
                                        backgroundColor:
                                            "rgba(255,255,255,0.3)",
                                        mt: 1,
                                    }}
                                >
                                    <PeopleIcon />
                                </Avatar>
                            </Grid>
                            <Grid item>
                                <Avatar
                                    variant="rounded"
                                    sx={{
                                        ...theme.typography.commonAvatar,
                                        ...theme.typography.mediumAvatar,
                                        backgroundColor:
                                            theme.palette.secondary.dark,
                                        color: theme.palette.secondary[200],
                                        zIndex: 1,
                                    }}
                                    aria-controls="menu-earning-card"
                                    aria-haspopup="true"
                                    onClick={handleClick}
                                >
                                    <MoreHorizIcon fontSize="inherit" />
                                </Avatar>
                                <Menu
                                    id="menu-earning-card"
                                    anchorEl={anchorEl}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                    variant="selectedMenu"
                                    anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "right",
                                    }}
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                >
                                    <MenuItem onClick={handleOnLivecalls}>
                                        All Livecalls
                                    </MenuItem>
                                    {queryTypes.map((val, index) => (
                                        <MenuItem
                                            onClick={() =>
                                                handleLivecallsType(val)
                                            }
                                            key={index}
                                        >
                                            {val}
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Typography
                            sx={{
                                fontSize: "2.125rem",
                                fontWeight: 500,
                                mr: 1,
                                mt: 1.75,
                                mb: 0.75,
                            }}
                        >
                            {count}
                        </Typography>
                    </Grid>
                    <Grid item sx={{ mb: 1.25 }}>
                        <Typography
                            sx={{
                                fontSize: "1rem",
                                fontWeight: 500,
                                color: theme.palette.secondary[200],
                            }}
                        >
                            Total Livecalls
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </CardWrapper>
    );
};

export default LivecallCard;
