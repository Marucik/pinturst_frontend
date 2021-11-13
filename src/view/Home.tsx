import Post from "../components/Post";
import useFetch from "use-http";
import { useAuthContext } from "../hooks/useAuthContext";
import { Avatar, Button, Fab, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const Home = () => {
	const { userProfile, logout, accessToken, getUserProfile } = useAuthContext();
	const { data = [] } = useFetch<Post[]>("http://localhost:5000/post", []);
	const [areFavouritesFiltered, setAreFavouritesFiltered] = useState(false);
	const [searchValue, setSearchValue] = useState<string>("");
	const [displayedData, setDisplayedData] = useState<Post[]>([]);

	const fetchData = async () => {
		getUserProfile();
	};

	const filterData = () => {
		if (searchValue) {
			setDisplayedData(data.filter((x: Post) => x.title.toLowerCase() === searchValue.toLowerCase()));
		}
	};

	const clearFilter = () => {
		setSearchValue("");
		setDisplayedData(data);
	};

	const toggleFavourites = () => {
		console.log(areFavouritesFiltered);
		if (userProfile) {
			if (areFavouritesFiltered) {
				setDisplayedData(data);
			} else {
				const favouritePosts: Post[] = [];

				userProfile.favourites.forEach((favouriteId: string) => {
					const foundPost = data.find((x: Post) => x.id === favouriteId);

					if (foundPost) {
						favouritePosts.push(foundPost);
					}
				});

				setDisplayedData(favouritePosts);
			}
			setAreFavouritesFiltered(!areFavouritesFiltered);
		}
	};

	useEffect(() => {
		if (accessToken !== undefined) {
			fetchData();
		}
	}, [accessToken]);

	useEffect(() => {
		setDisplayedData(data);
	}, [data]);

	return (
		<>
			<header
				style={{
					display: "flex",
					justifyContent: "space-between",
					flexFlow: "row",
					alignItems: "center",
					padding: "0 3rem",
				}}
			>
				<h1>Pintrust</h1>
				{accessToken && (
					<Button variant="contained" to="/add-post" component={Link}>
						Add post
					</Button>
				)}
				{accessToken ? (
					<Button variant="outlined" onClick={logout}>
						<Avatar sx={{ width: "24px", height: "24px", fontSize: "14px", marginRight: "6px" }}>
							{userProfile?.login.charAt(0)}
						</Avatar>
						Logout
					</Button>
				) : (
					<Button variant="outlined" to="/login" component={Link}>
						Login
					</Button>
				)}
			</header>
			<div
				style={{ display: "flex", flexFlow: "row wrap", justifyContent: "center", alignItems: "flex-end", gap: "1rem" }}
			>
				<TextField
					id="search"
					label="Search"
					variant="standard"
					value={searchValue}
					onChange={(e) => setSearchValue(e.target.value)}
					sx={{ width: "400px" }}
				/>
				<Button variant="outlined" onClick={() => filterData()}>
					Search
				</Button>
				<Button variant="contained" onClick={() => clearFilter()}>
					Clear
				</Button>
			</div>
			<div style={{ display: "flex", flexFlow: "row wrap", justifyContent: "center" }}>
				{displayedData.map((value: Post) => {
					return <Post key={value.id} postData={value} />;
				})}
				{accessToken && (
					<Fab
						onClick={() => toggleFavourites()}
						color="primary"
						aria-label="filter-favourite"
						sx={{ position: "fixed", right: "2rem", bottom: "2rem" }}
					>
						<FavoriteBorderIcon />
					</Fab>
				)}
			</div>
		</>
	);
};

export default Home;
