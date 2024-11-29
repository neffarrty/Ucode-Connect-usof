import { Category } from './Category';
import { Entity } from './Entity';

export interface Post extends Entity {
	id: number;
	authorId: number;
	author: {
		login: string;
		avatar: string;
	};
	categories: { category: Category }[];
	title: string;
	status: 'ACTIVE' | 'INACTIVE';
	content: string;
	rating: number;
	bookmarked: boolean;
}
