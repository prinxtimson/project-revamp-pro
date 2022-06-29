import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Moment from "react-moment";
import { connect } from "react-redux";
import Rating from "@mui/material/Rating";
import { getFeedbacks, clearFeedback } from "../../actions/feedback";
import { parseInt } from "lodash";
import DrawerContainer from "./DrawerContainer";

const FeedbackTable = ({ loading, getFeedbacks, clearFeedback, feedbacks }) => {
    const [page, setPage] = React.useState(0);

    const handleDelete = (row) => {};

    const handleDisable = (row) => {};

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    React.useEffect(() => {
        getFeedbacks();

        return clearFeedback;
    }, []);

    return (
        <DrawerContainer>
            <Container component="main" maxWidth="lg">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <List
                        sx={{
                            width: "100%",
                            bgcolor: "background.paper",
                        }}
                    >
                        {!loading && feedbacks.length === 0 && (
                            <ListItem>
                                <ListItemText
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                sx={{ display: "inline" }}
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                No feedback available.
                                            </Typography>
                                            {}
                                        </React.Fragment>
                                    }
                                />
                            </ListItem>
                        )}
                        {!loading &&
                            feedbacks.map((feedback) => {
                                console.log(feedback);
                                const ratings = feedback.data;

                                return (
                                    <Accordion key={feedback.id}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Moment
                                                format="lll"
                                                style={{
                                                    flexGrow: 1,
                                                }}
                                            >
                                                {feedback.created_at}
                                            </Moment>
                                            {"    "}
                                            <Typography
                                                component="h6"
                                                variant="p"
                                                sx={{
                                                    mb: 0,
                                                    alignSelf: "center",
                                                }}
                                            >{`Average Rating   -     ${
                                                ratings.reduce(
                                                    (total, val) =>
                                                        total +
                                                        parseInt(val.rating),
                                                    0
                                                ) / 3
                                            }`}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <List>
                                                {ratings.map((value, index) => (
                                                    <ListItem
                                                        key={index}
                                                        secondaryAction={
                                                            <Rating
                                                                name="read-only"
                                                                value={parseInt(
                                                                    value.rating
                                                                )}
                                                                readOnly
                                                            />
                                                        }
                                                    >
                                                        <ListItemText
                                                            secondary={
                                                                <React.Fragment>
                                                                    <Typography
                                                                        sx={{
                                                                            display:
                                                                                "inline",
                                                                        }}
                                                                        component="span"
                                                                        variant="body2"
                                                                        color="text.primary"
                                                                    >
                                                                        {
                                                                            value.question
                                                                        }
                                                                    </Typography>
                                                                </React.Fragment>
                                                            }
                                                        />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </AccordionDetails>
                                    </Accordion>
                                );
                            })}
                    </List>
                </Box>
            </Container>
        </DrawerContainer>
    );
};

const mapStateToProps = (state) => ({
    loading: state.feedback.loading,
    feedbacks: state.feedback.feedbacks,
});

export default connect(mapStateToProps, { clearFeedback, getFeedbacks })(
    FeedbackTable
);
