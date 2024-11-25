import { styled, alpha } from '@mui/material/styles';
import {
	InputBase,
	Box,
	AppBar,
	Toolbar,
	IconButton,
	Typography,
	Avatar,
	Badge,
} from '@mui/material';
import { Menu } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const Search = styled('div')(({ theme }) => ({
	position: 'relative',
	borderRadius: theme.shape.borderRadius,
	backgroundColor: alpha(theme.palette.common.white, 0.15),
	'&:hover': {
		backgroundColor: alpha(theme.palette.common.white, 0.25),
	},
	marginLeft: 0,
	width: '100%',
	[theme.breakpoints.up('sm')]: {
		marginLeft: theme.spacing(1),
		width: 'auto',
	},
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
	padding: theme.spacing(0, 2),
	height: '100%',
	position: 'absolute',
	pointerEvents: 'none',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: 'inherit',
	width: '100%',
	'& .MuiInputBase-input': {
		padding: theme.spacing(1, 1, 1, 0),
		paddingLeft: `calc(1em + ${theme.spacing(4)})`,
		transition: theme.transitions.create('width'),
		[theme.breakpoints.up('sm')]: {
			width: '12ch',
			'&:focus': {
				width: '20ch',
			},
		},
	},
}));

interface HeaderProps {
	toggleSidebar: (isOpen: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
	const { user } = useSelector((state: RootState) => state.auth);

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static">
				<Toolbar>
					<IconButton
						size="large"
						edge="start"
						color="inherit"
						aria-label="open drawer"
						sx={{ mr: 2 }}
						onClick={() => toggleSidebar(true)}
					>
						<Menu />
					</IconButton>
					<Typography
						variant="h6"
						noWrap
						component="div"
						sx={{
							flexGrow: 1,
							display: { xs: 'none', sm: 'block' },
						}}
					>
						MUI
					</Typography>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
						<Typography
							variant="subtitle1"
							component="span"
							sx={{
								flexGrow: 1,
								display: { xs: 'none', sm: 'block' },
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
