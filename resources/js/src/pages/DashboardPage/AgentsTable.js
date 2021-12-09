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
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import { connect } from "react-redux";
import {
    getAllProfiles,
    enableUser,
    disableUser,
    delUser,
    clearProfile,
} from "../../actions/profile";

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

const AgentsTable = ({
    users,
    loading,
    getAllProfiles,
    alerts,
    enableUser,
    disableUser,
    delUser,
    clearProfile,
}) => {
    const [page, setPage] = React.useState(0);

    React.useEffect(() => {
        getAllProfiles();

        return clearProfile;
    }, []);

    const handleDelete = (row) => delUser(row);

    const handleDisable = (row) => disableUser(row);

    const handleEnable = (row) => enableUser(row);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="lg">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
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
                                ) : !users || users.data.length === 0 ? (
                                    <TableRow>
                                        <StyledTableCell scope="row">
                                            No Data Available.
                                        </StyledTableCell>
                                    </TableRow>
                                ) : (
                                    users.data.map((row) => (
                                        <StyledTableRow key={row.email}>
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
                                                {row.roles[0]?.name}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                {row.roles[0]?.name ===
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
                                        rowsPerPage={users?.data.length || 0}
                                        count={users?.total || 0}
                                        page={users?.current_page - 1 || 0}
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
};

export default connect(mapStateToProps, mapDispatchToProps)(AgentsTable);
