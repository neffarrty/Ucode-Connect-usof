import { Entity } from './Entity';

export interface Category extends Entity {
	id: number;
	title: string;
	description: string;
	posts: number;
}
