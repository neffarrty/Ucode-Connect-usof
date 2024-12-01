import React from 'react';
import { Box, CircularProgress, Divider, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Paginated, Comment } from '../../interface';
import { AxiosError } from 'axios';
import axios from '../../utils/axios';
import { CommentCard } from './CommentCard';
import { CreateCommentForm } from './AddCommentForm';

interface PostCommentsProps {
	postId: number;
}

export const CommentsList: React.FC<PostCommentsProps> = ({ postId }) => {
	const { data: comments, isLoading } = useQuery<
		Paginated<Comment>,
		AxiosError
	>({
		queryKey: ['comments', postId],
		queryFn: async () => {
			const { data } = await axios.get<Paginated<Comment>>(
				`/posts/${postId}/comments`,
			);
			return data;
		},
	});

	return (
		<Box>
			<Typography variant="h5">
				Comments ({comments?.meta.total || 0})
			</Typography>
			{isLoading ? (
				<CircularProgress />
			) : (
				<Box>
					{comments?.data.map((comment) => (
						<CommentCard
							key={comment.id}
							comment={comment}
							postId={postId}
						/>
					))}
				</Box>
			)}
			<Divider sx={{ my: 3 }} />
			<CreateCommentForm postId={postId} />
		</Box>
	);
};
