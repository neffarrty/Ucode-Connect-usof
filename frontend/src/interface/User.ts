import { Entity } from './Entity';

export interface User extends Entity {
	id: number;
	login: string;
	email: string;
	fullname: string;
	avatar: string;
	rating: number;
	role: 'USER' | 'ADMIN';
	verified: boolean;
}
