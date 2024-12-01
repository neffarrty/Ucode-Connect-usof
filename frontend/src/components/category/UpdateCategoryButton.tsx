import React, { useState } from 'react';
import { Edit } from '@mui/icons-material';
import {
	Alert,
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
import { TransitionProps } from '@mui/material/transitions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../../utils/axios';
import { useForm } from 'react-hook-form';
import { Category } from '../../interface';

const Transition = React.forwardRef(function Transition(
	props: TransitionProps & {
		children: React.ReactElement<any, any>;
	},
	ref: React.Ref<unknown>,
) {
	return <Slide direction="up" ref={ref} {...props} />;
});

interface CategoryUpdateInput {
	title: string;
	description: string;
}

interface UpdateCategoryButtonProps {
	category: Category;
}

export const UpdateCategoryButton: React.FC<UpdateCategoryButtonProps> = ({
	category,
}) => {
	const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
	const client = useQueryClient();

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<CategoryUpdateInput>({
		defaultValues: {
			title: category.title,
			description: category.description,
		},
	});

	const { mutate, isPending, isError, error } = useMutation<
		void,
		any,
		CategoryUpdateInput
	>({
		mutationKey: ['update_category', category.id],
		mutationFn: async (data: CategoryUpdateInput) => {
			await axios.patch(`/categories/${category.id}`, data);
		},
		onSuccess: () => {
			client.invalidateQueries({ queryKey: ['categories'] });
			setOpenUpdateDialog(false);
		},
	});

	const handleUpdateClose = () => {
		setOpenUpdateDialog(false);
		reset();
	};

	const handleUpdateSubmit = (data: CategoryUpdateInput) => {
		mutate(data);
	};

	return (
		<Box>
			<IconButton onClick={() => setOpenUpdateDialog(true)}>
				<Edit />
			</IconButton>
			<Dialog
				open={openUpdateDialog}
				onClose={() => setOpenUpdateDialog(false)}
				component="form"
				onSubmit={handleSubmit(handleUpdateSubmit)}
				TransitionComponent={Transition}
			>
				<DialogTitle sx={{ color: 'white', bgcolor: 'primary.main' }}>
					Update category {category.title}
				</DialogTitle>
				<DialogContent dividers>
					{isError && (
						<Alert severity="error" sx={{ mt: 1 }}>
							{error.response?.data?.message || error.message}
						</Alert>
					)}
					<TextField
						label="Title"
						fullWidth
						margin="normal"
						{...register('title', {
							required: 'Title is required',
						})}
						error={!!errors.title}
						helperText={errors.title?.message}
					/>
					<TextField
						label="Description"
						multiline
						fullWidth
						margin="normal"
						{...register('description', {
							required: 'Description is required',
						})}
						error={!!errors.description}
						helperText={errors.description?.message}
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
						{'Update'}
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};
