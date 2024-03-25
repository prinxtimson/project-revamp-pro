import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

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
            <div
                className="tw-grow tw-flex"
                style={{ backgroundColor: "#f5f7ff" }}
            >
                <div className="tw-hidden tw-w-1/2 md:tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-5">
                    <a href="/">
                        <img
                            className="tw-w-40 md:tw-w-52"
                            src="/images/logo.png"
                            alt="Tritek Consulting"
                        />
                    </a>

                    <div>
                        <h1 className="tw-text-center tw-mt-0 tw-mb-3 tw-text-6xl">
                            Tritek
                        </h1>
                        <h1 className="tw-text-center tw-my-0 tw-text-5xl">
                            Analytics Dashboard
                        </h1>
                    </div>
                </div>

                <div className="tw-w-full md:tw-w-1/2 tw-p-4 tw-flex tw-flex-col tw-bg-white">
                    <div className="tw-grow tw-flex tw-flex-col tw-items-center tw-justify-center">
                        <div className="tw-flex tw-w-full md:tw-hidden tw-flex-col tw-items-center tw-justify-center tw-gap-5">
                            <a href="/">
                                <img
                                    className="tw-w-40 md:tw-w-52"
                                    src="/images/logo.png"
                                    alt="Tritek Consulting"
                                />
                            </a>

                            <div>
                                <h1 className="tw-text-center tw-mt-0 tw-mb-3 tw-text-4xl">
                                    Tritek
                                </h1>
                                <h1 className="tw-text-center tw-my-0 tw-text-3xl">
                                    Analytics Dashboard
                                </h1>
                            </div>
                        </div>
                        {children}
                    </div>
                    <Copyright sx={{ mt: 3, mb: 3 }} />
                </div>
            </div>
        </div>
    );
};

export default MainContainer;
