import {
	Box,
	Divider,
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from '@mui/material';
import { Inbox, Mail } from '@mui/icons-material';

interface SideBarProps {
	toggle: (isOpen: boolean) => void;
	open: boolean;
}

export const SideBar: React.FC<SideBarProps> = ({ toggle, open }) => {
	const DrawerList = (
		<Box
			sx={{ width: 250 }}
			role="presentation"
			onClick={() => toggle(false)}
		>
			<List>
				{['Inbox', 'Starred', 'Send email', 'Drafts'].map(
					(text, index) => (
						<ListItem key={text} disablePadding>
							<ListItemButton>
								<ListItemIcon>
									{index % 2 === 0 ? <Inbox /> : <Mail />}
								</ListItemIcon>
								<ListItemText primary={text} />
							</ListItemButton>
						</ListItem>
					),
				)}
			</List>
			<Divider />
			<List>
				{['All mail', 'Trash', 'Spam'].map((text, index) => (
					<ListItem key={text} disablePadding>
						<ListItemButton>
							<ListItemIcon>
								{index % 2 === 0 ? <Inbox /> : <Mail />}
							</ListItemIcon>
							<ListItemText primary={text} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Box>
	);

	return (
		<Drawer open={open} onClose={() => toggle(false)}>
			{DrawerList}
		</Drawer>
	);
};
