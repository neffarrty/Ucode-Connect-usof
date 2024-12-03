import React, { useState } from 'react';
import {
	Alert,
	Avatar,
	Badge,
	Box,
	IconButton,
	Snackbar,
	SnackbarCloseReason,
} from '@mui/material';
import { AddAPhoto } from '@mui/icons-material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { User } from '../../interface/User';
import axios from '../../utils/axios';
import { updateUser } from '../../redux/auth/slice';
import { RootState } from '../../redux/store';

interface ProfileAvatarProps {
	user: User;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ user }) => {
	const [openSnackBar, setOpenSnackBar] = useState(false);
	const dispatch = useDispatch();
	const currentUser = useSelector((state: RootState) => state.auth.user);
	const client = useQueryClient();

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
			client.invalidateQueries({ queryKey: ['user'] });
		},
		onError: (_error) => {
			setOpenSnackBar(true);
		},
	});

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const data = new FormData();
			data.append('image', file);
			mutate(data);
		}
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
			<Badge
				overlap="circular"
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				badgeContent={
					currentUser?.id === user.id && (
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
					)
				}
			>
				<Avatar
					alt={user.login}
					src={user.avatar}
					sx={{
						height: 150,
						width: 150,
						border: 2,
						borderColor: 'primary.main',
					}}
				/>
			</Badge>
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
		</Box>
	);
};
