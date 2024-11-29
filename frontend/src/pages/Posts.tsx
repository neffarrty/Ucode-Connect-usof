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
import { PostCard } from '../components/post-card/PostCard';
import { AxiosError } from 'axios';
import axios from '../utils/axios';
import { Post } from '../interface/Post';
import Layout from '../components/layout/Layout';
import { Paginated } from '../interface/Paginated';
import React, { useState } from 'react';
import { PostsHeader } from '../components/PostsHeader';

const limits = [15, 30, 50];

export const Posts: React.FC = () => {
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(15);

	const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
		setPage(value);
	};

	const handleLimitChange = (value: number) => {
		setPage(1);
		setLimit(value);
	};

	const { isLoading, error, data } = useQuery<Paginated<Post>, AxiosError>({
		queryKey: ['posts', page, limit],
		queryFn: async () => {
			const response = await axios.get<Paginated<Post>>(
				`/posts?page=${page}&limit=${limit}&sort=createdAt`,
			);
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
				<PostsHeader count={data?.meta.total || 0} />
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
								onChange={handleChange}
								sx={{ color: 'primary.main', alignSelf: 'end' }}
							/>
							<Box>
								<Typography component="div" sx={{ mb: 0.5 }}>
									Posts per page
								</Typography>
								<ButtonGroup variant="outlined">
									{limits.map((lim) => (
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