import { Button, Card, CardContent, CardHeader, Grid, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

const Login = () => {
	const [userLogin, setUserLogin] = useState("");
	const [userPassword, setUserPassword] = useState("");
	const { login } = useAuthContext();
	const history = useHistory();

	const handleLogin = async () => {
		try {
			await login(userLogin, userPassword);
			history.push("/");
		} catch (error: any) {
			toast.error(error);
		}
	};

	return (
		<Grid container justifyContent="center" alignContent="center" spacing={0} sx={{ height: "100vh" }}>
			<Grid item xs={6}>
				<Card>
					<CardHeader
						title="Pintrust"
						subheader="login"
						titleTypographyProps={{ variant: "h2" }}
						component={Link}
						to="/"
					/>
					<CardContent>
						<div
							style={{
								display: "flex",
								flexFlow: "column",
								padding: "0 4rem",
								height: "250px",
								justifyContent: "space-around",
							}}
						>
							<TextField
								id="login"
								label="Login"
								variant="standard"
								required
								value={userLogin}
								onChange={(e) => setUserLogin(e.target.value)}
							/>
							<TextField
								id="password"
								label="Password"
								type="password"
								variant="standard"
								required
								value={userPassword}
								onChange={(e) => setUserPassword(e.target.value)}
							/>
							<span>
								New user?{" "}
								<Button variant="text" to="/register" component={Link}>
									Register
								</Button>
							</span>
							<Button variant="contained" onClick={async () => await handleLogin()}>
								Login
							</Button>
						</div>
					</CardContent>
				</Card>
			</Grid>
		</Grid>
	);
};

export default Login;
