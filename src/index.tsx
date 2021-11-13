import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { AuthProvider } from "./hooks/useAuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const darkTheme = createTheme({
	palette: {
		mode: "dark",
	},
});

ReactDOM.render(
	<React.StrictMode>
		<AuthProvider>
			<ThemeProvider theme={darkTheme}>
				<CssBaseline />
				<App />
				<ToastContainer />
			</ThemeProvider>
		</AuthProvider>
	</React.StrictMode>,
	document.getElementById("root")
);
