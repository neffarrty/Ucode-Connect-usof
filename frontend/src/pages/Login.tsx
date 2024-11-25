import { Container } from '@mui/material';
import LoginForm from '../components/auth/LoginForm';

export const Login: React.FC = () => {
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
			<LoginForm />
		</Container>
	);
};
