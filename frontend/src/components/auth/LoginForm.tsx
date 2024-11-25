import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { login } from '../../redux/auth/actions';
import { AlternateEmail, VpnKey, Google } from '@mui/icons-material';
import {
	Box,
	Typography,
	TextField,
	InputAdornment,
	Alert,
	Button,
	CircularProgress,
	Divider,
	Link,
} from '@mui/material';
import logo from '../../assets/logo.svg';
import * as yup from 'yup';

const schema = yup.object().shape({
	email: yup.string().required('Email is required'),
	password: yup.string().required('Password is required'),
});

interface FormInput {
	email: string;
	password: string;
}

const LoginForm: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { loading, error } = useSelector((state: RootState) => state.auth);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormInput>({
		resolver: yupResolver(schema),
	});

	const onSubmit = (data: FormInput) => {
		dispatch(login(data));
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
				sx={{ alignSelf: 'center', mb: 2 }}
			/>
			<Typography component="p" sx={{ alignSelf: 'center', mb: 2 }}>
				Welcome, please sign in to continue
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
								<VpnKey fontSize="small" />
							</InputAdornment>
						),
					},
				}}
			/>
			<Link
				href="/password-reset"
				underline="none"
				sx={{ alignSelf: 'end' }}
			>
				Forgot password
			</Link>
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
				{loading ? <CircularProgress size={24} /> : 'Login'}
			</Button>
			<Typography sx={{ alignSelf: 'center' }}>
				Already have an account?{' '}
				<Link href="/register" underline="none">
					Sign up
				</Link>
			</Typography>
			<Divider sx={{ my: 2 }}>OR</Divider>
			<Button
				variant="outlined"
				href="http://localhost:3000/api/auth/google"
				fullWidth
				startIcon={<Google />}
			>
				Continue with Google
			</Button>
		</Box>
	);
};

export default LoginForm;
