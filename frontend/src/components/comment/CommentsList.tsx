import React, { useState } from 'react';
import {
	Box,
	CircularProgress,
	Divider,
	Pagination,
	Typography,
} from '@mui/material';
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
	const [page, setPage] = useState(1);

	const handlePageChange = (
		_event: React.ChangeEvent<unknown>,
		value: number,
	) => {
		setPage(value);
	};

	const { data: comments, isLoading } = useQuery<
		Paginated<Comment>,
		AxiosError
	>({
		queryKey: ['comments', postId, page],
		queryFn: async () => {
			const { data } = await axios.get<Paginated<Comment>>(
				`/posts/${postId}/comments`,
				{ params: { page } },
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
			<Box
				component="section"
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					mb: 2,
				}}
			>
				<Pagination
					count={comments?.meta.pages}
					page={page}
					variant="outlined"
					shape="rounded"
					color="primary"
					showFirstButton
					showLastButton
					onChange={handlePageChange}
					sx={{ color: 'primary.main', alignSelf: 'end' }}
				/>
			</Box>
			<CreateCommentForm postId={postId} />
		</Box>
	);
};
