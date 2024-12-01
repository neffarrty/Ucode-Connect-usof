import React from 'react';
import {
	Box,
	Divider,
	Drawer,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Toolbar,
} from '@mui/material';
import { Home, Article, Bookmarks, Style, Logout } from '@mui/icons-material';

interface SideBarProps {
	width: number;
}

export const SideBar: React.FC<SideBarProps> = ({ width }) => {
	return (
		<Drawer
			variant="permanent"
			sx={{
				width: width,
				flexShrink: 0,
				[`& .MuiDrawer-paper`]: {
					width: width,
					boxSizing: 'border-box',
				},
			}}
		>
			<Toolbar />
			<Box
				sx={{
					overflow: 'auto',
					display: 'flex',
					flexDirection: 'column',
					height: '100%',
				}}
			>
				<List
					sx={{
						width: '100%',
						bgcolor: 'background.paper',
					}}
					component="nav"
				>
					<ListItemButton href="/home">
						<ListItemIcon>
							<Home />
						</ListItemIcon>
						<ListItemText primary="Home" />
					</ListItemButton>
					<ListItemButton href="/posts">
						<ListItemIcon>
							<Article />
						</ListItemIcon>
						<ListItemText primary="Posts" />
					</ListItemButton>
					<ListItemButton href="/bookmarks">
						<ListItemIcon>
							<Bookmarks />
						</ListItemIcon>
						<ListItemText primary="Bookmarks" />
					</ListItemButton>
					<ListItemButton href="/categories">
						<ListItemIcon>
							<Style />
						</ListItemIcon>
						<ListItemText primary="Categories" />
					</ListItemButton>
				</List>
			</Box>
		</Drawer>
	);
};
