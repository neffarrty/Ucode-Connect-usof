import React from 'react';
import { Box, Chip, Stack } from '@mui/material';
import { Post } from '../../interface/Post';
import { ShareButton } from '../post/ShareButton';
import { BookmarkButton } from '../post/BookmarkButton';
import { VisibilityOff } from '@mui/icons-material';

interface PostCardActionsProps {
	post: Post;
}

export const PostCardActions: React.FC<PostCardActionsProps> = ({ post }) => {
	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				width: '100%',
			}}
		>
			{post.status === 'ACTIVE' ? (
				<Stack direction="row">
					<BookmarkButton post={post} />
					<ShareButton url={`/posts/${post.id}`} />
				</Stack>
			) : (
				<Chip
					icon={<VisibilityOff sx={{ fontSize: 16 }} />}
					label={post.status}
					variant="outlined"
					sx={{
						mb: 1,
						alignItems: 'center',
					}}
				/>
			)}
		</Box>
	);
};
