import React from 'react';
import {
	TextField,
	Button,
	CircularProgress,
	Typography,
	Link,
	Box,
	InputAdornment,
	Alert,
} from '@mui/material';
import {
	AccountCircle,
	AlternateEmail,
	Badge,
	VpnKey,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { register as registerAction } from '../../redux/auth/actions';
import { AppDispatch, RootState } from '../../redux/store';
import { yupResolver } from '@hookform/resolvers/yup';
import logo from '../../assets/logo.svg';
import { schema } from '../../schemas/user-schema';

interface FormInput {
	login: string;
	email: string;
	password: string;
	confirmPassword: string;
	fullname: string;
}

const RegisterForm: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { loading, error, success } = useSelector(
		(state: RootState) => state.auth,
	);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormInput>({
		resolver: yupResolver(schema),
	});

	const onSubmit = (data: FormInput) => {
		const { confirmPassword, ...payload } = data;
		dispatch(registerAction(payload));
	};

	return (
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
			<Box
				component="img"
				src={logo}
				alt="logo"
				sx={{ alignSelf: 'center' }}
			/>
			<Typography component="p" sx={{ alignSelf: 'center' }}>
				Create a new account
			</Typography>
			<TextField
				label="Username *"
				{...register('login')}
				error={!!errors.login}
				helperText={errors.login?.message}
				fullWidth
				margin="normal"
				size="small"
				slotProps={{
					input: {
						startAdornment: (
							<InputAdornment position="start">
								<AccountCircle fontSize="small" />
							</InputAdornment>
						),
					},
				}}
				autoFocus
			/>
			<TextField
				label="Email *"
				type="email"
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
			<TextField
				label="Full Name *"
				{...register('fullname')}
				error={!!errors.fullname}
				helperText={errors.fullname?.message}
				fullWidth
				margin="normal"
				size="small"
				slotProps={{
					input: {
						startAdornment: (
							<InputAdornment position="start">
								<Badge fontSize="small" />
							</InputAdornment>
						),
					},
				}}
			/>
			<TextField
				label="Password *"
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
								<VpnKey fontSize="small" />
							</InputAdornment>
						),
					},
				}}
			/>
			<TextField
				label="Confirm Password *"
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
								<VpnKey fontSize="small" />
							</InputAdornment>
						),
					},
				}}
			/>
			{success && (
				<Alert severity="success" sx={{ mt: 1 }}>
					A verification link has been sent to your email.
				</Alert>
			)}
			{error && (
				<Alert severity="error" sx={{ mt: 1 }}>
					{error}
				</Alert>
			)}
			<Button
				type="submit"
				variant="contained"
				disabled={loading}
				fullWidth
				sx={{ mt: 3, mb: 2 }}
			>
				{loading ? <CircularProgress size={24} /> : 'Register'}
			</Button>
			<Typography sx={{ alignSelf: 'center' }}>
				Already have an account?{' '}
				<Link href="/login" underline="none">
					Sign in
				</Link>
			</Typography>
		</Box>
	);
};

export default RegisterForm;
