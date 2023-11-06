import { useEffect, useRef, useState, useMemo } from "react";
import { Menu } from "primereact/menu";
import { Badge } from "primereact/badge";
import { InputText } from "primereact/inputtext";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Avatar } from "primereact/avatar";

import ApplicationLogo from "./ApplicationLogo";
//import LinkButton from "./LinkButton";
import {
    getNotification,
    markNotification,
    onNewNotification,
} from "../features/notification/notificationSlice";
import { logout, reset } from "../features/auth/authSlice";

const Header = ({ toggleSidebar }) => {
    // const [filteredSearch, setFilteredSearch] = useState([]);
    // const [searchShow, setSearchShow] = useState(false);
    // const [searchText, setSearchText] = useState("");
    const notificationRef = useRef(null);
    const menu = useRef(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const { notifications, count } = useSelector((state) => state.notification);

    // useMemo(() => {
    //     if (user) {
    //         window.Echo.private(`App.Models.User.${user?.id}`).notification(
    //             (notification) => {
    //                 dispatch(onNewNotification(notification));
    //             }
    //         );
    //     }
    // }, [user]);

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate("/admin");
    };

    let items = [
        {
            label: "Profile",
            icon: "pi pi-fw pi-user",
            command: () => navigate("/admin/profile"),
        },
        {
            label: "Change Password",
            icon: "pi pi-fw pi-lock",
            command: () => navigate("/admin/change-password"),
        },
        {
            label: "Dashboard",
            icon: "pi pi-fw pi-th-large",
            command: () => navigate("/admin/dashboard"),
        },
        {
            label: "Logout",
            icon: "pi pi-fw pi-sign-out",
            command: () => onLogout(),
        },
    ];

    return (
        <div className="tw-z-50 tw-sticky tw-top-0 tw-w-full">
            <div className="tw-py-1 tw-px-2 md:tw-px-6">
                <nav className="tw-flex tw-items-center tw-gap-2">
                    <div className="tw-grow tw-flex tw-items-center tw-gap-2">
                        <div className="">
                            <Link
                                to={`${user ? "/admin/dashboard" : "/admin"}`}
                            >
                                <ApplicationLogo />
                            </Link>
                        </div>
                        {isAuthenticated && user && (
                            <div className="tw-block lg:tw-hidden">
                                <button
                                    type="button"
                                    className="tw-bg-transparent"
                                    onClick={toggleSidebar}
                                >
                                    <i className="pi pi-bars tw-text-white tw-text-2xl sm:tw-text-3xl"></i>
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="tw-grow"></div>
                    {/* {isAuthenticated && user && (
                        <div className="tw-grow tw-flex tw-items-center tw-justify-center tw-flex-col tw-relative">
                            <span className="p-input-icon-left tw-w-full">
                                <i className="pi pi-search" />
                                <InputText
                                    value={searchText}
                                    onChange={(e) =>
                                        setSearchText(e.target.value)
                                    }
                                    placeholder="Search"
                                    className="tw-w-full"
                                />
                            </span>
                            <div
                                className={`tw-w-full tw-min-h-fit tw-bg-white tw-absolute tw-top-12 tw-border tw-rounded-lg tw-overflow-hidden ${
                                    searchShow ? "" : "tw-hidden"
                                }`}
                            >
                                {filteredSearch.length > 0 ? (
                                    filteredSearch.map((value) => (
                                        <Link
                                            className=""
                                            key={value.id}
                                            to={value.link}
                                        >
                                            <div className="tw-py-3 tw-px-4 tw-border-b hover:tw-bg-gray-100 ">
                                                <h4 className="tw-text-xl tw-my-0">
                                                    {value.name}
                                                </h4>
                                                <p className="tw-my-0">
                                                    {value.content}
                                                </p>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="tw-py-3 tw-px-4 tw-border-b ">
                                        <p className="tw-my-2">
                                            No search result
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )} */}
                    {isAuthenticated && user && (
                        <div className="tw-grow tw-flex tw-justify-between tw-items-center tw-gap-2">
                            <div className="tw-ml-0 sm:tw-ml-2 md:tw-ml-4">
                                <i
                                    className="pi pi-bell p-overlay-badge tw-text-white tw-text-xl sm:tw-text-3xl tw-cursor-pointer "
                                    onClick={(e) =>
                                        notificationRef.current?.toggle(e)
                                    }
                                >
                                    {count > 0 ? (
                                        <Badge
                                            value={count > 9 ? "9+" : count}
                                            severity="danger"
                                        ></Badge>
                                    ) : null}
                                </i>
                                <Menu
                                    model={
                                        notifications &&
                                        notifications.length > 0
                                            ? notifications
                                                  .slice(0, 9)
                                                  .map((val) =>
                                                      val.type ==
                                                      "App\\Notifications\\BookingCancel"
                                                          ? {
                                                                label: "Booking had been cancelled",
                                                            }
                                                          : val.type ==
                                                            "App\\Notifications\\BookingComplete"
                                                          ? {
                                                                label: "Booking had been completed",
                                                            }
                                                          : val.type ==
                                                            "App\\Notifications\\BookingRescheduled"
                                                          ? {
                                                                label: "Booking had been rescheduled",
                                                            }
                                                          : val.type ==
                                                            "App\\Notifications\\CheckIn"
                                                          ? {
                                                                label: "A candidate had joined the meeting",
                                                            }
                                                          : val.type ==
                                                            "App\\Notifications\\CheckOut"
                                                          ? {
                                                                label: "A candidate had left the meeting",
                                                            }
                                                          : {}
                                                  )
                                            : [
                                                  {
                                                      label: "No Notification found",
                                                      items: [],
                                                  },
                                              ]
                                    }
                                    popup
                                    ref={notificationRef}
                                    onShow={() => dispatch(markNotification())}
                                    style={{ width: 340 }}
                                />
                            </div>
                            <div className="tw-flex tw-gap-2 tw-items-center">
                                <h5 className="tw-hidden sm:tw-block tw-font-semibold tw-text-white">
                                    {user?.name}
                                </h5>
                                <Avatar
                                    image={`${
                                        user?.avatar
                                    }?${new Date().getTime()}`}
                                    shape="circle"
                                    className="sm:tw-w-12 sm:tw-h-12 sm:tw-text-base"
                                    imageAlt={user?.name}
                                    onClick={(event) =>
                                        menu.current.toggle(event)
                                    }
                                />

                                <Menu model={items} popup ref={menu} />
                            </div>
                        </div>
                    )}
                </nav>
            </div>
        </div>
    );
};

export default Header;
