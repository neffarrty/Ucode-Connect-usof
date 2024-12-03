import React, { useState } from 'react';
import { Box, Paper, Tab, Tabs, Typography } from '@mui/material';
import { UserPostsChart } from './UserPostsChart';
import { UserCommentsChart } from './UserCommentsChart';
import { User } from '../../interface';

interface ProfileStatsProps {
	user: User;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({ user }) => {
	const [value, setValue] = useState(0);

	const handleChange = (_event: React.SyntheticEvent, value: number) => {
		setValue(value);
	};

	return (
		<Paper
			sx={{
				display: 'flex',
				flexDirection: 'column',
				pb: 10,
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
							<Typography
								variant="body2"
								color="text.secondary"
								gutterBottom
							>
								This chart shows how many posts
								{` ${user.login} `}
								written each month in the past year.
							</Typography>
						</Box>
						<UserPostsChart user={user} />
					</>
				)}
				{value === 1 && (
					<>
						<Box sx={{ px: 6 }}>
							<Typography
								variant="body2"
								color="text.secondary"
								gutterBottom
							>
								Here's a look at how many comments
								{` ${user.login} `} made every month over the
								last year.
							</Typography>
						</Box>
						<UserCommentsChart user={user} />
					</>
				)}
			</Box>
		</Paper>
	);
};
