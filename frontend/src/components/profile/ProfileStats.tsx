import React, { useState } from 'react';
import { Box, Paper, Tab, Tabs, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { UserPostsChart } from './UserPostsChart';
import { UserCommentsChart } from './UserCommentsChart';

export const ProfileStats: React.FC = () => {
	const { user } = useSelector((state: any) => state.auth);
	const [value, setValue] = useState(0);

	const handleChange = (_event: React.SyntheticEvent, value: number) => {
		setValue(value);
	};

	return (
		<Paper
			sx={{
				display: 'flex',
				flexDirection: 'column',
				height: '100%',
				border: '1px solid',
				borderColor: 'divider',
			}}
		>
			<Tabs
				value={value}
				onChange={handleChange}
				variant="scrollable"
				scrollButtons
				allowScrollButtonsMobile
			>
				<Tab label="Posts" sx={{ width: '50%' }} />
				<Tab label="Comments" sx={{ width: '50%' }} />
			</Tabs>

			<Box sx={{ height: 300, mb: 2, p: 2 }}>
				{value === 0 && (
					<>
						<Box sx={{ px: 6 }}>
							<Typography variant="h6" gutterBottom>
								Your Posts Over the Past Year
							</Typography>
							<Typography
								variant="body2"
								color="text.secondary"
								gutterBottom
							>
								This chart shows how many posts you've written
								each month in the past year. Pretty cool to see
								your activity, right?
							</Typography>
						</Box>

						<UserPostsChart user={user} />
					</>
				)}
				{value === 1 && (
					<>
						<Box sx={{ px: 6 }}>
							<Typography variant="h6" gutterBottom>
								Your Comments Over the Past Year
							</Typography>
							<Typography
								variant="body2"
								color="text.secondary"
								gutterBottom
							>
								Here's a look at how many comments you've made
								every month over the last year. Keep the
								conversation going!
							</Typography>
						</Box>
						<UserCommentsChart user={user} />
					</>
				)}
			</Box>
		</Paper>
	);
};
