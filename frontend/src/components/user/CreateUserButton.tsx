import React, { useState } from 'react';
import {
	Alert,
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Slide,
	TextField,
} from '@mui/material';
import { GroupAdd } from '@mui/icons-material';
import { TransitionProps } from '@mui/material/transitions';
import { useMutation } from '@tanstack/react-query';
import axios from '../../utils/axios';
import { User } from '../../interface';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { schema } from '../../schemas/user-schema';

interface UserCreateInput {
	login: string;
	email: string;
	fullname: string;
	password: string;
	confirmPassword: string;
	role?: 'ADMIN' | 'USER';
}

const Transition = React.forwardRef(function Transition(
	props: TransitionProps & { children: React.ReactElement<any, any> },
	ref: React.Ref<unknown>,
) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export const CreateUserButton: React.FC = () => {
	const [openCreateDialog, setOpenCreateDialog] = useState(false);
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<UserCreateInput>({
		resolver: yupResolver(schema),
		defaultValues: {
			role: 'USER',
		},
	});

	const { mutate, isPending, isError, error } = useMutation<
		User,
		any,
		UserCreateInput
	>({
		mutationKey: ['create_category'],
		mutationFn: async (data: UserCreateInput) => {
			const { confirmPassword, ...payload } = data;
			const response = await axios.post(`/users/`, payload);
			return response.data;
		},
		onSuccess: (user: User) => {
			setOpenCreateDialog(false);
			navigate(`/users/${user.id}`);
		},
	});

	const handleCreateClose = () => {
		setOpenCreateDialog(false);
		reset();
	};

	const handleCreateSubmit = (data: UserCreateInput) => {
		mutate(data);
	};

	return (
		<Box>
			<Button
				variant="outlined"
				startIcon={<GroupAdd />}
				onClick={() => setOpenCreateDialog(true)}
			>
				Create user
			</Button>
			<Dialog
				open={openCreateDialog}
				onClose={() => setOpenCreateDialog(false)}
				component="form"
				onSubmit={handleSubmit(handleCreateSubmit)}
				TransitionComponent={Transition}
			>
				<DialogTitle sx={{ color: 'white', bgcolor: 'primary.main' }}>
					Create new user
				</DialogTitle>
				<DialogContent dividers>
					{isError && (
						<Alert severity="error" sx={{ mt: 1 }}>
							{error.response?.data?.message || error.message}
						</Alert>
					)}
					<TextField
						label="Login"
						fullWidth
						margin="normal"
						{...register('login')}
						error={!!errors.login}
						helperText={errors.login?.message}
					/>
					<TextField
						label="Fullname"
						fullWidth
						margin="normal"
						{...register('fullname')}
						error={!!errors.fullname}
						helperText={errors.fullname?.message}
					/>
					<TextField
						label="Email"
						fullWidth
						margin="normal"
						{...register('email')}
						error={!!errors.email}
						helperText={errors.email?.message}
					/>
					<TextField
						label="Password"
						type="password"
						fullWidth
						margin="normal"
						{...register('password')}
						error={!!errors.password}
						helperText={errors.password?.message}
					/>
					<TextField
						label="Confirm password"
						type="password"
						fullWidth
						margin="normal"
						{...register('confirmPassword')}
						error={!!errors.confirmPassword}
						helperText={errors.confirmPassword?.message}
					/>
					<FormControl sx={{ width: '50%', mt: 2 }}>
						<InputLabel>Role</InputLabel>
						<Select
							label="Role"
							value={'USER'}
							{...register('role')}
							error={!!errors.role}
							displayEmpty
						>
							<MenuItem value={'USER'}>USER</MenuItem>
							<MenuItem value={'ADMIN'}>ADMIN</MenuItem>
						</Select>
					</FormControl>
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
						{'Create'}
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};
