import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import { Header } from './Header';
import { SideBar } from './SideBar';
import { Footer } from './Footer';

interface LayoutProps {
	children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				minHeight: '100vh',
			}}
		>
			<CssBaseline />
			<Header />
			<Box sx={{ display: 'flex', flex: 1, pt: 8, height: '100%' }}>
				<SideBar width={200} />
				<Box
					sx={{
						flexGrow: 1,
						p: 3,
					}}
				>
					{children}
				</Box>
			</Box>
			<Footer />
		</Box>
	);
};

export default Layout;
