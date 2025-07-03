import LoginForm from "@/components/LoginForm";
import LogoutButton from "@/components/LogoutButton";
import SignupForm from "@/components/SignupForm"
import { Container, Divider } from "@mui/material";

const AccountsPage = () => {
    return (
        <Container maxWidth="lg">
            <SignupForm />
            <Divider sx={{ marginY: 2 }} />
            <LoginForm />
            <Divider sx={{ marginY: 2 }} />
            <LogoutButton />
        </Container>
    );
}

export default AccountsPage;