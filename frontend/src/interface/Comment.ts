import { Entity } from './Entity';

export interface Comment extends Entity {
	id: number;
	authorId: number;
	author: {
		login: string;
		avatar: string;
	};
	postId: number;
	content: string;
	rating: number;
}
