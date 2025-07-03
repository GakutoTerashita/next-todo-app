import { login } from "@/app/actions/auth/auth";
import { Button, TextField } from "@mui/material";
import { useActionState } from "react";

const LoginForm = () => {
    const [state, action, pending] = useActionState(login, undefined);
    return (
        <form action={action}>
            <div>
                <TextField
                    type="email"
                    name="email"
                    label="Email"
                    defaultValue=""
                    placeholder="enter-your-email@example.com"
                    required
                />
                {state?.errors?.email && <p>{state.errors.email}</p>}
            </div>
            <div>
                <TextField
                    type="password"
                    name="password"
                    label="Password"
                    defaultValue=""
                    placeholder="Enter your password"
                    required
                />
                {state?.errors?.password && <p>{state.errors.password}</p>}
            </div>
            <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={pending}
                loading={pending}
            >
                Log In
            </Button>
        </form>
    );
};

export default LoginForm;