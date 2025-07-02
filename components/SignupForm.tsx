import { TextField } from "@mui/material";

const SignupForm = () => {
    return (
        <form>
            <TextField
                type="text"
                name="name"
                label="Name"
                defaultValue=""
                placeholder="Enter your name"
                required
            />
            <TextField
                type="email"
                name="email"
                label="Email"
                defaultValue=""
                placeholder="Enter your email"
                required
            />
            <TextField
                type="password"
                name="password"
                label="Password"
                data-testid="password-input"
                defaultValue=""
                placeholder="Enter your password"
                required
            />
        </form>
    )
};

export default SignupForm;