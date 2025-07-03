import LoginForm from "@/components/authentications/LoginForm";
import LogoutButton from "@/components/authentications/LogoutButton";
import SignupForm from "@/components/authentications/SignupForm"
import { Container, Divider } from "@mui/material";

const AccountsPage = () => {
    return (
        <Container maxWidth="lg">
            <SignupForm />
            <Divider sx={{ marginY: 2 }} />
            <LoginForm />
            <Divider sx={{ marginY: 2 }} />
            <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
                <LogoutButton />
            </div>
        </Container>
    );
}

export default AccountsPage;