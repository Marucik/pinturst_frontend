declare interface Post {
	id: string;
	title: string;
	description: string;
	likes: number;
	dislikes: number;
	imageUrl: string;
	author: UserDto;
	createdAt: string;
	updatedAt: string;
}

declare interface Reaction {
	postId: string;
	userReaction: string;
}

declare interface AuthenticateResponse {
	login: string;
	favourites: string[];
	reactions: Reaction[];
}
