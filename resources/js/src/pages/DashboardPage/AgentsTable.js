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
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";

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

const AgentsTable = () => {
    const [user, setUser] = React.useState(null);
    const [page, setPage] = React.useState(0);
    const [role, setRole] = React.useState("");
    const [state, setState] = React.useState({
        rows: [],
        loading: false,
        error: null,
        msg: null,
    });

    const handleDelete = (row) => {};

    const handleDisable = (row) => {};

    const handleEnable = (row) => {};

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
                                {state.loading ? (
                                    <TableRow>
                                        <StyledTableCell scope="row">
                                            Loading.....
                                        </StyledTableCell>
                                    </TableRow>
                                ) : state.rows.length === 0 ? (
                                    <TableRow>
                                        <StyledTableCell scope="row">
                                            No Data Available.
                                        </StyledTableCell>
                                    </TableRow>
                                ) : (
                                    state.rows.map((row) => (
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
                                                                <EnableButton
                                                                    size="small"
                                                                    variant="outlined"
                                                                    onClick={() =>
                                                                        handleEnable(
                                                                            row.id
                                                                        )
                                                                    }
                                                                >
                                                                    Enable
                                                                </EnableButton>
                                                            ) : (
                                                                <DisableButton
                                                                    size="small"
                                                                    variant="outlined"
                                                                    onClick={() =>
                                                                        handleDisable(
                                                                            row.id
                                                                        )
                                                                    }
                                                                >
                                                                    Disable
                                                                </DisableButton>
                                                            )}
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Button
                                                                variant="contained"
                                                                color="secondary"
                                                                size="small"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        row
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
                                        rowsPerPage={state.rows.length}
                                        count={state.rows.length}
                                        page={page}
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

export default AgentsTable;
