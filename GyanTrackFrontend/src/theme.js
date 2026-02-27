import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2563eb",
    },
    secondary: {
      main: "#1e293b",
    },
    background: {
      default: "#f4f6f8",
    },
  },
  typography: {
    fontFamily: "Inter, Roboto, sans-serif",
  },
  shape: {
    borderRadius: 10,
  },
});

export default theme;