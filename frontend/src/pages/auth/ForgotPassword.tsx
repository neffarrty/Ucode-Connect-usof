import {
	Alert,
	Box,
	Button,
	CircularProgress,
	Container,
	InputAdornment,
	Link,
	TextField,
	Typography,
} from '@mui/material';
import { AlternateEmail } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { useState } from 'react';
import * as yup from 'yup';
import axios from '../../utils/axios';

const schema = yup.object().shape({
	email: yup.string().required('Email is required'),
});

interface FormInput {
	email: string;
}

export const ForgotPassword: React.FC = () => {
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
		FormInput
	>({
		mutationFn: (data) => axios.post('/auth/forgot-password', data),
		onSuccess: () => {
			setSuccess(true);
		},
	});

	const onSubmit = (data: FormInput) => {
		mutate(data);
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
					Forgot password?
				</Typography>
				<Typography variant="caption" sx={{ mt: 1 }}>
					Enter your email address and we will send you a link to
					reset your password.
				</Typography>
				<TextField
					label="Email"
					type="email"
					placeholder="your@email.com"
					{...register('email')}
					error={!!errors.email}
					helperText={errors.email?.message}
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
						A reset link has been sent to your email.
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
				<Typography sx={{ alignSelf: 'center', my: 1 }}>
					Remember your password?{' '}
					<Link href="/login" underline="none">
						Login here
					</Link>
				</Typography>
			</Box>
		</Container>
	);
};
