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
import { useParams } from 'react-router-dom';
import { Post, Paginated, PostFilters, User } from '../interface';
import { AxiosError } from 'axios';
import axios from '../utils/axios';
import { Layout } from '../components/layout/Layout';
import { PostsPageHeader } from '../components/post/PostsPageHeader';
import { PostCard } from '../components/post-card/PostCard';

interface QueryResponse {
	posts: Paginated<Post>;
	user: User;
}

export const UserPostsPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();

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
		status: '',
	});

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
		if (filters.order) cleaned.order = filters.order;
		if (filters.title.trim()) cleaned.title = filters.title;
		if (filters.categories.length > 0)
			cleaned.categories = filters.categories;
		if (filters.createdAt.gte || filters.createdAt.lte)
			cleaned.createdAt = { ...filters.createdAt };

		return cleaned;
	};

	const { isLoading, error, data } = useQuery<QueryResponse, AxiosError>({
		queryKey: ['user_with_posts', id, page, limit, filters],
		queryFn: async () => {
			const params = cleanFilters(filters);

			const posts = await axios.get<Paginated<Post>>(
				`/users/${id}/posts`,
				{
					params: {
						...params,
						page,
						limit,
					},
				},
			);
			const user = await axios.get<User>(`/users/${id}`);

			return {
				posts: posts.data,
				user: user.data,
			};
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
					count={data?.posts?.meta.total || 0}
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
								{`Posts by [${data?.user.login}]`}
							</Typography>
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
							Error loading bookmarks: {error.message}
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
				) : data?.posts && data.posts?.data.length ? (
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
							{data.posts.data.map((post) => (
								<Box key={post.id} sx={{ flexGrow: 1 }}>
									<PostCard post={post} />
								</Box>
							))}
						</Stack>
						<Stack
							component="section"
							direction="row"
							sx={{
								justifyContent: 'space-between',
								p: 3,
							}}
						>
							<Pagination
								count={data.posts.meta.pages}
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
						</Stack>
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
