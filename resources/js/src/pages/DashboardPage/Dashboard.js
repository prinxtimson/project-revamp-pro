import React from "react";
import Grid from "@mui/material/Grid";
import UserCard from "../../components/UserCard";
import LivecallCard from "../../components/LivecallCard";

const Dashboard = () => {
    return (
        <Grid container spacing={5}>
            <Grid item xs={12}>
                <Grid container spacing={5}>
                    <Grid item md={6} sm={6} xs={12}>
                        <UserCard />
                    </Grid>

                    <Grid item md={6} sm={6} xs={12}>
                        <LivecallCard />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Dashboard;
