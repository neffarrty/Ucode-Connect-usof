import React, { useState } from 'react';
import {
	Avatar,
	Badge,
	IconButton,
	Paper,
	Stack,
	Typography,
	Chip,
	Snackbar,
	Alert,
	SnackbarCloseReason,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { User } from '../../interface/User';
import { Grade, AddAPhoto } from '@mui/icons-material';
import { getMembershipDuration } from '../../utils/dates';
import { updateUser } from '../../redux/auth/slice';
import axios from '../../utils/axios';

export const ProfileUserInfo: React.FC = () => {
	const { user } = useSelector((state: any) => state.auth);
	const dispatch = useDispatch();

	const [openSnackBar, setOpenSnackBar] = useState(false);
	const handleCloseSnackbar = (
		_event: React.SyntheticEvent | Event,
		reason?: SnackbarCloseReason,
	) => {
		if (reason === 'clickaway') {
			return;
		}
		setOpenSnackBar(false);
	};

	const { mutate, isPending, isError, error } = useMutation<
		User,
		any,
		FormData
	>({
		mutationKey: ['set_avatar'],
		mutationFn: async (data: FormData) => {
			const response = await axios.patch<User>('/users/avatar', data, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			return response.data;
		},
		onSuccess: (user: User) => {
			dispatch(updateUser(user));
			setOpenSnackBar(true);
		},
		onError: (_error) => {
			setOpenSnackBar(true);
		},
	});

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const formData = new FormData();
			formData.append('image', file);
			mutate(formData);
		}
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
			}}
		>
			<Badge
				overlap="circular"
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				badgeContent={
					<IconButton
						component="label"
						disabled={isPending}
						sx={{
							border: 2,
							bgcolor: 'background.paper',
							borderColor: 'primary.main',
							'&:hover': {
								bgcolor: 'background.paper',
							},
						}}
					>
						<input
							type="file"
							hidden
							accept="image/*"
							onChange={handleFileChange}
						/>
						<AddAPhoto
							sx={{
								color: 'primary.dark',
							}}
						/>
					</IconButton>
				}
			>
				<Avatar
					alt={user?.login}
					src={user?.avatar}
					sx={{
						height: 150,
						width: 150,
						border: 2,
						borderColor: 'primary.main',
					}}
				/>
			</Badge>
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
						: 'Successfully changed profile image'}
				</Alert>
			</Snackbar>
		</Paper>
	);
};
