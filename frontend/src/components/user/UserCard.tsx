import { Avatar, Chip, Paper, Stack, Typography, Box } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom'; // Импортируем Link из react-router-dom
import { User } from '../../interface';
import { Grade } from '@mui/icons-material';
import { getMembershipDuration } from '../../utils/dates';

interface UserCardProps {
	user: User;
}

export const UserCard: React.FC<UserCardProps> = ({ user }) => {
	return (
		<Box
			component={Link}
			to={`/users/${user.id}`}
			sx={{
				textDecoration: 'none',
				color: 'inherit',
			}}
		>
			<Paper
				sx={{
					p: 2,
					border: '1px solid',
					borderColor: 'primary.light',
					boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
					transition:
						'transform 0.2s ease-out, box-shadow 0.2s ease-out',
					'&:hover': {
						transform: 'translateY(-8px)',
						boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
					},
					minHeight: 135,
					maxHeight: 135,
				}}
			>
				<Stack direction="row" gap={2}>
					<Avatar
						src={user.avatar}
						alt={user.login}
						variant="rounded"
						sx={{ width: 100, height: 100 }}
					/>
					<Stack direction="column">
						<Stack direction="row" gap={1} alignItems="center">
							<Typography
								variant="h6"
								fontWeight="bold"
								color="primary.dark"
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
						<Typography variant="caption" color="text.secondary">
							{getMembershipDuration(new Date(user.createdAt))}
						</Typography>
					</Stack>
				</Stack>
			</Paper>
		</Box>
	);
};
