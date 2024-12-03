import React, { useState } from 'react';
import {
	Alert,
	Box,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	IconButton,
	InputLabel,
	MenuItem,
	Select,
	Slide,
	Snackbar,
	SnackbarCloseReason,
	TextField,
} from '@mui/material';
import { Close, Edit, Save } from '@mui/icons-material';
import { TransitionProps } from '@mui/material/transitions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { User } from '../../interface';
import axios from '../../utils/axios';
import { updateUser } from '../../redux/auth/slice';

const Transition = React.forwardRef(function Transition(
	props: TransitionProps & {
		children: React.ReactElement<any, any>;
	},
	ref: React.Ref<unknown>,
) {
	return <Slide direction="up" ref={ref} {...props} />;
});

interface UpdateUserButtonProps {
	user: User;
}

export const UpdateUserButton: React.FC<UpdateUserButtonProps> = ({ user }) => {
	const dispatch = useDispatch();
	const currentUser = useSelector((state: any) => state.auth.user);
	const client = useQueryClient();

	const [openSnackBar, setOpenSnackBar] = useState(false);
	const [openEditDialog, setOpenEditDialog] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		defaultValues: {
			login: user.login,
			fullname: user.fullname,
			role: user.role,
		},
	});

	const { mutate, isPending, isError, error } = useMutation<
		User,
		any,
		Partial<User>
	>({
		mutationKey: ['update_profile'],
		mutationFn: async (data) => {
			const response = await axios.patch<User>(`/users/${user.id}`, data);
			return response.data;
		},
		onSuccess: (user) => {
			if (currentUser.id === user.id) {
				dispatch(updateUser(user));
			}
			setOpenSnackBar(true);
			setOpenEditDialog(false);
			client.invalidateQueries({ queryKey: ['user'] });
		},
		onError: (_error) => {
			setOpenSnackBar(true);
		},
	});

	const handleEditClose = () => {
		setOpenEditDialog(false);
		reset();
	};

	const handleEditSubmit = (data: { login: string; fullname: string }) => {
		mutate(data);
	};

	const handleCloseSnackbar = (
		_event: React.SyntheticEvent | Event,
		reason?: SnackbarCloseReason,
	) => {
		if (reason === 'clickaway') {
			return;
		}
		setOpenSnackBar(false);
	};

	return (
		<Box>
			<IconButton
				sx={{
					position: 'absolute',
					bottom: 16,
					right: 16,
					backgroundColor: 'primary.main',
					color: 'white',
					borderRadius: '50%',
					'&:hover': {
						backgroundColor: 'primary.dark',
					},
					size: 'small',
				}}
				onClick={() => setOpenEditDialog(true)}
			>
				<Edit />
			</IconButton>
			<Dialog
				open={openEditDialog}
				onClose={() => setOpenEditDialog(false)}
				component="form"
				onSubmit={handleSubmit(handleEditSubmit)}
				TransitionComponent={Transition}
			>
				<DialogTitle sx={{ color: 'white', bgcolor: 'primary.main' }}>
					Edit user {user.login}
				</DialogTitle>
				<DialogContent dividers sx={{ maxWidth: 400 }}>
					<TextField
						label="Login"
						fullWidth
						margin="normal"
						{...register('login', {
							required: 'Login is required',
						})}
						error={!!errors.login}
						helperText={errors.login?.message}
					/>
					<TextField
						label="Full Name"
						fullWidth
						margin="normal"
						{...register('fullname')}
					/>
					{currentUser.role === 'ADMIN' && user.role !== 'ADMIN' && (
						<FormControl sx={{ width: '100%', mt: 2 }}>
							<InputLabel>Role</InputLabel>
							<Select
								label="Role"
								{...register('role')}
								displayEmpty
							>
								<MenuItem value={'USER'}>USER</MenuItem>
								<MenuItem value={'ADMIN'}>ADMIN</MenuItem>
							</Select>
						</FormControl>
					)}
				</DialogContent>
				<DialogActions>
					<IconButton onClick={handleEditClose} color="primary">
						<Close />
					</IconButton>
					<IconButton
						type="submit"
						color="primary"
						disabled={isPending}
					>
						<Save />
					</IconButton>
				</DialogActions>
			</Dialog>
			<Snackbar
				open={openSnackBar}
				autoHideDuration={3000}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
				onClose={handleCloseSnackbar}
				key={openSnackBar ? 'open' : 'closed'}
			>
				<Alert severity={isError ? 'error' : 'success'} sx={{ mt: 1 }}>
					{isError
						? error.response?.data?.message || error.message
						: 'Successfully changed user info'}
				</Alert>
			</Snackbar>
		</Box>
	);
};
