import React from 'react';
import { Avatar, Stack, Typography } from '@mui/material';
import { AccessTime } from '@mui/icons-material';
import { Post } from '../../interface';
import { formatDate } from '../../utils/dates';

interface PostPageHeaderProps {
	post: Post;
}

export const PostHeader: React.FC<PostPageHeaderProps> = ({ post }) => {
	return (
		<Stack direction="row" gap={1} sx={{ width: '100%', p: 2 }}>
			<Avatar src={post.author.avatar} alt={post.author.login} />
			<Stack
				direction="row"
				sx={{
					flexGrow: 1,
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<Typography>{post.author.login}</Typography>
				<Typography
					color="text.secondary"
					sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
				>
					<AccessTime />
					Posted {formatDate(new Date(post.createdAt))}
				</Typography>
			</Stack>
		</Stack>
	);
};
