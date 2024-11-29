import {
	Alert,
	Box,
	Button,
	CircularProgress,
	Container,
	Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../utils/axios';
import logo from '../../assets/logo.svg';
import React from 'react';

export const Verify: React.FC = () => {
	const { token } = useParams();
	const [success, setSuccess] = useState(false);

	const { mutate, isPending, error } = useMutation<AxiosResponse, any, void>({
		mutationFn: () => axios.post(`/auth/verify/${token}`),
		onSuccess: () => {
			setSuccess(true);
		},
	});

	useEffect(() => {
		if (token) {
			console.log(token);
			mutate();
		}
	}, [token, mutate]);

	return (
		<Container
			component="main"
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				minHeight: '100vh',
				padding: 3,
			}}
		>
			<Box
				width="md"
				sx={{
					width: '100%',
					boxShadow: 3,
					borderRadius: 2,
					padding: 4,
					backgroundColor: 'white',
					textAlign: 'center',
				}}
			>
				<Box
					component="img"
					src={logo}
					alt="logo"
					sx={{ width: 350, marginBottom: 2 }}
				/>
				{error ? (
					<React.Fragment>
						<Alert severity="error" sx={{ marginBottom: 2 }}>
							{error.response?.data?.message || error.message}
						</Alert>
						<Button
							href="/login"
							variant="contained"
							color="primary"
						>
							Go to Login
						</Button>
					</React.Fragment>
				) : (
					<React.Fragment>
						<Typography
							component="h1"
							variant="h4"
							sx={{ fontWeight: 700, mb: 1 }}
						>
							Welcome to Our Community!
						</Typography>
						<Typography
							variant="body1"
							sx={{ color: 'text.secondary', mb: 3 }}
						>
							We're excited to have you join us. Please wait while
							we verify your account.
						</Typography>
						{success && (
							<Alert severity="success" sx={{ mb: 2 }}>
								Your account has been successfully verified. You
								can now log in.
							</Alert>
						)}
						<Button
							href="/login"
							variant="contained"
							color="primary"
							disabled={isPending}
						>
							{isPending ? (
								<CircularProgress size={24} />
							) : (
								'Go to Login'
							)}
						</Button>
					</React.Fragment>
				)}
			</Box>
		</Container>
	);
};
