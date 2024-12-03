import React from 'react';
import {
	Box,
	Button,
	CircularProgress,
	Paper,
	Stack,
	Typography,
} from '@mui/material';
import { Layout } from '../../components/layout/Layout';
import { ProfileStats } from '../../components/profile/ProfileStats';
import { ProfileUserInfo } from '../../components/profile/ProfileUserInfo';
import { ProfilePostsSlider } from '../../components/profile/ProfilePostsSlider';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { User } from '../../interface';
import { AxiosError } from 'axios';
import axios from '../../utils/axios';
import { East } from '@mui/icons-material';

export const ProfilePage: React.FC = () => {
	const { id } = useParams<{ id: string }>();

	const { data: user, isLoading } = useQuery<User, AxiosError>({
		queryKey: ['user', id],
		queryFn: async () => {
			const { data } = await axios.get<User>(`/users/${id}`);
			return data;
		},
	});

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
				{isLoading ? (
					<Box
						sx={{
							display: 'flex',
							flexGrow: 1,
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<CircularProgress size={24} />
					</Box>
				) : user ? (
					<Stack
						direction="row"
						sx={{
							flexGrow: 1,
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
								<ProfileUserInfo user={user} />
							</Stack>
							<Stack
								direction="column"
								gap={1}
								sx={{ flexGrow: 1 }}
							>
								<Stack
									direction="row"
									sx={{ justifyContent: 'space-between' }}
								>
									<Typography
										variant="h5"
										fontWeight="bold"
										color="primary.dark"
									>
										Most rated posts
									</Typography>
									<Button
										href={`/users/${id}/posts`}
										endIcon={<East />}
									>
										See all
									</Button>
								</Stack>

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
										<ProfilePostsSlider user={user} />
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
							<ProfileStats user={user} />
						</Stack>
					</Stack>
				) : (
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
							flexGrow: 1,
						}}
					>
						<Typography variant="h6" color="text.secondary">
							No categories found
						</Typography>
					</Box>
				)}
			</Box>
		</Layout>
	);
};
