import {
	Alert,
	Box,
	Button,
	CircularProgress,
	Container,
	InputAdornment,
	TextField,
	Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { AlternateEmail } from '@mui/icons-material';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../utils/axios';
import * as yup from 'yup';

const schema = yup.object().shape({
	password: yup
		.string()
		.matches(
			/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
			'Password must be at least 8 characters and include uppercase, lowercase, and a number',
		)
		.required('Password is required'),
	confirmPassword: yup
		.string()
		.oneOf([yup.ref('password')], 'Passwords must match')
		.required('Confirm password is required'),
});

interface FormInput {
	password: string;
	confirmPassword: string;
}

export const ResetPassword: React.FC = () => {
	const { token } = useParams();
	const [success, setSuccess] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormInput>({
		resolver: yupResolver(schema),
	});

	const { mutate, isPending, error } = useMutation<
		AxiosResponse,
		any,
		{ password: string }
	>({
		mutationFn: (data) => axios.post(`/auth/password-reset/${token}`, data),
		onSuccess: () => {
			setSuccess(true);
		},
	});

	const onSubmit = ({ password }: FormInput) => {
		mutate({ password });
	};

	return (
		<Container
			component="main"
			sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				height: '100vh',
			}}
		>
			<Box
				component="form"
				onSubmit={handleSubmit(onSubmit)}
				sx={{
					width: '100%',
					maxWidth: 350,
					boxShadow: 3,
					borderRadius: 2,
					p: 4,
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<Typography
					component="h1"
					sx={{ alignSelf: 'center', fontSize: 26, fontWeight: 700 }}
				>
					Password reset
				</Typography>
				<Typography variant="caption" sx={{ mt: 1 }}>
					Create a new password that you don't use on any other site.
				</Typography>
				<TextField
					label="Password"
					type="password"
					{...register('password')}
					error={!!errors.password}
					helperText={errors.password?.message}
					fullWidth
					margin="normal"
					size="small"
					slotProps={{
						input: {
							startAdornment: (
								<InputAdornment position="start">
									<AlternateEmail fontSize="small" />
								</InputAdornment>
							),
						},
					}}
				/>
				<TextField
					label="Confirm password"
					type="password"
					{...register('confirmPassword')}
					error={!!errors.confirmPassword}
					helperText={errors.confirmPassword?.message}
					fullWidth
					margin="normal"
					size="small"
					slotProps={{
						input: {
							startAdornment: (
								<InputAdornment position="start">
									<AlternateEmail fontSize="small" />
								</InputAdornment>
							),
						},
					}}
				/>
				{error && (
					<Alert severity="error" sx={{ mt: 1 }}>
						{error.response?.data?.message || error.message}
					</Alert>
				)}
				{success && (
					<Alert severity="success" sx={{ mt: 1 }}>
						Password reset successful. Please log in with your new
						credentials.
					</Alert>
				)}
				<Button
					type="submit"
					variant="contained"
					disabled={isPending}
					fullWidth
					sx={{ mt: 1 }}
				>
					{isPending ? (
						<CircularProgress size={24} />
					) : (
						'Reset password'
					)}
				</Button>
			</Box>
		</Container>
	);
};
