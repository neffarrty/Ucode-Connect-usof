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
import { useMutation } from '@tanstack/react-query';
import { Comment, Paginated, Post } from '../../interface';
import axios from '../../utils/axios';
import { useNavigate } from 'react-router-dom';

const Transition = React.forwardRef(function Transition(
	props: TransitionProps & {
		children: React.ReactElement<any, any>;
	},
	ref: React.Ref<unknown>,
) {
	return <Slide direction="up" ref={ref} {...props} />;
});

interface DeletePostButtonProps {
	post: Post;
}

export const DeletePostButton: React.FC<DeletePostButtonProps> = ({ post }) => {
	const navigate = useNavigate();
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

	const { mutate, isPending } = useMutation<
		void,
		any,
		void,
		{ previousComments: Paginated<Comment> | undefined }
	>({
		mutationKey: ['delete_post', post.id],
		mutationFn: async () => {
			await axios.delete<void>(`/posts/${post.id}`);
		},
		onSuccess: () => {
			setOpenDeleteDialog(false);
			navigate('/posts');
		},
	});

	const handleSubmit = () => {
		mutate();
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
					Delete post
				</DialogTitle>
				<DialogContent>
					<DialogContentText sx={{ textAlign: 'justify', pt: 2 }}>
						Are you sure you want to delete this post? This action
						cannot be undone.
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
