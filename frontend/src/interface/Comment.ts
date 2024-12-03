import { Entity } from './Entity';
import { LikeType } from './Like';

export interface Comment extends Entity {
	id: number;
	authorId: number;
	author: {
		login: string;
		avatar: string;
		fullname: string;
	};
	like?: LikeType;
	postId: number;
	content: string;
	rating: number;
}
