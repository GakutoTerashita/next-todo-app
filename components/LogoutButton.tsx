"use client";
import React, { useActionState } from "react";
import { logout } from "@/app/actions/auth/auth";
import { Button } from "@mui/material";

const LogoutButton = () => {
    const [, action, pending] = useActionState(logout, undefined);
    return (
        <form action={action}>
            <Button
                type="submit"
                variant="contained"
                color="error"
                disabled={pending}
                loading={pending}
            >
                Logout
            </Button>
        </form>
    )
}

export default LogoutButton;