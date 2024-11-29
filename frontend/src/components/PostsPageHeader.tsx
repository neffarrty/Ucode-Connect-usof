import React from 'react';
import {
	Box,
	Button,
	ButtonGroup,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import { Create, Search, FilterAlt } from '@mui/icons-material';

interface PostsPageHeaderProps {
	count: number;
}

export const PostsPageHeader: React.FC<PostsPageHeaderProps> = ({ count }) => {
	return (
		<Stack direction="column" gap={0.5} sx={{ px: 3 }}>
			<Box
				sx={{
					width: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
			>
				<Typography variant="h4" color="primary.dark">
					All posts
				</Typography>
				<Button variant="outlined" startIcon={<Create />}>
					Create post
				</Button>
			</Box>
			<Box
				sx={{
					width: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
			>
				<Typography variant="subtitle1" color="text.secondary">
					{`${new Intl.NumberFormat('en-US').format(count)} posts`}
				</Typography>
			</Box>
			<Stack
				direction="row"
				sx={{ justifyContent: 'space-between', maxHeight: 40 }}
			>
				<Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
					<Search sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
					<TextField label="Search by title" variant="standard" />
				</Box>
				<Stack direction="row" gap={0.5}>
					<ButtonGroup variant="outlined">
						<Button sx={{ width: 125 }}>Newest</Button>
						<Button sx={{ width: 125 }}>Most rated</Button>
					</ButtonGroup>
					<Button variant="contained" startIcon={<FilterAlt />}>
						Filter
					</Button>
				</Stack>
			</Stack>
		</Stack>
	);
};
