import { createTheme } from "@mui/material";

const theme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#fabd2f",
            contrastText: "#282828",
        },
        secondary: {
            main: "#83a598",
            contrastText: "#282828",
        },
        background: {
            default: "#282828",
            paper: "#32302f",
        },
        text: {
            primary: "#ebdbb2",
            secondary: "#bdae93",
        },
        error: {
            main: "#fb4934",
        },
        warning: {
            main: "#fe8019",
        },
        info: {
            main: "#83a598",
        },
        success: {
            main: "#b8bb26",
        },
    },
    typography: {
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    },
});

export default theme;