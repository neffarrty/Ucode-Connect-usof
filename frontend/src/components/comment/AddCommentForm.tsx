import {
	Box,
	Button,
	CircularProgress,
	TextField,
	Typography,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Comment, Paginated } from '../../interface';
import { AxiosError } from 'axios';
import axios from '../../utils/axios';

interface CreateCommentFormProps {
	postId: number;
}

export const CreateCommentForm: React.FC<CreateCommentFormProps> = ({
	postId,
}) => {
	const [content, setContent] = useState<string>('');
	const client = useQueryClient();

	const { mutate, isPending } = useMutation<
		Comment,
		AxiosError,
		{ content: string },
		{ previousComments: Paginated<Comment> | undefined }
	>({
		mutationFn: async ({ content }) => {
			const { data } = await axios.post<Comment>(
				`/posts/${postId}/comments`,
				{ content },
			);
			return data;
		},
		onSuccess: () => {
			client.invalidateQueries({ queryKey: ['comments', postId] });
		},
		onError: (_error, _comment, context) => {
			if (context?.previousComments) {
				client.setQueryData(
					['comments', postId],
					context.previousComments,
				);
			}
		},
	});

	const handleSubmit = () => {
		if (content.trim()) {
			mutate({ content });
			setContent('');
		}
	};

	return (
		<Box>
			<Typography variant="h6">Add a comment</Typography>
			<TextField
				fullWidth
				multiline
				rows={4}
				variant="outlined"
				placeholder="Write your comment..."
				value={content}
				onChange={(e) => setContent(e.target.value)}
			/>
			<Button
				variant="contained"
				sx={{ marginTop: 2 }}
				onClick={handleSubmit}
				disabled={isPending || !content.trim()}
			>
				{isPending ? <CircularProgress size={20} /> : 'Post Comment'}
			</Button>
		</Box>
	);
};
