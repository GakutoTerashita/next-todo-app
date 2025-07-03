import LoginForm from "@/components/LoginForm";
import SignupForm from "@/components/SignupForm"
import { Container, Divider } from "@mui/material";
import React from "react";

const AccountsPage = () => {
    return (
        <Container maxWidth="lg">
            <SignupForm />
            <Divider sx={{ marginY: 2 }} />
            <LoginForm />
        </Container>
    );
}

export default AccountsPage;