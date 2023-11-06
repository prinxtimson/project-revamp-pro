import { useState, useEffect } from "react";
import { Menu } from "primereact/menu";
import { Sidebar } from "primereact/sidebar";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MdFeedback } from "react-icons/md";
import Header from "./Header";
import ApplicationLogo from "./ApplicationLogo";

const DashboardContainer = ({ children }) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [visible, setVisible] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        window.addEventListener("resize", updateWindowWidth);
        return () => window.removeEventListener("resize", updateWindowWidth);
    }, []);

    useEffect(() => {
        if (windowWidth >= 1024) {
            setVisible(false);
        }
    }, [windowWidth]);

    const updateWindowWidth = () => {
        setWindowWidth(window.innerWidth);
    };

    let items = [
        {
            label: "Dashboard",
            icon: "pi pi-fw pi-th-large",
            command: () => navigate("/admin/dashboard"),
        },
        {
            label: "Management",
            icon: "pi pi-fw pi-user",
            command: () => navigate("/admin/dashboard/management"),
        },
        {
            label: "Accounts",
            icon: "pi pi-fw pi-user",
            command: () => navigate("/admin/dashboard/account"),
        },
        {
            label: "Agent",
            icon: "pi pi-fw pi-bell",
            command: () => navigate("/admin/dashboard/agent"),
        },
        {
            label: "Livecall",
            icon: "pi pi-fw pi-chart-bar",
            command: () => navigate("/admin/dashboard/livecall"),
            template: (item, options) => (
                <a
                    href="#"
                    className="p-menuitem-link"
                    role="menuitem"
                    tabIndex="0"
                    data-pc-section="action"
                    onClick={(e) => options.onClick(e)}
                >
                    <span className={`${item.icon} tw-mr-2`}></span>
                    <span>{item.label}</span>
                </a>
            ),
        },
        {
            label: "Call Back",
            icon: "pi pi-fw pi-sign-out",
            command: () => navigate("/admin/dashboard/callback"),
        },
        {
            label: "Ticket Raised",
            icon: "pi pi-fw pi-sign-out",
            command: () => navigate("/admin/dashboard/ticket"),
        },
        {
            label: "Feedback",
            icon: <MdFeedback />,
            command: () => navigate("/admin/dashboard/feedback"),
        },
        {
            label: "E-Learning",
            icon: "pi pi-fw pi-sign-out",
            command: () => navigate("https://www.sans.org/uk_en/"),
        },
    ];

    const toggleSidebar = () => {
        setVisible(!visible);
    };

    return (
        <div className="tw-flex tw-flex-col tw-grow">
            <Header toggleSidebar={toggleSidebar} />
            <Sidebar
                visible={visible}
                onHide={() => setVisible(false)}
                className="lg:tw-hidden tw-bg-stone-950"
                header={<ApplicationLogo />}
            >
                <nav className=" tw-p-2">
                    <Menu model={items} className="tw-w-full tw-bg-stone-950" />
                </nav>
            </Sidebar>
            <div className="tw-grow tw-bg-white">
                <div className="tw-hidden lg:tw-flex tw-flex-col lg:tw-w-[18rem] tw-fixed tw-top-0 tw-bottom-0 tw-z-30">
                    <div className="tw-h-20"></div>
                    <nav className="tw-grow tw-p-4">
                        <Menu
                            model={items}
                            className="tw-w-full tw-bg-stone-950"
                        />
                    </nav>
                </div>
                <div className="tw-grow tw-flex tw-flex-col tw-pl-72">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default DashboardContainer;
