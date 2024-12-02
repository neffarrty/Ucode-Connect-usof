import React from 'react';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Post, Paginated } from '../interface';
import { AxiosError } from 'axios';
import axios from '../utils/axios';
import { Layout } from '../components/layout/Layout';
import { PostCard } from '../components/post-card/PostCard';
import { PopularCategoriesList } from '../components/category/PopularCategoriesList';

export const HomePage: React.FC = () => {
	const { isLoading, error, data } = useQuery<Paginated<Post>, AxiosError>({
		queryKey: ['posts'],
		queryFn: async () => {
			const now = new Date();
			const weakAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
			const response = await axios.get<Paginated<Post>>(
				`/posts?createdAt[gte]=${weakAgo.toISOString()}`,
			);
			return response.data;
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

	return (
		<Layout>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					flex: 1,
				}}
			>
				<Box sx={{ px: 3, py: 1.5 }}>
					<Typography variant="h3" color="primary.dark">
						Dive into the World of Development!
					</Typography>
					<Typography variant="subtitle1" color="text.secondary">
						Discover trending topics, insightful discussions, and
						the most popular posts shared by developers. Join the
						conversation and stay inspired!
					</Typography>
				</Box>
				<Box
					sx={{
						display: 'flex',
						flex: 1,
					}}
				>
					<Stack
						component="main"
						direction="row"
						sx={{
							flexGrow: 1,
							p: 3,
						}}
					>
						{error && (
							<div>Error loading posts: {error.message}</div>
						)}
						{data && (
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'column',
									gap: 2,
								}}
							>
								{data.data.map((post) => (
									<Box key={post.id} sx={{ flexGrow: 1 }}>
										<PostCard post={post} />
									</Box>
								))}
							</Box>
						)}
					</Stack>
					<Box
						component="section"
						sx={{
							minWidth: 300,
							p: 3,
							pl: 0,
						}}
					>
						<PopularCategoriesList size={10} />
					</Box>
				</Box>
			</Box>
		</Layout>
	);
};
