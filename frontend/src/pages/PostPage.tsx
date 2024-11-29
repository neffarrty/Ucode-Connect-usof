import React from 'react';
import { Alert, Box, Divider, Paper, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { Post } from '../interface/Post';
import { AxiosError } from 'axios';
import axios from '../utils/axios';
import { PostComments } from '../components/post/PostComments';
import { PostActions } from '../components/post/PostActions';
import { PostHeader } from '../components/post/PostHeader';
import { Layout } from '../components/layout/Layout';

export const PostPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();

	const { data: post, error } = useQuery<Post, AxiosError>({
		queryKey: ['post', id],
		queryFn: async () => {
			const { data } = await axios.get<Post>(`/posts/${id}`);
			return data;
		},
	});

	if (error) {
		return (
			<Alert severity="error">Error loading post: {error.message}</Alert>
		);
	}

	return (
		<Layout>
			{!post ? (
				<Box sx={{ textAlign: 'center', padding: 2 }}>
					<Typography variant="h6" color="error">
						Post not found.
					</Typography>
				</Box>
			) : (
				<Stack
					gap={2}
					sx={{ maxWidth: 900, margin: '0 auto', padding: 2 }}
				>
					<Paper>
						<PostHeader post={post} />
					</Paper>
					<Paper sx={{ p: 2 }}>
						<Stack direction="column" sx={{ mb: 2 }}>
							<Typography
								variant="h3"
								sx={{ color: 'primary.dark' }}
							>
								{post.title}
							</Typography>
							<Divider sx={{ my: 1 }} />
							<Typography
								variant="body1"
								sx={{ marginTop: 2, textAlign: 'justify' }}
							>
								{post.content}
							</Typography>
						</Stack>
						<PostActions post={post} />
					</Paper>
					<Divider sx={{ my: 1 }} />
					<Box>
						<PostComments postId={post.id} />
					</Box>
				</Stack>
			)}
		</Layout>
	);
};
