import React from "react";
import { Routes, Route } from "react-router-dom";
import DrawerContainer from "./DrawerContainer";
import AddUserForm from "./AddUserForm";
import AgentsTable from "./AgentsTable";
import ProfileForm from "./ProfileForm";
import ChangePasswordForm from "./ChangePasswordForm";

export default () => {
    return (
        <DrawerContainer>
            <Routes>
                <Route path="/" element={<div />} />
                <Route path="add-user" element={<AddUserForm />} />
                <Route path="users" element={<AgentsTable />} />
                <Route path="profile" element={<ProfileForm />} />
                <Route
                    path="change-password"
                    element={<ChangePasswordForm />}
                />
            </Routes>
        </DrawerContainer>
    );
};
