import {
	Card,
	CardActions,
	CardContent,
	CardHeader,
	CardMedia,
	IconButton,
	LinearProgress,
	Tooltip,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import useFetch from "use-http";
import { useAuthContext } from "../hooks/useAuthContext";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const Post = ({ postData }: { postData: Post }) => {
	const [reaction, setReaction] = useState<string | undefined>(undefined);
	const [isFavourite, setIsFavourite] = useState(false);
	const { userProfile, accessToken } = useAuthContext();
	const { response: reactionResponse, post: react } = useFetch(`http://localhost:5000/post/${postData.id}/react`, {
		headers: { Authorization: `Bearer ${accessToken}` },
	});
	const { response: favouriteResponse, post: favourite } = useFetch(
		`http://localhost:5000/post/${postData.id}/favourite`,
		{
			headers: { Authorization: `Bearer ${accessToken}` },
		}
	);

	const reactionsCount = (
		<div>
			<p>Likes: {postData.likes}</p>
			<p>Dislikes: {postData.dislikes}</p>
		</div>
	);

	const localReact = async (reactionType: string) => {
		await react({ reactionType });
		if (reactionResponse.ok) {
			setReaction(reactionType);
		} else {
			toast.error("Already reacted");
		}
	};

	const localFavourite = async () => {
		await favourite();
		if (favouriteResponse.ok) {
			setIsFavourite(!isFavourite);
		}
	};

	useEffect(() => {
		if (userProfile) {
			const reaction = userProfile.reactions.find((x: Reaction) => x.postId === postData.id);
			setReaction(reaction?.userReaction);

			const favourite = userProfile.favourites.find((favouriteId: string) => favouriteId === postData.id);
			if (favourite) setIsFavourite(true);
		}
	}, [userProfile]);

	return (
		<Card sx={{ width: 300, margin: "1rem" }}>
			<CardHeader
				subheader={`Added at: ${new Date(postData.createdAt).toDateString()}`}
				title={postData.title}
				titleTypographyProps={{ sx: { fontSize: "1rem" } }}
			/>
			<CardMedia
				component="img"
				height="250"
				image={`http://localhost:5000${postData.imageUrl}`}
				alt={postData.title}
			/>
			<CardContent>{postData.description}</CardContent>
			<CardContent>
				<Tooltip title={reactionsCount}>
					<LinearProgress variant="determinate" value={(postData.likes / (postData.likes + postData.dislikes)) * 100} />
				</Tooltip>
			</CardContent>
			{accessToken && (
				<CardActions disableSpacing>
					<IconButton
						sx={{ color: `${isFavourite ? "white" : "gray"}` }}
						aria-label="add to favorites"
						onClick={async () => await localFavourite()}
					>
						{isFavourite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
					</IconButton>
					<IconButton
						sx={{ color: `${reaction === "like" ? "white" : "gray"}` }}
						aria-label="like"
						onClick={async () => await localReact("like")}
					>
						<ThumbUpIcon />
					</IconButton>
					<IconButton
						sx={{ color: `${reaction === "dislike" ? "white" : "gray"}` }}
						aria-label="dislike"
						onClick={async () => await localReact("dislike")}
					>
						<ThumbDownIcon />
					</IconButton>
				</CardActions>
			)}
		</Card>
	);
};

export default Post;
