import React, { useState } from 'react';
import {
	IconButton,
	Paper,
	Stack,
	Typography,
	Chip,
	Snackbar,
	Alert,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	SnackbarCloseReason,
	Slide,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { User } from '../../interface/User';
import { Close, Edit, Grade, Save } from '@mui/icons-material';
import { getMembershipDuration } from '../../utils/dates';
import { updateUser } from '../../redux/auth/slice';
import axios from '../../utils/axios';
import { useForm } from 'react-hook-form';
import { ProfileAvatar } from './FrofileAvatar';
import { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef(function Transition(
	props: TransitionProps & {
		children: React.ReactElement<any, any>;
	},
	ref: React.Ref<unknown>,
) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export const ProfileUserInfo: React.FC = () => {
	const { user } = useSelector((state: any) => state.auth);
	const dispatch = useDispatch();

	const [openSnackBar, setOpenSnackBar] = useState(false);
	const [openEditDialog, setOpenEditDialog] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		defaultValues: {
			login: user?.login,
			fullname: user?.fullname,
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
			dispatch(updateUser(user));
			setOpenSnackBar(true);
			setOpenEditDialog(false);
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
		<Paper
			sx={{
				display: 'flex',
				gap: 2,
				p: 3,
				height: '100%',
				alignItems: 'center',
				border: '1px solid',
				borderColor: 'divider',
				position: 'relative',
			}}
		>
			<ProfileAvatar />
			<Stack direction="column" gap={0.5}>
				<Stack direction="row" gap={1} alignItems="center">
					<Typography
						variant="h6"
						fontWeight="bold"
						color="text.dark"
					>
						{user.login}
					</Typography>
					<Chip label={user.role} size="small" />
				</Stack>
				<Typography color="text.secondary">
					{user.fullname || 'No fullname'}
				</Typography>
				<Stack direction="row" alignItems="center" gap={0.5}>
					<Grade sx={{ color: 'gold' }} />
					<Typography color="primary" fontWeight="bold">
						{user.rating}
					</Typography>
				</Stack>
				<Typography variant="body2" color="text.secondary">
					{getMembershipDuration(new Date(user?.createdAt))}
				</Typography>
			</Stack>
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
					Edit Profile
				</DialogTitle>
				<DialogContent dividers>
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
		</Paper>
	);
};
