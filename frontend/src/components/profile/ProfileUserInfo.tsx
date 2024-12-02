import React from 'react';
import { Paper, Stack, Typography, Chip } from '@mui/material';
import { User } from '../../interface/User';
import { Grade } from '@mui/icons-material';
import { getMembershipDuration } from '../../utils/dates';
import { ProfileAvatar } from './FrofileAvatar';
import { UpdateUserButton } from './UpdateUserButton';

interface ProfileUserInfoProps {
	user: User;
}

export const ProfileUserInfo: React.FC<ProfileUserInfoProps> = ({ user }) => {
	return (
		<Paper
			sx={{
				display: 'flex',
				gap: 2,
				p: 3,
				height: '100%',
				alignItems: 'center',
				border: '1px solid',
				borderColor: 'divider',
				position: 'relative',
			}}
		>
			<ProfileAvatar user={user} />
			<Stack direction="column" gap={0.5}>
				<Stack direction="row" gap={1} alignItems="center">
					<Typography
						variant="h6"
						fontWeight="bold"
						color="text.dark"
					>
						{user.login}
					</Typography>
					<Chip label={user.role} size="small" />
				</Stack>
				<Typography color="text.secondary">
					{user.fullname || 'No fullname'}
				</Typography>
				<Stack direction="row" alignItems="center" gap={0.5}>
					<Grade sx={{ color: 'gold' }} />
					<Typography color="primary" fontWeight="bold">
						{user.rating}
					</Typography>
				</Stack>
				<Typography variant="body2" color="text.secondary">
					{getMembershipDuration(new Date(user.createdAt))}
				</Typography>
				<UpdateUserButton user={user} />
			</Stack>
		</Paper>
	);
};
