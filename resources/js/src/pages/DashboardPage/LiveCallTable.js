import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import {
    getLivecalls,
    clearLivecall,
    delLivecall,
    answerLivecall,
    setLivecalls,
} from "../../actions/livecall";
import { connect } from "react-redux";
import Moment from "react-moment";
import moment from "moment";

const theme = createTheme();

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    head: {
        backgroundColor: theme.palette.common.white,
        color: theme.palette.common.black,
    },
    body: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    root: {
        "&:nth-of-type(odd)": {
            backgroundColor: theme.palette.action.hover,
        },
    },
}));

const LiveCallTable = ({
    livecalls,
    loading,
    getLivecalls,
    clearLivecall,
    delLivecall,
    answerLivecall,
    setLivecalls,
    alerts,
}) => {
    const [page, setPage] = React.useState(0);
    const [actionLoading, setActionLoading] = React.useState(false);
    const [queryType, setQueryType] = React.useState("");

    React.useEffect(() => {
        getLivecalls();

        return clearLivecall;
    }, []);

    React.useEffect(() => {
        if (queryType)
            window.history.replaceState(null, "", `?query_type="${queryType}"`);
        else window.history.replaceState(null, "", "/admin/dashboard/livecall");
    }, [queryType]);

    const handleDelete = (id) => delLivecall(id);

    const handleConnect = (id) => {
        answerLivecall(id, handleLoading);
    };

    const handleLoading = () => setActionLoading(!actionLoading);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleOnSelectChange = (text) => {
        if (text) {
            setQueryType(text);

            window.axios
                .get(`/api/livecall/search/${text}`)
                .then((res) => {
                    setLivecalls(res.data);
                })
                .catch((err) => {
                    console.log(err.response);
                });
        } else {
            setQueryType("");

            window.axios
                .get(`/api/livecall`)
                .then((res) => {
                    setLivecalls(res.data);
                })
                .catch((err) => {
                    console.log(err.response);
                });
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Stack sx={{ width: "100%" }} spacing={2}>
                {alerts.map(
                    (alert) =>
                        alert.alertType === "danger" && (
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
                                    key={alert.id}
                                    variant="filled"
                                    severity="error"
                                >
                                    {alert.msg}
                                </Alert>
                            </Snackbar>
                        )
                )}
            </Stack>
            <Container component="main" maxWidth="lg">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: "white",
                        borderRadius: 2,
                        padding: 3,
                    }}
                >
                    <div style={{ margin: 10 }}>
                        <Grid container spacing={5}>
                            <Grid item xs />
                            <Grid item xs>
                                <TextField
                                    id="query_type"
                                    select
                                    fullWidth
                                    margin="dense"
                                    label="Select Query Type"
                                    value={queryType}
                                    onChange={(e) =>
                                        handleOnSelectChange(e.target.value)
                                    }
                                    SelectProps={{
                                        native: true,
                                    }}
                                    variant="outlined"
                                >
                                    <option />
                                    <option value="Mentor Request">
                                        Mentor Request
                                    </option>
                                    <option value="Second Project Request">
                                        Second Project Request
                                    </option>
                                    <option value="Referencing">
                                        Referencing
                                    </option>
                                    <option value="Developer Request">
                                        Developer Request
                                    </option>
                                    <option value="Taster Session">
                                        Taster Session
                                    </option>
                                    <option value="Enquiry">Enquiry</option>
                                    <option value="New Candidate Support">
                                        New Candidate Support
                                    </option>
                                    <option value="Software issues">
                                        Software issues
                                    </option>
                                    <option value="LMS queries">
                                        LMS queries
                                    </option>
                                    <option value="Access issue">
                                        Access issue
                                    </option>
                                    <option value="Other IT issues">
                                        Other IT issues
                                    </option>
                                </TextField>
                            </Grid>
                        </Grid>
                    </div>
                    <TableContainer
                        variant="elevation"
                        style={{
                            borderTopLeftRadius: 0,
                            borderTopRightRadius: 0,
                        }}
                        elevation={0}
                        component={Paper}
                    >
                        <Table aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>ID</StyledTableCell>
                                    <StyledTableCell align="left">
                                        Query Type
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                        Wait Duration
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                        Status
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        Actions
                                    </StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <StyledTableCell scope="row">
                                            Loading.....
                                        </StyledTableCell>
                                    </TableRow>
                                ) : !livecalls ||
                                  livecalls?.data.length === 0 ? (
                                    <TableRow>
                                        <StyledTableCell scope="row">
                                            No Data Available.
                                        </StyledTableCell>
                                    </TableRow>
                                ) : (
                                    livecalls?.data.map((row) => (
                                        <StyledTableRow key={row.id}>
                                            <StyledTableCell scope="row">
                                                {row.id}
                                            </StyledTableCell>
                                            <StyledTableCell align="left">
                                                {row.query_type}
                                            </StyledTableCell>
                                            <StyledTableCell align="left">
                                                {row.answered_at ||
                                                row.left_at ? (
                                                    <Moment
                                                        from={row.created_at}
                                                        ago
                                                    >
                                                        {row.answered_at ||
                                                            row.left_at}
                                                    </Moment>
                                                ) : (
                                                    <Moment fromNow ago>
                                                        {row.created_at}
                                                    </Moment>
                                                )}
                                            </StyledTableCell>
                                            <StyledTableCell align="left">
                                                {row.answered_at
                                                    ? "Answered"
                                                    : row.left_at
                                                    ? "Left"
                                                    : "Waiting"}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                <Grid container spacing={2}>
                                                    <Grid item xs={6}>
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={() =>
                                                                handleConnect(
                                                                    row.id
                                                                )
                                                            }
                                                            disabled={
                                                                Boolean(
                                                                    row.answered_at
                                                                ) ||
                                                                Boolean(
                                                                    row.left_at
                                                                ) ||
                                                                actionLoading
                                                            }
                                                        >
                                                            Connect
                                                        </Button>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Button
                                                            variant="contained"
                                                            color="secondary"
                                                            size="small"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    row.id
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))
                                )}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        rowsPerPageOptions={[20]}
                                        rowsPerPage={
                                            livecalls?.data.length || 0
                                        }
                                        count={livecalls?.total || 0}
                                        page={livecalls?.current_page - 1 || 0}
                                        onPageChange={handleChangePage}
                                    />
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

const mapStateToProps = (state) => ({
    loading: state.livecall.loading,
    livecalls: state.livecall.livecalls,
    alerts: state.alert,
});

export default connect(mapStateToProps, {
    getLivecalls,
    clearLivecall,
    delLivecall,
    answerLivecall,
    setLivecalls,
})(LiveCallTable);
