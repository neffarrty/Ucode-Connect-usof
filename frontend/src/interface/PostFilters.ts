export interface PostFilters {
	sort: string;
	order: string;
	title: string;
	categories: string[];
	createdAt: {
		gte: Date | null;
		lte: Date | null;
	};
}
