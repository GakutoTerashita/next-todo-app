"use client";
import { signup } from "@/app/actions/auth/auth";
import { Button, TextField } from "@mui/material";
import { useActionState } from "react";

const SignupForm = () => {
    const [state, action, pending] = useActionState(signup, undefined);

    return (
        <form action={action}>
            <div>
                <TextField
                    type="text"
                    name="name"
                    label="Name"
                    defaultValue=""
                    placeholder="Enter your name"
                    required
                />
                {state?.errors?.name && <p>{state.errors.name}</p>}
            </div>
            <div>
                <TextField
                    type="email"
                    name="email"
                    label="Email"
                    defaultValue=""
                    placeholder="Enter your email"
                    required
                />
                {state?.errors?.email && <p>{state.errors.email}</p>}
            </div>
            <div>
                <TextField
                    type="password"
                    name="password"
                    label="Password"
                    data-testid="password-input"
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
            </div>
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