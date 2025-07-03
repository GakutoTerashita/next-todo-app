"use client";
import { signup } from "@/app/actions/auth/auth";
import { Button, TextField } from "@mui/material";
import { useActionState } from "react";

const SignupForm = () => {
    const [state, action, pending] = useActionState(signup, undefined);

    return (
        <form
            action={action}
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
            }}
        >
            <TextField
                type="text"
                name="name"
                label="Name"
                defaultValue=""
                placeholder="Enter your name"
                required
            />
            {state?.errors?.name && <p>{state.errors.name}</p>}
            <TextField
                type="email"
                name="email"
                label="Email"
                defaultValue=""
                placeholder="enter-your-email@example.com"
                required
            />
            {state?.errors?.email && <p>{state.errors.email}</p>}
            <TextField
                type="password"
                name="password"
                label="Password"
                defaultValue=""
                placeholder="Enter your password"
                required
            />
            {state?.errors?.password && (
                <div>
                    <p>Password must:</p>
                    <ul>
                        {state.errors.password.map((error) => (
                            <li key={error}>- {error}</li>
                        ))}
                    </ul>
                </div>
            )}
            {state?.errors?.general && (<p>{state.errors.general}</p>)}
            <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={pending}
                loading={pending}
            >
                Sign Up
            </Button>
        </form>
    )
};

export default SignupForm;