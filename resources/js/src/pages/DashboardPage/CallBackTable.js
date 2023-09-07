import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import { styled } from "@mui/material/styles";
import { red, yellow } from "@mui/material/colors";
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
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import { Tag } from "primereact/tag";
import Moment from "react-moment";
import { connect } from "react-redux";
import {
    getCallbacks,
    clearCallback,
    delCallback,
    callbackFailed,
    callbackSuccessful,
    getCallbacksByUrl,
} from "../../actions/callback";
import DrawerContainer from "./DrawerContainer";

const axios = window.axios;

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

const CallBackTable = ({
    loading,
    callbacks,
    getCallbacks,
    clearCallback,
    delCallback,
    callbackFailed,
    callbackSuccessful,
    getCallbacksByUrl,
}) => {
    const [searchCallbacks, setSearchCallbacks] = React.useState([]);
    const [query, setQuery] = React.useState("");
    const [data, setData] = React.useState({
        from: "",
        to: "",
    });

    const handleOnDownload = () => {
        window.location.href = `/callback/download?from=${data.from}&to=${data.to}`;
    };

    React.useEffect(() => {
        getCallbacks();

        return clearCallback;
    }, []);

    React.useEffect(() => {
        if (callbacks) {
            setSearchCallbacks(callbacks.data);
        }
    }, [callbacks]);

    React.useEffect(() => {
        if (query) {
            axios
                .get(`/api/callback/search/${query}`)
                .then((res) => {
                    setSearchCallbacks(res.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            if (callbacks) {
                setSearchCallbacks(callbacks.data);
            }
        }
    }, [query]);

    const handleDelete = (row) => {
        delCallback(row);
    };

    const handleCheck = (id) => callbackSuccessful(id);

    const handleCancel = (id) => callbackFailed(id);

    const handleChangePage = (event, newPage) => {
        if (callbacks.current_page > newPage + 1) {
            getCallbacksByUrl(callbacks.prev_page_url);
        } else {
            getCallbacksByUrl(callbacks.next_page_url);
        }
    };

    return (
        <DrawerContainer>
            <Container component="main" maxWidth="lg">
                <CssBaseline />

                <Box
                    sx={{
                        marginTop: 4,
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: "white",
                        borderRadius: 2,
                        padding: 3,
                    }}
                >
                    <Card
                        sx={{
                            my: 2,
                            padding: 3,
                            width: "100%",
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
                                    value={data.from}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
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
                                    value={data.to}
                                    size="small"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
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
                                    disabled={!data.from || !data.to}
                                >
                                    Download
                                </Button>
                            </Grid>
                        </Grid>
                    </Card>
                    <Box sx={{ mb: 2, width: "100%" }}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            label="Search"
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <IconButton
                                        sx={{
                                            visibility: query
                                                ? "visible"
                                                : "hidden",
                                        }}
                                        onClick={() => setQuery("")}
                                    >
                                        <CancelIcon />
                                    </IconButton>
                                ),
                            }}
                        />
                    </Box>
                    <Divider />
                    <TableContainer
                        variant="elevation"
                        style={{
                            borderTopLeftRadius: 0,
                            borderTopRightRadius: 0,
                            width: "100%",
                            //overflow: 'auto'
                        }}
                        elevation={0}
                        component={Paper}
                    >
                        <Table aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>ID</StyledTableCell>
                                    <StyledTableCell>Name</StyledTableCell>
                                    <StyledTableCell align="left">
                                        Email
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                        Phone
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                        Date
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                        Time
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        Status
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
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
                                ) : !searchCallbacks ||
                                  searchCallbacks.length === 0 ? (
                                    <TableRow>
                                        <StyledTableCell scope="row">
                                            No Data Available.
                                        </StyledTableCell>
                                    </TableRow>
                                ) : (
                                    searchCallbacks.map((row) => (
                                        <StyledTableRow key={row.id}>
                                            <StyledTableCell>
                                                {row.id}
                                            </StyledTableCell>
                                            <StyledTableCell scope="row">
                                                {row.name}
                                            </StyledTableCell>
                                            <StyledTableCell align="left">
                                                {row.email}
                                            </StyledTableCell>
                                            <StyledTableCell align="left">
                                                {row.phone}
                                            </StyledTableCell>
                                            <StyledTableCell align="left">
                                                <Moment format="ll">
                                                    {row.date}
                                                </Moment>
                                            </StyledTableCell>
                                            <StyledTableCell align="left">
                                                {row.time}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                {!row.status ? null : row.status ===
                                                  "FAILED" ? (
                                                    <Tag
                                                        value={row.status}
                                                        severity="error"
                                                    ></Tag>
                                                ) : (
                                                    <Tag
                                                        value={row.status}
                                                        severity="success"
                                                    ></Tag>
                                                )}
                                            </StyledTableCell>
                                            <StyledTableCell align="left">
                                                <Tooltip title="Successful">
                                                    <span>
                                                        <IconButton
                                                            disabled={Boolean(
                                                                row.called_at
                                                            )}
                                                            onClick={() =>
                                                                handleCheck(
                                                                    row.id
                                                                )
                                                            }
                                                        >
                                                            <CheckIcon
                                                                color={
                                                                    row.called_at
                                                                        ? "disabled"
                                                                        : "success"
                                                                }
                                                            />
                                                        </IconButton>
                                                    </span>
                                                </Tooltip>
                                                <Tooltip title="Failed">
                                                    <span>
                                                        <IconButton
                                                            disabled={Boolean(
                                                                row.called_at
                                                            )}
                                                            onClick={() =>
                                                                handleCancel(
                                                                    row.id
                                                                )
                                                            }
                                                        >
                                                            <CancelIcon
                                                                color={
                                                                    row.called_at
                                                                        ? "disabled"
                                                                        : ""
                                                                }
                                                                sx={{
                                                                    color: row.called_at
                                                                        ? ""
                                                                        : yellow[700],
                                                                }}
                                                            />
                                                        </IconButton>
                                                    </span>
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                    <IconButton
                                                        onClick={() =>
                                                            handleDelete(row.id)
                                                        }
                                                    >
                                                        <DeleteIcon
                                                            sx={{
                                                                color: red[500],
                                                            }}
                                                        />
                                                    </IconButton>
                                                </Tooltip>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))
                                )}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        rowsPerPageOptions={[20]}
                                        rowsPerPage={callbacks?.per_page || 0}
                                        count={callbacks?.total || 0}
                                        page={callbacks?.current_page - 1 || 0}
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

const mapStateToProps = (state) => ({
    loading: state.callback.loading,
    callbacks: state.callback.callbacks,
});

export default connect(mapStateToProps, {
    getCallbacks,
    clearCallback,
    delCallback,
    callbackFailed,
    callbackSuccessful,
    getCallbacksByUrl,
})(CallBackTable);
