import React, { useState } from 'react';
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
	Slide,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { TransitionProps } from '@mui/material/transitions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Comment, Paginated } from '../../interface';
import axios from '../../utils/axios';

const Transition = React.forwardRef(function Transition(
	props: TransitionProps & {
		children: React.ReactElement<any, any>;
	},
	ref: React.Ref<unknown>,
) {
	return <Slide direction="up" ref={ref} {...props} />;
});

interface DeleteCommentButtonProps {
	postId: number;
	comment: Comment;
}

export const DeleteCommentButton: React.FC<DeleteCommentButtonProps> = ({
	postId,
	comment,
}) => {
	const client = useQueryClient();
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

	const { mutate: deleteComment, isPending } = useMutation<
		void,
		any,
		void,
		{ previousComments: Paginated<Comment> | undefined }
	>({
		mutationKey: ['delete_comment', comment.id],
		mutationFn: async () => {
			await axios.delete<Comment>(`/comments/${comment.id}`);
		},
		onSuccess: () => {
			client.invalidateQueries({ queryKey: ['comments', postId] });
			setOpenDeleteDialog(false);
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
		deleteComment();
	};

	return (
		<Box>
			<IconButton onClick={() => setOpenDeleteDialog(true)}>
				<Delete />
			</IconButton>
			<Dialog
				open={openDeleteDialog}
				onClose={() => setOpenDeleteDialog(false)}
				component="form"
				onSubmit={(e) => {
					e.preventDefault();
					handleSubmit();
				}}
				TransitionComponent={Transition}
			>
				<DialogTitle sx={{ color: 'white', bgcolor: 'primary.main' }}>
					Delete comment
				</DialogTitle>
				<DialogContent>
					<DialogContentText sx={{ textAlign: 'justify', pt: 2 }}>
						Are you sure you want to delete this comment? This
						action cannot be undone.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => setOpenDeleteDialog(false)}
						color="primary"
					>
						{'Cancel'}
					</Button>
					<Button
						type="submit"
						variant="contained"
						color="primary"
						disabled={isPending}
					>
						{'Delete'}
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};
