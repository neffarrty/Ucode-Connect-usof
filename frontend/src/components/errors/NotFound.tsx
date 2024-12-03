import React from 'react';
import { Container, Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
	const navigate = useNavigate();

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
				<React.Fragment>
					<Typography
						component="h1"
						variant="h1"
						sx={{ fontWeight: 700, mb: 1, color: 'primary.main' }}
					>
						Oops!
					</Typography>
					<Typography
						component="h2"
						variant="h3"
						sx={{ fontWeight: 700, mb: 1 }}
					>
						404 - Page Not Found
					</Typography>
					<Typography
						variant="body1"
						sx={{ color: 'text.secondary', mb: 3 }}
					>
						The page you're looking for might have been removed, had
						it's name changed or is temporarly unavailabe.
					</Typography>
					<Button
						href="/login"
						variant="contained"
						color="primary"
						onClick={() => navigate(-1)}
					>
						Go back
					</Button>
				</React.Fragment>
			</Box>
		</Container>
	);
};

export default NotFound;
