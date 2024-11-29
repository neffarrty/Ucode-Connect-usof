import React from 'react';
import {
	Avatar,
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	CircularProgress,
	Divider,
	TextField,
	Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Paginated, Comment } from '../../interface';
import { formatDate } from '../../utils/dates';
import { AxiosError } from 'axios';
import axios from '../../utils/axios';

interface PostCommentsProps {
	postId: number;
}

export const PostComments: React.FC<PostCommentsProps> = ({ postId }) => {
	const { data: comments, isLoading } = useQuery<
		Paginated<Comment>,
		AxiosError
	>({
		queryKey: ['comments', postId],
		queryFn: async () => {
			const response = await axios.get<Paginated<Comment>>(
				`/posts/${postId}/comments`,
			);
			return response.data;
		},
	});

	return (
		<Box>
			<Typography variant="h5">
				Comments ({comments?.meta.total})
			</Typography>
			{isLoading ? (
				<CircularProgress />
			) : (
				<Box>
					{comments?.data.map((comment) => (
						<Card key={comment.id} sx={{ my: 2 }}>
							<CardHeader
								avatar={<Avatar src={comment.author.avatar} />}
								title={comment.author.login}
								subheader={formatDate(
									new Date(comment.createdAt),
								)}
							/>
							<CardContent>
								<Typography variant="body2">
									{comment.content}
								</Typography>
							</CardContent>
						</Card>
					))}
				</Box>
			)}
			<Divider sx={{ my: 3 }} />
			<Box>
				<Typography variant="h6">Add a comment</Typography>
				<TextField
					fullWidth
					multiline
					rows={4}
					variant="outlined"
					placeholder="Write your comment..."
				/>
				<Button variant="contained" sx={{ marginTop: 2 }}>
					Post Comment
				</Button>
			</Box>
		</Box>
	);
};
