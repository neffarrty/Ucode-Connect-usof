import React, { useEffect, useState } from 'react';
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
import { Create } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { Post, Paginated, PostFilters } from '../../interface';
import { AxiosError } from 'axios';
import axios from '../../utils/axios';
import { Layout } from '../../components/layout/Layout';
import { PostsPageHeader } from '../../components/post/PostsPageHeader';
import { PostCard } from '../../components/post-card/PostCard';
import { useSearchParams } from 'react-router-dom';

export const PostsPage: React.FC = () => {
	const [query] = useSearchParams();
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(15);

	const [filters, setFilters] = useState<PostFilters>({
		sort: 'createdAt',
		order: 'desc',
		title: query.get('title') || '',
		categories: [],
		createdAt: {
			gte: null,
			lte: null,
		},
		status: '',
	});

	useEffect(() => {
		const title = query.get('title') || '';
		setFilters((prev) => ({
			...prev,
			title,
		}));
	}, [query]);

	const handlePageChange = (
		_event: React.ChangeEvent<unknown>,
		value: number,
	) => {
		window.scrollTo({ top: 0 });
		setPage(value);
	};

	const handleLimitChange = (value: number) => {
		window.scrollTo({ top: 0 });
		setLimit(value);
		setPage(1);
	};

	const cleanFilters = (filters: PostFilters) => {
		const cleaned: Partial<PostFilters> = {};

		if (filters.sort) cleaned.sort = filters.sort;
		if (filters.status) cleaned.status = filters.status;
		if (filters.order) cleaned.order = filters.order;
		if (filters.title.trim()) cleaned.title = filters.title.trim();
		if (filters.categories.length > 0)
			cleaned.categories = filters.categories;
		if (filters.createdAt.gte || filters.createdAt.lte)
			cleaned.createdAt = { ...filters.createdAt };

		return cleaned;
	};

	const {
		isLoading,
		error,
		data: posts,
	} = useQuery<Paginated<Post>, AxiosError>({
		queryKey: ['posts', page, limit, filters],
		queryFn: async () => {
			const params = cleanFilters(filters);
			const { data } = await axios.get<Paginated<Post>>('/posts', {
				params: {
					...params,
					page,
					limit,
				},
			});

			return data;
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
					count={posts?.meta.total || 0}
					filters={filters}
					setFilters={setFilters}
					setPage={setPage}
					title={
						<Box
							sx={{
								width: '100%',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
							}}
						>
							<Typography variant="h4" color="primary.dark">
								All posts
							</Typography>
							<Button
								variant="outlined"
								startIcon={<Create />}
								href="/posts/new"
							>
								Create post
							</Button>
						</Box>
					}
				/>
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
				{isLoading ? (
					<Box
						sx={{
							display: 'flex',
							flexGrow: 1,
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<CircularProgress size={24} />
					</Box>
				) : posts && posts?.data.length ? (
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
							{posts.data.map((post) => (
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
								count={posts.meta.pages}
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
											key={lim}
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
				) : (
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
							flexGrow: 1,
						}}
					>
						<Typography variant="h6" color="text.secondary">
							No posts found
						</Typography>
					</Box>
				)}
			</Box>
		</Layout>
	);
};
