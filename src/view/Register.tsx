import { Button, Card, CardContent, CardHeader, Grid, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import useFetch from "use-http";
import { useHistory } from "react-router-dom";

const Register = () => {
	const [userLogin, setUserLogin] = useState("");
	const [userPassword, setUserPassword] = useState("");
	const history = useHistory();
	const { response, post } = useFetch(`http://localhost:5000/user/sign-up`);

	const handleRegister = async () => {
		try {
			await post({ login: userLogin, password: userPassword });
			if (response.ok) {
				history.push("/login");
				toast.success("Registered successfully.");
			}
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
						subheader="register"
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
								Already got account?{" "}
								<Button variant="text" to="/login" component={Link}>
									Login
								</Button>
							</span>
							<Button variant="contained" onClick={async () => await handleRegister()}>
								Register
							</Button>
						</div>
					</CardContent>
				</Card>
			</Grid>
		</Grid>
	);
};

export default Register;
