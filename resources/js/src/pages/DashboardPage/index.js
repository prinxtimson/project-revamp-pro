import React from "react";
import { Routes, Route } from "react-router-dom";
import DrawerContainer from "./DrawerContainer";
import AddUserForm from "./AddUserForm";
import AgentsTable from "./AgentsTable";
import ProfileForm from "./ProfileForm";
import ChangePasswordForm from "./ChangePasswordForm";
import LiveCallTable from "./LiveCallTable";
import CallBackTable from "./CallBackTable";

export default () => (
    <DrawerContainer>
        <Routes>
            <Route path="/" element={<div />} />
            <Route path="add-user" element={<AddUserForm />} />
            <Route path="users" element={<AgentsTable />} />
            <Route path="profile" element={<ProfileForm />} />
            <Route path="livecall" element={<LiveCallTable />} />
            <Route path="callback" element={<CallBackTable />} />
            <Route path="change-password" element={<ChangePasswordForm />} />
        </Routes>
    </DrawerContainer>
);
