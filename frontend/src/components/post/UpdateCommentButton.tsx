import React, { useState } from 'react';
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Slide,
	TextField,
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import { TransitionProps } from '@mui/material/transitions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Comment, Paginated } from '../../interface';
import axios from '../../utils/axios';
import { useForm } from 'react-hook-form';

const Transition = React.forwardRef(function Transition(
	props: TransitionProps & {
		children: React.ReactElement<any, any>;
	},
	ref: React.Ref<unknown>,
) {
	return <Slide direction="up" ref={ref} {...props} />;
});

interface UpdateCommentButtonProps {
	postId: number;
	comment: Comment;
}

export const UpdateCommentButton: React.FC<UpdateCommentButtonProps> = ({
	postId,
	comment,
}) => {
	const client = useQueryClient();
	const [content, setContent] = useState<string>(comment.content);
	const [openUpdateDialog, setOpenUpdateDialog] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		defaultValues: {
			content: comment.content,
		},
	});

	const { mutate: updateComment, isPending } = useMutation<
		void,
		any,
		Partial<Comment>
	>({
		mutationFn: async (data: Partial<Comment>) => {
			await axios.patch<Comment>(`/comments/${comment.id}`, data);
		},
		onSuccess: () => {
			client.invalidateQueries({ queryKey: ['comments', postId] });
			setOpenUpdateDialog(false);
		},
	});

	const handleUpdateClose = () => {
		setOpenUpdateDialog(false);
		reset();
	};

	const handleUpdateSubmit = (data: { content: string }) => {
		console.log(data.content);
		updateComment(data);
	};

	return (
		<Box>
			<IconButton onClick={() => setOpenUpdateDialog(true)}>
				<Edit sx={{ color: 'primary.dark' }} />
			</IconButton>
			<Dialog
				open={openUpdateDialog}
				onClose={() => setOpenUpdateDialog(false)}
				component="form"
				onSubmit={handleSubmit(handleUpdateSubmit)}
				TransitionComponent={Transition}
				fullWidth
				maxWidth="md"
			>
				<DialogTitle sx={{ color: 'white', bgcolor: 'primary.main' }}>
					Edit comment
				</DialogTitle>
				<DialogContent sx={{ minWidth: 400 }}>
					<TextField
						multiline
						autoFocus
						label="Content"
						fullWidth
						margin="normal"
						{...register('content', {
							required: 'Content is required',
						})}
						error={!!errors.content}
						helperText={errors.content?.message}
					/>
				</DialogContent>
				<DialogActions sx={{ px: 3, mb: 1 }}>
					<Button onClick={handleUpdateClose} color="primary">
						{'Cancel'}
					</Button>
					<Button
						type="submit"
						variant="contained"
						color="primary"
						disabled={isPending}
					>
						{'Save'}
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};
