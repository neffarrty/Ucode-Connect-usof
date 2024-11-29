import { Entity } from './Entity';

export interface Comment extends Entity {
	id: number;
	authorId: number;
	postId: number;
	content: string;
	rating: number;
}
