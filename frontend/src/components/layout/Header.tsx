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
	Stack,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import logo from '../../assets/header-logo.svg';
import { AccountCircle, ExitToApp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/auth/actions';
import { AppDispatch } from '../../redux/store';
import { SearchInput } from '../SearchInput';

export const Header: React.FC = () => {
	const { user } = useSelector((state: any) => state.auth);
	const dispatch = useDispatch<AppDispatch>();
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

	const handleLogout = async () => {
		dispatch(logout()).then(() => {
			navigate('/login');
		});
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
					<Stack
						direction="row"
						sx={{ alignItems: 'center', gap: 1 }}
					>
						<SearchInput />
						<Stack direction="column" sx={{ alignItems: 'end' }}>
							<Typography
								variant="subtitle1"
								component="span"
								sx={{ flexGrow: 1 }}
							>
								{user.login}
							</Typography>{' '}
							<Typography
								variant="caption"
								component="span"
								sx={{ flexGrow: 1 }}
							>
								{user.role}
							</Typography>
						</Stack>
						<IconButton onClick={handleOpenUserMenu}>
							<Avatar
								alt={user.login}
								src={user.avatar}
								sx={{
									border: '2px solid #fff',
									width: 50,
									height: 50,
								}}
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
							<MenuItem
								onClick={() => navigate(`/users/${user.id}`)}
							>
								<AccountCircle sx={{ mr: 1 }} />
								<Typography sx={{ textAlign: 'center' }}>
									Profile
								</Typography>
							</MenuItem>
							<MenuItem onClick={handleLogout}>
								<ExitToApp
									sx={{ mr: 1, color: 'primary.dark' }}
								/>
								<Typography sx={{ textAlign: 'center' }}>
									Log Out
								</Typography>
							</MenuItem>
						</Menu>
					</Stack>
				</Toolbar>
			</AppBar>
		</Box>
	);
};
