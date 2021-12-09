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
import { getLivecalls, clearLivecall } from "../../actions/livecall";
import { connect } from "react-redux";

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

const LiveCallTable = ({ livecalls, loading, getLivecalls, clearLivecall }) => {
    const [page, setPage] = React.useState(0);

    React.useEffect(() => {
        getLivecalls();

        return clearLivecall;
    }, []);

    const handleDelete = (row) => {};

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
                                                {row.name}
                                            </StyledTableCell>
                                            <StyledTableCell align="left">
                                                {row.query_type}
                                            </StyledTableCell>
                                            <StyledTableCell align="left">
                                                {row.email}
                                            </StyledTableCell>
                                            <StyledTableCell align="left">
                                                {row.roles[0]?.name}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                <Grid container spacing={2}>
                                                    <Grid item xs={6}>
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={() =>
                                                                handleEnable(
                                                                    row.id
                                                                )
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
                                                                    row
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
});

export default connect(mapStateToProps, { getLivecalls, clearLivecall })(
    LiveCallTable
);
