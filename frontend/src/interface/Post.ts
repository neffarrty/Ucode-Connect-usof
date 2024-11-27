export interface Post {
	id: number;
	authorId: number;
	author: {
		login: string;
		avatar: string;
	};
	title: string;
	status: 'ACTIVE' | 'INACTIVE';
	content: string;
	rating: number;
	bookmarked: boolean;
	createdAt: string;
	updatedAt: string;
}
