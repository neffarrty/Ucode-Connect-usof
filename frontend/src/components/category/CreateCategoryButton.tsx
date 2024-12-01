import React, { useState } from 'react';
import { Create } from '@mui/icons-material';
import {
	Alert,
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Slide,
	TextField,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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

interface CategoryCreateInput {
	title: string;
	description: string;
}

export const CreateCategoryButton: React.FC = () => {
	const [openCreateDialog, setOpenCreateDialog] = useState(false);
	const client = useQueryClient();

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<CategoryCreateInput>();

	const { mutate, isPending, isError, error } = useMutation<
		void,
		any,
		CategoryCreateInput
	>({
		mutationKey: ['create_category'],
		mutationFn: async (data: CategoryCreateInput) => {
			await axios.post(`/categories/`, data);
		},
		onSuccess: () => {
			client.invalidateQueries({ queryKey: ['categories'] });
			setOpenCreateDialog(false);
		},
	});

	const handleCreateClose = () => {
		setOpenCreateDialog(false);
		reset();
	};

	const handleCreateSubmit = (data: CategoryCreateInput) => {
		mutate(data);
	};

	return (
		<Box>
			<Button
				variant="outlined"
				startIcon={<Create />}
				onClick={() => setOpenCreateDialog(true)}
			>
				Create category
			</Button>
			<Dialog
				open={openCreateDialog}
				onClose={() => setOpenCreateDialog(false)}
				component="form"
				onSubmit={handleSubmit(handleCreateSubmit)}
				TransitionComponent={Transition}
			>
				<DialogTitle sx={{ color: 'white', bgcolor: 'primary.main' }}>
					Create new category
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
					<Button onClick={handleCreateClose} color="primary">
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
