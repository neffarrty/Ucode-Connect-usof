import React from 'react';
import { Box, Paper, Stack, Typography } from '@mui/material';
import { Layout } from '../components/layout/Layout';
import { ProfileStats } from '../components/profile/ProfileStats';
import { ProfileUserInfo } from '../components/profile/ProfileUserInfo';
import { ProfilePostsSlider } from '../components/profile/ProfilePostsSlider';

export const ProfilePage: React.FC = () => {
	return (
		<Layout>
			<Box
				sx={{
					display: 'flex',
					flex: 1,
					height: '100%',
					px: 1.5,
					py: 1,
					gap: 2,
				}}
			>
				<Stack
					component="main"
					direction="column"
					sx={{
						flexGrow: 1,
						gap: 2,
					}}
				>
					<Stack direction="column" gap={1}>
						<Typography
							variant="h5"
							fontWeight="bold"
							color="primary.dark"
						>
							Profile
						</Typography>
						<ProfileUserInfo />
					</Stack>
					<Stack direction="column" gap={1} sx={{ flexGrow: 1 }}>
						<Typography
							variant="h5"
							fontWeight="bold"
							color="primary.dark"
						>
							Most rated posts
						</Typography>
						<Paper
							sx={{
								display: 'flex',
								flexDirection: 'column',
								gap: 2,
								p: 1,
								height: '100%',
								border: '1px solid',
								borderColor: 'divider',
							}}
						>
							<Box
								sx={{
									position: 'relative',
									overflow: 'hidden',
									width: '100%',
									maxWidth: 600,
									margin: '0 auto',
								}}
							>
								<ProfilePostsSlider />
							</Box>
						</Paper>
					</Stack>
				</Stack>
				<Stack
					direction="column"
					gap={1}
					sx={{
						height: '100%',
						width: '50%',
						bgcolor: 'background.paper',
						borderRadius: 2,
					}}
				>
					<Typography
						variant="h5"
						fontWeight="bold"
						color="primary.dark"
					>
						Stats
					</Typography>
					<ProfileStats />
				</Stack>
			</Box>
		</Layout>
	);
};
