import React from 'react';
import {
	Box,
	AppBar,
	Toolbar,
	Typography,
	Avatar,
	Menu,
	MenuItem,
	IconButton,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import logo from '../../assets/header-logo.svg';
import { AccountCircle, ExitToApp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
	const { user } = useSelector((state: RootState) => state.auth);
	const navigate = useNavigate();
	const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
		null,
	);

	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	return (
		<Box>
			<AppBar
				position="fixed"
				sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
			>
				<Toolbar>
					<Box sx={{ display: 'flex', flexGrow: 1 }}>
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
							sx={{ flexGrow: 1 }}
						>
							{user?.login}
						</Typography>
						<IconButton onClick={handleOpenUserMenu}>
							<Avatar
								alt={user?.login}
								src={user?.avatar}
								sx={{ border: '2px solid #fff' }}
							/>
						</IconButton>
						<Menu
							sx={{ mt: '45px' }}
							anchorEl={anchorElUser}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							open={Boolean(anchorElUser)}
							onClose={handleCloseUserMenu}
						>
							<MenuItem onClick={() => navigate('/profile')}>
								<AccountCircle sx={{ mr: 1 }} />
								<Typography sx={{ textAlign: 'center' }}>
									Profile
								</Typography>
							</MenuItem>
							<MenuItem href="/profile">
								<ExitToApp
									sx={{ mr: 1, color: 'primary.dark' }}
								/>
								<Typography sx={{ textAlign: 'center' }}>
									Log Out
								</Typography>
							</MenuItem>
						</Menu>
					</Box>
				</Toolbar>
			</AppBar>
		</Box>
	);
};
