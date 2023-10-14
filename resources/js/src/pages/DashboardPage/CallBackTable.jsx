import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Column } from "primereact/column";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import { red, yellow } from "@mui/material/colors";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import Typography from "@mui/material/Typography";
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
    const [searchCallbacks, setSearchCallbacks] = useState([]);
    const [query, setQuery] = useState("");
    const [data, setData] = useState({
        from: "",
        to: "",
    });

    const handleOnDownload = () => {
        window.location.href = `/callback/download?from=${data.from}&to=${data.to}`;
    };

    useEffect(() => {
        getCallbacks();

        return clearCallback;
    }, []);

    useEffect(() => {
        if (callbacks) {
            setSearchCallbacks(callbacks.data);
        }
    }, [callbacks]);

    useEffect(() => {
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

    const handleChangePage = (newPage) => {
        if (callbacks.current_page > newPage + 1) {
            getCallbacksByUrl(callbacks.prev_page_url);
        } else {
            getCallbacksByUrl(callbacks.next_page_url);
        }
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Keyword Search"
                    />
                </span>
            </div>
        );
    };

    const header = renderHeader();

    const actionBodyTemplate = (row) => {
        return (
            <div className="tw-flex">
                <Tooltip title="Successful">
                    <span>
                        <IconButton
                            disabled={Boolean(row.called_at)}
                            onClick={() => handleCheck(row.id)}
                        >
                            <CheckIcon
                                color={row.called_at ? "disabled" : "success"}
                            />
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title="Failed">
                    <span>
                        <IconButton
                            disabled={Boolean(row.called_at)}
                            onClick={() => handleCancel(row.id)}
                        >
                            <CancelIcon
                                color={row.called_at ? "disabled" : ""}
                                sx={{
                                    color: row.called_at ? "" : yellow[700],
                                }}
                            />
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton onClick={() => handleDelete(row.id)}>
                        <DeleteIcon
                            sx={{
                                color: red[500],
                            }}
                        />
                    </IconButton>
                </Tooltip>
            </div>
        );
    };

    const statusBodyTemplate = (row) => {
        if (!row.status ? null : row.status === "FAILED") {
            return <Tag value={row.status} severity="error"></Tag>;
        } else if (!row.status ? null : row.status === "SUCCESSFUL") {
            return <Tag value={row.status} severity="success"></Tag>;
        } else {
            return <span></span>;
        }
    };

    const dateBodyTemplate = (rowData) => {
        return (
            <div>
                <Moment format="ll">{rowData.date}</Moment>
            </div>
        );
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

                    <DataTable
                        value={searchCallbacks}
                        paginator
                        rows={20}
                        totalRecords={callbacks?.total || 0}
                        onPage={({ page }) => handleChangePage(page)}
                        //rowsPerPageOptions={[25]}
                        tableStyle={{ minWidth: "50rem" }}
                        loading={loading}
                        dataKey="id"
                        header={header}
                        emptyMessage="No data found"
                    >
                        <Column
                            field="id"
                            header="ID"
                            style={{ minWidth: "5%" }}
                        ></Column>
                        <Column
                            field="name"
                            header="Full name"
                            style={{ minWidth: "20%" }}
                            sortable
                        ></Column>
                        <Column
                            field="email"
                            header="Email"
                            style={{ minWidth: "15%" }}
                        ></Column>
                        <Column
                            field="phone"
                            header="Phone number"
                            style={{ minWidth: "10%" }}
                        ></Column>
                        <Column
                            field="date"
                            header="Date"
                            style={{ minWidth: "15%" }}
                            body={dateBodyTemplate}
                        ></Column>
                        <Column
                            field="time"
                            header="Time"
                            style={{ minWidth: "5%" }}
                        ></Column>
                        <Column
                            field="status"
                            header="Status"
                            style={{ minWidth: "5%" }}
                            sortable
                            body={statusBodyTemplate}
                        ></Column>

                        <Column
                            style={{ minWidth: "20%" }}
                            body={actionBodyTemplate}
                        ></Column>
                    </DataTable>
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
