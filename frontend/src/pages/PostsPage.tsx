import React, { useState } from 'react';
import {
	Alert,
	Box,
	Button,
	ButtonGroup,
	CircularProgress,
	Pagination,
	Stack,
	Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Post, Paginated } from '../interface';
import { AxiosError } from 'axios';
import axios from '../utils/axios';
import { Layout } from '../components/layout/Layout';
import { PostsPageHeader } from '../components/PostsPageHeader';
import { PostCard } from '../components/post-card/PostCard';

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

export const PostsPage: React.FC = () => {
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(15);

	const [filters, setFilters] = useState<PostFilters>({
		sort: 'createdAt',
		order: 'desc',
		title: '',
		categories: [],
		createdAt: {
			gte: null,
			lte: null,
		},
	});

	const handlePageChange = (
		_event: React.ChangeEvent<unknown>,
		value: number,
	) => {
		setPage(value);
	};

	const handleLimitChange = (value: number) => {
		setLimit(value);
		setPage(1);
	};

	const cleanFilters = (filters: PostFilters) => {
		const cleaned: Partial<PostFilters> = {};

		if (filters.sort) cleaned.sort = filters.sort;
		if (filters.order) cleaned.order = filters.order;
		if (filters.title.trim()) cleaned.title = filters.title;
		if (filters.categories.length > 0)
			cleaned.categories = filters.categories;
		if (filters.createdAt.gte || filters.createdAt.lte)
			cleaned.createdAt = { ...filters.createdAt };

		return cleaned;
	};

	const { isLoading, error, data } = useQuery<Paginated<Post>, AxiosError>({
		queryKey: ['posts', page, limit, filters],
		queryFn: async () => {
			const params = cleanFilters(filters);

			console.log(params);

			const response = await axios.get<Paginated<Post>>('/posts', {
				params,
			});
			return response.data;
		},
	});

	return (
		<Layout>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					flex: 1,
				}}
			>
				<PostsPageHeader
					count={data?.meta.total || 0}
					filters={filters}
					setFilters={setFilters}
					setPage={setPage}
				/>
				{isLoading && (
					<Box
						sx={{
							flexGrow: 1,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<CircularProgress size={24} />
					</Box>
				)}
				{error && (
					<Box
						sx={{
							flexGrow: 1,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							color: 'error.main',
						}}
					>
						<Alert severity="error">
							Error loading posts: {error.message}
						</Alert>
					</Box>
				)}
				{data && (
					<React.Fragment>
						<Stack
							component="main"
							direction="column"
							gap={2}
							sx={{
								flexGrow: 1,
								p: 3,
							}}
						>
							{data.data.map((post) => (
								<Box key={post.id} sx={{ flexGrow: 1 }}>
									<PostCard post={post} />
								</Box>
							))}
						</Stack>
						<Box
							component="section"
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
								p: 3,
							}}
						>
							<Pagination
								count={data.meta.pages}
								page={page}
								variant="outlined"
								shape="rounded"
								color="primary"
								showFirstButton
								showLastButton
								onChange={handlePageChange}
								sx={{ color: 'primary.main', alignSelf: 'end' }}
							/>
							<Box>
								<Typography component="div" sx={{ mb: 0.5 }}>
									Posts per page
								</Typography>
								<ButtonGroup variant="outlined">
									{[15, 30, 50].map((lim) => (
										<Button
											onClick={() =>
												handleLimitChange(lim)
											}
											disabled={limit === lim}
										>
											{lim}
										</Button>
									))}
								</ButtonGroup>
							</Box>
						</Box>
					</React.Fragment>
				)}
			</Box>
		</Layout>
	);
};
