import { Button, Container, Box } from '@mui/material';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { useState } from 'react';
import { SideBar } from '../components/SideBar';

export const Dashboard: React.FC = () => {
	const [openSidebar, setOpenSidebar] = useState(false);

	const toggleSidebar = (isOpen: boolean) => {
		setOpenSidebar(isOpen);
	};

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				minHeight: '100vh',
				width: '100%',
				maxWidth: '100%',
			}}
		>
			<SideBar toggle={toggleSidebar} open={openSidebar} />
			<Header toggleSidebar={toggleSidebar} />
			<Container sx={{ flexGrow: 1 }}>
				<Button>Hello</Button>
			</Container>
			<Footer />
		</Box>
	);
};
