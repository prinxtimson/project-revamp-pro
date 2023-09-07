import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import { styled } from "@mui/material/styles";
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
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import ClearIcon from "@mui/icons-material/Cancel";
import DrawerContainer from "./DrawerContainer";
import { connect } from "react-redux";
import AddUserForm from "./AddUserForm";
import {
    getAllProfiles,
    enableUser,
    disableUser,
    delUser,
    getUsersByUrl,
    clearProfile,
} from "../../actions/profile";

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

const AgentsTable = ({
    users,
    loading,
    getAllProfiles,
    alerts,
    enableUser,
    disableUser,
    delUser,
    clearProfile,
    getUsersByUrl,
}) => {
    const [searchUsers, setSearchUsers] = React.useState([]);
    const [query, setQuery] = React.useState("");

    React.useEffect(() => {
        getAllProfiles();

        return clearProfile;
    }, []);

    const handleGetUsers = () => {
        getAllProfiles();
    };

    React.useEffect(() => {
        if (users) {
            setSearchUsers(users.data);
        }
    }, [users]);

    React.useEffect(() => {
        if (query) {
            axios
                .get(`/api/users/search/${query}`)
                .then((res) => {
                    setSearchUsers(res.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            if (users) {
                setSearchUsers(users.data);
            }
        }
    }, [query]);

    const handleDelete = (row) => delUser(row);

    const handleDisable = (row) => disableUser(row);

    const handleEnable = (row) => enableUser(row);

    const handleChangePage = (event, newPage) => {
        if (users.current_page > newPage + 1) {
            getUsersByUrl(users.prev_page_url);
        } else {
            getUsersByUrl(users.next_page_url);
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
                    <Box sx={{ maxWidth: 480, mb: 2, width: "100%" }}>
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
                                        <ClearIcon />
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
                                        Username
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                        Email
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                        Role
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
                                ) : !searchUsers || searchUsers.length === 0 ? (
                                    <TableRow>
                                        <StyledTableCell scope="row">
                                            No Data Available.
                                        </StyledTableCell>
                                    </TableRow>
                                ) : (
                                    searchUsers.map((row) => (
                                        <StyledTableRow key={row.email}>
                                            <StyledTableCell>
                                                {row.id}
                                            </StyledTableCell>
                                            <StyledTableCell scope="row">
                                                {row.name}
                                            </StyledTableCell>
                                            <StyledTableCell align="left">
                                                {row.username}
                                            </StyledTableCell>
                                            <StyledTableCell align="left">
                                                {row.email}
                                            </StyledTableCell>
                                            <StyledTableCell align="left">
                                                {row.roles[0].name}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                {row.roles[0].name ===
                                                "super-admin" ? null : (
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={6}>
                                                            {row.deleted_at ? (
                                                                <Button
                                                                    size="small"
                                                                    variant="outlined"
                                                                    onClick={() =>
                                                                        handleEnable(
                                                                            row.id
                                                                        )
                                                                    }
                                                                >
                                                                    Enable
                                                                </Button>
                                                            ) : (
                                                                <Button
                                                                    size="small"
                                                                    variant="outlined"
                                                                    onClick={() =>
                                                                        handleDisable(
                                                                            row.id
                                                                        )
                                                                    }
                                                                >
                                                                    Disable
                                                                </Button>
                                                            )}
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
                                                            >
                                                                Delete
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                )}
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))
                                )}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        rowsPerPageOptions={[20]}
                                        rowsPerPage={users?.per_page || 0}
                                        count={users?.total || 0}
                                        page={users?.current_page - 1 || 0}
                                        onPageChange={handleChangePage}
                                    />
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                </Box>
                <AddUserForm handleGetUsers={handleGetUsers} />
            </Container>
        </DrawerContainer>
    );
};

const mapStateToProps = (state) => ({
    alerts: state.alert,
    users: state.profile.profiles,
    loading: state.profile.loading,
});

const mapDispatchToProps = {
    enableUser,
    disableUser,
    getAllProfiles,
    delUser,
    clearProfile,
    getUsersByUrl,
};

export default connect(mapStateToProps, mapDispatchToProps)(AgentsTable);
