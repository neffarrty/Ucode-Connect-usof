import { Box, Button, Typography } from '@mui/material';
import { Create } from '@mui/icons-material';

interface PostsHeaderProps {
	count: number;
}

export const PostsHeader: React.FC<PostsHeaderProps> = ({ count }) => {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', px: 3 }}>
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
		</Box>
	);
};
