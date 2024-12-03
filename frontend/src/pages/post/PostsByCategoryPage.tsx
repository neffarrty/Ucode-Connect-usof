import React, { useState } from 'react';
import {
	Alert,
	Box,
	Button,
	ButtonGroup,
	CircularProgress,
	Divider,
	Pagination,
	Stack,
	Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Post, Paginated, Category } from '../../interface';
import { AxiosError } from 'axios';
import axios from '../../utils/axios';
import { Layout } from '../../components/layout/Layout';
import { PostCard } from '../../components/post-card/PostCard';
import { useParams } from 'react-router-dom';

interface QueryResponse {
	posts: Paginated<Post>;
	category: Category;
}

export const PostsByCategoryPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();

	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(15);

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

	const { isLoading, error, data } = useQuery<QueryResponse, AxiosError>({
		queryKey: ['posts_by_category', page, limit, id],
		queryFn: async () => {
			const posts = await axios.get<Paginated<Post>>(
				`/categories/${id}/posts`,
				{
					params: { page, limit },
				},
			);
			const category = await axios.get<Category>(`/categories/${id}`);

			return {
				posts: posts.data,
				category: category.data,
			};
		},
	});

	if (isLoading) {
		return (
			<Layout>
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
			</Layout>
		);
	}

	if (error) {
		return (
			<Layout>
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
			</Layout>
		);
	}

	return (
		<Layout>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					flex: 1,
				}}
			>
				<Stack
					direction="column"
					sx={{
						width: '100%',
						px: 3,
						gap: 1,
					}}
				>
					<Typography variant="h4" color="primary.dark">
						Posts tagged with {`[${data?.category.title}]`}
					</Typography>
					<Typography variant="body2" color="text.secondary">
						{data?.category.description}"
					</Typography>
					<Divider />
					<Typography variant="subtitle1" color="primary.light">
						{`${new Intl.NumberFormat('en-US').format(data?.category.posts || 0)} posts`}
					</Typography>
				</Stack>
				{data?.posts && (
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
						<Box
							component="section"
							sx={{
								display: 'flex',
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
