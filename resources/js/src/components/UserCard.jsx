import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { styled, useTheme } from "@mui/material/styles";
import { Avatar, Box, Grid, Typography, Card } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import Skeleton from "@mui/material/Skeleton";
import { getProfiles, clear } from "../features/profile/profileSlice";

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

const UserCard = () => {
    const theme = useTheme();
    const [count, setCount] = useState(0);

    const dispatch = useDispatch();

    const { users, isLoading, isSuccess, type, isError, message } = useSelector(
        (state) => state.profile
    );

    useEffect(() => {
        dispatch(getProfiles());

        return () => dispatch(clear());
    }, []);

    useEffect(() => {
        if (users) {
            setCount(users.length);
        }
        return () => setCount(null);
    }, [users]);

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
                            <Grid item />
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
                            Total Staff
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </CardWrapper>
    );
};

export default UserCard;
