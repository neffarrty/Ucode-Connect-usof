import React, { useState } from 'react';
import { Delete, Edit } from '@mui/icons-material';
import {
	Alert,
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
	Slide,
	TextField,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../../utils/axios';
import { Category } from '../../interface';

const Transition = React.forwardRef(function Transition(
	props: TransitionProps & {
		children: React.ReactElement<any, any>;
	},
	ref: React.Ref<unknown>,
) {
	return <Slide direction="up" ref={ref} {...props} />;
});

interface DeleteCategoryButtonProps {
	category: Category;
}

export const DeleteCategoryButton: React.FC<DeleteCategoryButtonProps> = ({
	category,
}) => {
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const client = useQueryClient();

	const { mutate, isPending } = useMutation<void, any, void>({
		mutationKey: ['delete_category', category.id],
		mutationFn: async () => {
			await axios.delete(`/categories/${category.id}`);
		},
		onSuccess: () => {
			client.invalidateQueries({ queryKey: ['categories'] });
			setOpenDeleteDialog(false);
		},
	});

	const handleDeleteSubmit = () => {
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
					handleDeleteSubmit();
				}}
				TransitionComponent={Transition}
			>
				<DialogTitle sx={{ color: 'white', bgcolor: 'primary.main' }}>
					Delete category '{category.title}'
				</DialogTitle>
				<DialogContent>
					<DialogContentText sx={{ textAlign: 'justify', pt: 2 }}>
						Are you sure you want to delete this category? This
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
