import React from "react";
import { Routes, Route } from "react-router-dom";
import DrawerContainer from "./DrawerContainer";
import AddUserForm from "./AddUserForm";
import AgentsTable from "./AgentsTable";

export default () => {
    return (
        <DrawerContainer>
            <Routes>
                <Route path="/" element={<div />} />
                <Route path="add-user" element={<AddUserForm />} />
                <Route path="users" element={<AgentsTable />} />
            </Routes>
        </DrawerContainer>
    );
};
