import { AppBar, Typography } from "@mui/material"

const HeaderBar = () => {
    return (
        <AppBar position="static">
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, padding: 2 }}>
                Next.js Todo App
            </Typography>
        </AppBar>
    )
};

export default HeaderBar;