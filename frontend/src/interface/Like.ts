import { Entity } from './Entity';

export enum LikeType {
	LIKE = 'LIKE',
	DISLIKE = 'DISLIKE',
}

export interface Like extends Entity {
	id: number;
	type: LikeType;
	authorId: number;
}
