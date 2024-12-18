import React from 'react';
import {
	Alert,
	Box,
	Chip,
	CircularProgress,
	Divider,
	Paper,
	Stack,
	Tooltip,
	Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { Post } from '../../interface/Post';
import { AxiosError } from 'axios';
import axios from '../../utils/axios';
import remarkGfm from 'remark-gfm';
import Markdown from 'react-markdown';
import { CommentsList } from '../../components/comment/CommentsList';
import { PostActions } from '../../components/post/PostActions';
import { PostHeader } from '../../components/post/PostHeader';
import { Layout } from '../../components/layout/Layout';
import { VisibilityOff } from '@mui/icons-material';

export const PostPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();

	const {
		data: post,
		error,
		isLoading,
	} = useQuery<Post, AxiosError>({
		queryKey: ['post', id],
		queryFn: async () => {
			const { data } = await axios.get<Post>(`/posts/${id}`);
			return data;
		},
	});

	if (error) {
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
					<Alert severity="error">
						Error loading post: {error.message}
					</Alert>
				</Box>
			</Layout>
		);
	}

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
							{post.status === 'INACTIVE' && (
								<Chip
									icon={
										<VisibilityOff sx={{ fontSize: 16 }} />
									}
									label={post.status}
									variant="outlined"
									sx={{
										mb: 1,
										display: 'inline-flex',
										alignItems: 'center',
									}}
								/>
							)}
							<Typography
								variant="h3"
								sx={{ color: 'primary.dark' }}
							>
								{post.title}
							</Typography>
							<Stack direction="row" sx={{ gap: 1, my: 1 }}>
								{post.categories.map(({ category }) => (
									<Tooltip
										key={category.id}
										title={category.description}
									>
										<Chip
											component="a"
											href={`/categories/${category.id}/posts`}
											label={category.title}
											variant="outlined"
											size="small"
											color="primary"
											clickable
										/>
									</Tooltip>
								))}
							</Stack>
							<Divider sx={{ mt: 1 }} />
							<Box>
								<Markdown remarkPlugins={[remarkGfm]}>
									{post.content}
								</Markdown>
							</Box>
						</Stack>
						<PostActions post={post} />
					</Paper>
					<Divider sx={{ my: 1 }} />
					<Box>
						<CommentsList postId={post.id} />
					</Box>
				</Stack>
			)}
		</Layout>
	);
};
