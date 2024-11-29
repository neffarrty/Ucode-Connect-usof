import React from 'react';
import { Box, Button } from '@mui/material';
import { Post } from '../../interface/Post';
import { ShareButton } from '../ShareButton';
import { BookmarkButton } from '../post/BookmarkButton';

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
			<BookmarkButton post={post} />
			<ShareButton url={`http://localhost:3001/posts/${post.id}`} />
			<Box sx={{ flexGrow: 1 }} />
			<Button
				href={`http://localhost:3001/posts/${post.id}`}
				size="small"
			>
				Learn More
			</Button>
		</Box>
	);
};
