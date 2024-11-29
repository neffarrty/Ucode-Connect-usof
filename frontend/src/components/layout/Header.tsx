import React from 'react';
import { Box, AppBar, Toolbar, Typography, Avatar, Badge } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import logo from '../../assets/header-logo.svg';

export const Header: React.FC = () => {
	const { user } = useSelector((state: RootState) => state.auth);

	return (
		<Box>
			<AppBar
				position="fixed"
				sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
			>
				<Toolbar>
					<Box
						sx={{
							display: 'flex',
							flexGrow: 1,
						}}
					>
						<Box component="a" href="/">
							<Box
								component="img"
								src={logo}
								sx={{ justifySelf: 'center' }}
							/>
						</Box>
					</Box>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
						<Typography
							variant="subtitle1"
							component="span"
							sx={{
								flexGrow: 1,
							}}
						>
							{user?.login}
						</Typography>
						<Avatar
							alt={user?.login}
							src={user?.avatar}
							sx={{ border: '2px solid #fff' }}
						/>
					</Box>
				</Toolbar>
			</AppBar>
		</Box>
	);
};
