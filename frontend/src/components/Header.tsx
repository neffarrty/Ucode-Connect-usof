import { styled, alpha } from '@mui/material/styles';
import {
	InputBase,
	Box,
	AppBar,
	Toolbar,
	Typography,
	Avatar,
	Badge,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import logo from '../assets/header-logo.svg';

// const Search = styled('div')(({ theme }) => ({
// 	position: 'relative',
// 	borderRadius: theme.shape.borderRadius,
// 	backgroundColor: alpha(theme.palette.common.white, 0.15),
// 	'&:hover': {
// 		backgroundColor: alpha(theme.palette.common.white, 0.25),
// 	},
// 	marginLeft: 0,
// 	width: '100%',
// 	[theme.breakpoints.up('sm')]: {
// 		marginLeft: theme.spacing(1),
// 		width: 'auto',
// 	},
// }));

// const SearchIconWrapper = styled('div')(({ theme }) => ({
// 	padding: theme.spacing(0, 2),
// 	height: '100%',
// 	position: 'absolute',
// 	pointerEvents: 'none',
// 	display: 'flex',
// 	alignItems: 'center',
// 	justifyContent: 'center',
// }));

// const StyledInputBase = styled(InputBase)(({ theme }) => ({
// 	color: 'inherit',
// 	width: '100%',
// 	'& .MuiInputBase-input': {
// 		padding: theme.spacing(1, 1, 1, 0),
// 		paddingLeft: `calc(1em + ${theme.spacing(4)})`,
// 		transition: theme.transitions.create('width'),
// 		[theme.breakpoints.up('sm')]: {
// 			width: '12ch',
// 			'&:focus': {
// 				width: '20ch',
// 			},
// 		},
// 	},
// }));

export const Header: React.FC = () => {
	const { user } = useSelector((state: RootState) => state.auth);

	return (
		<Box sx={{ flexGrow: 1 }}>
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
						<Badge
							overlap="circular"
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'right',
							}}
							badgeContent={<AdminPanelSettingsIcon />}
						>
							<Avatar alt={user?.login} src={user?.avatar} />
						</Badge>
					</Box>
				</Toolbar>
			</AppBar>
		</Box>
	);
};
