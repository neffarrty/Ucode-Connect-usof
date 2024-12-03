import { Container } from '@mui/material';
import RegisterForm from '../../components/auth/RegisterForm';

export const Register: React.FC = () => {
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
			<RegisterForm />
		</Container>
	);
};
