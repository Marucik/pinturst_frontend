import { Button, Card, CardContent, CardHeader, Grid, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import useFetch from "use-http";

const NewPost = () => {
	const [postTitle, setPostTitle] = useState<string | undefined>(undefined);
	const [postDescription, setPostDescription] = useState<string | undefined>(undefined);
	const [imageFile, setImageFile] = useState<FileList | undefined>(undefined);
	const { accessToken } = useAuthContext();
	const { response, post } = useFetch(`http://localhost:5000/post`, {
		headers: { Authorization: `Bearer ${accessToken}` },
		redirect: "follow",
	});

	const handleNewPost = async () => {
		if (postTitle && postDescription && imageFile) {
			var formdata = new FormData();
			formdata.append("Title", postTitle);
			formdata.append("Description", postDescription);
			formdata.append("image", imageFile[0]);

			await post(formdata);
			if (response.ok) {
				toast.success("Post added successfully.");
			}
		}
	};

	return (
		<Grid container justifyContent="center" alignContent="center" spacing={0} sx={{ height: "100vh" }}>
			<Grid item xs={6}>
				<Card>
					<CardHeader
						title="Pintrust"
						subheader="Add new post"
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
								id="title"
								label="Title"
								variant="standard"
								required
								value={postTitle}
								onChange={(e) => setPostTitle(e.target.value)}
							/>
							<TextField
								id="description"
								label="Description"
								variant="standard"
								required
								value={postDescription}
								onChange={(e) => setPostDescription(e.target.value)}
							/>
							<input
								type="file"
								onChange={(e) => {
									if (e.target.files !== null) {
										setImageFile(e.target.files);
									}
								}}
							></input>
							<Button variant="contained" onClick={async () => await handleNewPost()}>
								Add post
							</Button>
						</div>
					</CardContent>
				</Card>
			</Grid>
		</Grid>
	);
};

export default NewPost;
