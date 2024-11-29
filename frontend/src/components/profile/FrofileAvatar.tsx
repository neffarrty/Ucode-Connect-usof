import { AddAPhoto } from '@mui/icons-material';
import {
	Alert,
	Avatar,
	Badge,
	Box,
	IconButton,
	Snackbar,
	SnackbarCloseReason,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { User } from '../../interface/User';
import axios from '../../utils/axios';
import { updateUser } from '../../redux/auth/slice';
import { useState } from 'react';

export const ProfileAvatar: React.FC = () => {
	const [openSnackBar, setOpenSnackBar] = useState(false);
	const { user } = useSelector((state: any) => state.auth);
	const dispatch = useDispatch();

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
