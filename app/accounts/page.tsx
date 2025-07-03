import LoginForm from "@/components/LoginForm";
import SignupForm from "@/components/SignupForm"
import React from "react";

const AccountsPage = () => {
    return (
        <React.Fragment>
            <SignupForm />
            <LoginForm />
        </React.Fragment>
    );
}

export default AccountsPage;