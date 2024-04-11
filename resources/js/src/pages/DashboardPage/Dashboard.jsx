import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { Chart } from "primereact/chart";
import DrawerContainer from "./DrawerContainer";
const axios = window.axios;

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [callbacks, setCallbacks] = useState({});
    const [livecalls, setLivecalls] = useState({});
    const [lightOptions] = useState({
        plugins: {
            legend: {
                labels: {
                    color: "#495057",
                },
            },
        },
    });

    useEffect(() => {
        axios
            .get("/api/callback/summary/get")
            .then((res) => {
                const { total_successful, total_failed, total_waiting } =
                    res.data;
                setCallbacks({
                    labels: [
                        "Successful Callback",
                        "Failed Callback",
                        "Waiting Callback",
                    ],
                    datasets: [
                        {
                            data: [
                                total_successful,
                                total_failed,
                                total_waiting,
                            ],
                            backgroundColor: ["#42A5F5", "#66BB6A", "#FFA726"],
                            hoverBackgroundColor: [
                                "#64B5F6",
                                "#81C784",
                                "#FFB74D",
                            ],
                        },
                    ],
                });

                return axios.get("/api/livecall/summary/get");
            })
            .then((res) => {
                const { total_answered, total_left } = res.data;
                setLivecalls({
                    labels: ["Answered Live Calls", "Left Live Calls"],
                    datasets: [
                        {
                            data: [total_answered, total_left],
                            backgroundColor: ["#42A5F5", "#66BB6A", "#FFA726"],
                            hoverBackgroundColor: [
                                "#64B5F6",
                                "#81C784",
                                "#FFB74D",
                            ],
                        },
                    ],
                });
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    if (loading) {
        return (
            <DrawerContainer>
                <Box
                    sx={{
                        flexGrow: 1,
                        marginTop: 5,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Typography>Loading .....</Typography>
                </Box>
            </DrawerContainer>
        );
    }

    return (
        <DrawerContainer>
            <Box
                sx={{
                    flexGrow: 1,
                    marginTop: 5,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Grid container spacing={5}>
                    <Grid item xs={12}>
                        <Grid container spacing={5}>
                            <Grid item md={6} sm={6} xs={12}>
                                <Chart
                                    type="pie"
                                    data={callbacks}
                                    options={lightOptions}
                                    style={{ position: "relative" }}
                                />
                            </Grid>

                            <Grid item md={6} sm={6} xs={12}>
                                <Chart
                                    type="pie"
                                    data={livecalls}
                                    options={lightOptions}
                                    style={{ position: "relative" }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </DrawerContainer>
    );
};

export default Dashboard;
