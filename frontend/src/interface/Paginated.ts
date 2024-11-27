export interface PaginationMetadata {
	page: number;
	total: number;
	count: number;
	pages: number;
	next: number | null;
	prev: number | null;
}

export interface Paginated<T> {
	data: T[];
	meta: PaginationMetadata;
}
