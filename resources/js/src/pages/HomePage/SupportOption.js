import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import ListItemButton from "@mui/material/ListItemButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import ListItemText from "@mui/material/ListItemText";

const PROJECT = [
    "Second Project Request",
    "Mentor Request",
    "Developer Request",
    "Referencing",
];

const ADMIN = ["Taster Session", "Course Enquiry", "New Candidate Support"];

const IT = [
    "Software Issues",
    "LMS Queries",
    "Access Issue",
    "Other IT Issues",
];

const SupportOption = ({ data, loading, handleOnClick, handleConnect }) => {
    const [isOthers, setIsOthers] = React.useState(false);

    const onOtherSelected = () => {
        setIsOthers(true);
        handleOnClick("");
    };

    const onClick = (query) => {
        handleOnClick(query);
        setIsOthers(false);
    };

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginBottom: 5,
                }}
            >
                <Typography component="h6" variant="h4" mb={3}>
                    Welcome!
                </Typography>
                <Typography component="p" variant="h5" mb={1}>
                    How may we help you today?
                </Typography>
                <Typography component="p" variant="h5" mb={1}>
                    Kindly select any of the query options below or give us a
                    brief detail of your query.
                </Typography>
            </Box>
            <Box>
                <Grid container justifyContent="center" spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <Card>
                            <CardContent>
                                <Typography component="p" variant="h6">
                                    Project
                                </Typography>
                                <List>
                                    {PROJECT.map((query, ind) => (
                                        <ListItemButton
                                            key={ind}
                                            selected={Boolean(
                                                data.query_type === query
                                            )}
                                            onClick={() => onClick(query)}
                                        >
                                            <ListItemText secondary={query} />
                                        </ListItemButton>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Card>
                            <CardContent>
                                <Typography component="p" variant="h6">
                                    Admin
                                </Typography>
                                <List>
                                    {ADMIN.map((query, ind) => (
                                        <ListItemButton
                                            key={ind}
                                            selected={Boolean(
                                                data.query_type === query
                                            )}
                                            onClick={() => onClick(query)}
                                        >
                                            <ListItemText secondary={query} />
                                        </ListItemButton>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Card>
                            <CardContent>
                                <Typography component="p" variant="h6">
                                    IT
                                </Typography>
                                <List>
                                    {IT.map((query, ind) => (
                                        <ListItemButton
                                            key={ind}
                                            selected={
                                                (!isOthers &&
                                                    data.query_type ===
                                                        query) ||
                                                (isOthers &&
                                                    query === "Other IT Issues")
                                            }
                                            onClick={() =>
                                                query === "Other IT Issues"
                                                    ? onOtherSelected()
                                                    : onClick(query)
                                            }
                                        >
                                            <ListItemText secondary={query} />
                                        </ListItemButton>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
            <Box>
                {isOthers ? (
                    <Box
                        sx={{
                            marginTop: 5,
                            width: "100%",
                        }}
                    >
                        <Typography component="p" variant="h6" mb={2}>
                            Other
                        </Typography>
                        <TextField
                            label="Enter request"
                            fullWidth
                            multiline
                            rows={4}
                            onChange={(e) => handleOnClick(e.target.value)}
                        />
                        <Box
                            sx={{
                                marginTop: 2,
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <Button
                                variant="text"
                                color="primary"
                                onClick={() => setIsOthers(false)}
                                //size="small"
                                //disabled={Boolean(livecall?.left_at)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleConnect}
                                // size="small"
                                disabled={Boolean(!data.query_type)}
                            >
                                Request Livecall
                            </Button>
                        </Box>
                    </Box>
                ) : (
                    <Box
                        sx={{
                            marginTop: 5,
                            display: "flex",
                            alignItems: "flex-end",
                        }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleConnect}
                            // size="small"
                            disabled={Boolean(!data.query_type)}
                        >
                            Request Livecall
                        </Button>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default SupportOption;
