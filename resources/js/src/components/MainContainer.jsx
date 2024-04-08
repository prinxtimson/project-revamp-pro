import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";

function Copyright(props) {
    return (
        <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            {...props}
        >
            {"Copyright © "}
            <Link color="inherit" href="https://tritekconsulting.co.uk">
                Tritek Consulting Ltd
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}

const MainContainer = ({ children }) => {
    return (
        <div
            className="tw-w-full tw-flex-1 tw-flex tw-flex-col"
            style={{ backgroundColor: "#f5f7ff" }}
        >
            <Box
                sx={{
                    margin: 2,
                }}
            >
                <Avatar
                    variant="square"
                    component="a"
                    alt="Tritek Live"
                    src="/images/logo.png"
                    href="/"
                    sx={{ width: 168 }}
                >
                    Tritek Consulting
                </Avatar>
            </Box>
            <div
                className="tw-grow tw-flex tw-flex-col tw-justify-center tw-items-center"
                style={{ backgroundColor: "#f5f7ff" }}
            >
                {children}
            </div>

            <Copyright sx={{ mt: 2, mb: 2 }} />
        </div>
    );
};

export default MainContainer;
