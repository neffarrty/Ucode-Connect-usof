import { Category } from './Category';
import { Entity } from './Entity';
import { LikeType } from './Like';

export enum Status {
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
}

export interface Post extends Entity {
	id: number;
	authorId: number;
	author: {
		login: string;
		avatar: string;
		fullname: string;
	};
	title: string;
	content: string;
	categories: { category: Category }[];
	like?: LikeType;
	status: Status;
	rating: number;
	bookmarked: boolean;
}
