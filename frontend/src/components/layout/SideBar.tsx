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
import { Home, Article, Bookmarks, Style, People } from '@mui/icons-material';

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
					{[
						{ href: '/home', icon: <Home />, text: 'Home' },
						{ href: '/posts', icon: <Article />, text: 'Posts' },
						{
							href: '/categories',
							icon: <Style />,
							text: 'Categories',
						},
						{ href: '/users', icon: <People />, text: 'Users' },
					].map(({ href, icon, text }) => (
						<ListItemButton key={href} href={href}>
							<ListItemIcon>{icon}</ListItemIcon>
							<ListItemText primary={text} />
						</ListItemButton>
					))}
					<Divider />
					{[
						{
							href: '/bookmarks',
							icon: <Bookmarks />,
							text: 'Bookmarks',
						},
					].map(({ href, icon, text }) => (
						<ListItemButton key={href} href={href}>
							<ListItemIcon>{icon}</ListItemIcon>
							<ListItemText primary={text} />
						</ListItemButton>
					))}
				</List>
			</Box>
		</Drawer>
	);
};
