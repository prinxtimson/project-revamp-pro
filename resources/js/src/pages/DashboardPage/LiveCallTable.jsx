import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
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
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Divider from "@mui/material/Divider";
import { Tag } from "primereact/tag";
import {
    deleteLivecall,
    answerLivecall,
    onSetLivecalls,
    getConnectedLivecalls,
    getLivecalls,
    getLivecallsByPage,
    reset,
    clear,
} from "../../features/livecall/livecallSlice";
import Moment from "react-moment";
import Typography from "@mui/material/Typography";
import DrawerContainer from "./DrawerContainer";
import { toast } from "react-toastify";

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

const LiveCallTable = () => {
    const [data, setData] = useState([]);
    const [queryType, setQueryType] = useState("");
    const [formData, setFormData] = useState({
        from: "",
        to: "",
    });

    const { livecalls, isLoading, isSuccess, type, isError, message } =
        useSelector((state) => state.livecall);
    const { user } = useSelector((state) => state.auth);

    const dispatch = useDispatch();

    useEffect(() => {
        if (livecalls) {
            setData(livecalls.data);
        }
    }, [livecalls]);

    useEffect(() => {
        if (queryType)
            window.history.replaceState(null, "", `?query_type="${queryType}"`);
        else window.history.replaceState(null, "", "/admin/dashboard/livecall");
    }, [queryType]);

    const handleDelete = (id) => dispatch(deleteLivecall(id));

    const handleConnect = (id) => {
        dispatch(answerLivecall(id));
    };

    const handleOnDownload = () => {
        window.location.href = `/livecall/report/download?from=${formData.from}&to=${formData.to}`;
    };

    const handleChangePage = (event, newPage) => {
        dispatch(getLivecallsByPage(newPage + 1));
    };

    const onFilterSelect = (e) => {
        if (e.target.value === "waiting") {
            dispatch(getConnectedLivecalls());
        } else {
            dispatch(getLivecalls());
        }
    };

    const handleOnSelectChange = (text) => {
        if (text) {
            setQueryType(text);

            window.axios
                .get(`/api/livecall/search/${text}`)
                .then((res) => {
                    dispatch(onSetLivecalls(res.data));
                })
                .catch((err) => {
                    console.log(err.response);
                });
        } else {
            setQueryType("");

            window.axios
                .get(`/api/livecall`)
                .then((res) => {
                    dispatch(onSetLivecalls(res.data));
                })
                .catch((err) => {
                    console.log(err.response);
                });
        }
    };

    useEffect(() => {
        if (isSuccess && message) {
            toast.success(message);
        }

        dispatch(reset());
    }, [isLoading, isSuccess, type, isError, message]);

    return (
        <DrawerContainer>
            <Container component="main" maxWidth="lg">
                <CssBaseline />

                <Box
                    sx={{
                        marginTop: 5,
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: "white",
                        borderRadius: 2,
                        padding: 3,
                    }}
                >
                    {user && user?.roles[0].name != "agent" && (
                        <Card
                            sx={{
                                my: 2,
                                padding: 3,
                            }}
                            variant="outlined"
                        >
                            <Typography
                                component="p"
                                variant="h6"
                                sx={{
                                    marginY: 2,
                                }}
                            >
                                Download Report
                            </Typography>
                            <Grid
                                container
                                spacing={3}
                                justifyContent="center"
                                alignItems="center"
                            >
                                <Grid item xs={12} sm={5}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        margin="dense"
                                        id="start"
                                        label="Start Date"
                                        type="date"
                                        size="small"
                                        value={formData.from}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                from: e.target.value,
                                            })
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12} sm={5}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        margin="dense"
                                        id="end"
                                        label="End Date"
                                        type="date"
                                        value={formData.to}
                                        size="small"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                to: e.target.value,
                                            })
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        onClick={handleOnDownload}
                                        disabled={
                                            !formData.from || !formData.to
                                        }
                                    >
                                        Download
                                    </Button>
                                </Grid>
                            </Grid>
                        </Card>
                    )}
                    <div style={{ margin: 10 }}>
                        <Grid container spacing={5}>
                            <Grid item xs>
                                <FormControl>
                                    <FormLabel id="filter-radio-buttons-group-label">
                                        Filter Queries
                                    </FormLabel>
                                    <RadioGroup
                                        row
                                        aria-labelledby="filter-radio-buttons-group-label"
                                        name="filter"
                                        onChange={onFilterSelect}
                                    >
                                        <FormControlLabel
                                            value="all"
                                            control={<Radio />}
                                            label="All Tickets"
                                        />
                                        <FormControlLabel
                                            value="waiting"
                                            control={<Radio />}
                                            label="Waiting Tickets"
                                        />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
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
                    <Divider sx={{ mt: 2 }} />
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
                                    <StyledTableCell align="center">
                                        Status
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        Actions
                                    </StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {isLoading && type === "" ? (
                                    <TableRow>
                                        <StyledTableCell scope="row">
                                            Loading.....
                                        </StyledTableCell>
                                    </TableRow>
                                ) : !livecalls || data.length === 0 ? (
                                    <TableRow>
                                        <StyledTableCell scope="row">
                                            No Data Available.
                                        </StyledTableCell>
                                    </TableRow>
                                ) : (
                                    data.map((row) => (
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
                                            <StyledTableCell align="center">
                                                {row.answered_at ? (
                                                    <Tag
                                                        value="ANSWERED"
                                                        severity="success"
                                                    />
                                                ) : row.left_at ? (
                                                    <Tag
                                                        value="LEFT"
                                                        severity="error"
                                                    />
                                                ) : (
                                                    <Tag
                                                        value="WAITING"
                                                        severity="info"
                                                    />
                                                )}
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
                                                                Boolean(
                                                                    isLoading &&
                                                                        type ===
                                                                            "livecall/answer/pending"
                                                                )
                                                            }
                                                        >
                                                            Connect
                                                        </Button>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Button
                                                            variant="contained"
                                                            color="error"
                                                            size="small"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    row.id
                                                                )
                                                            }
                                                            disabled={Boolean(
                                                                isLoading &&
                                                                    type ===
                                                                        "livecall/answer/pending"
                                                            )}
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
                                        rowsPerPage={livecalls?.per_page || 0}
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
        </DrawerContainer>
    );
};

export default LiveCallTable;
