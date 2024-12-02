import React from 'react';
import { Box, Button } from '@mui/material';
import { Post } from '../../interface/Post';
import { ShareButton } from '../post/ShareButton';
import { BookmarkButton } from '../post/BookmarkButton';
import { ArrowRightAlt } from '@mui/icons-material';

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
				variant="outlined"
				endIcon={<ArrowRightAlt />}
			>
				Learn More
			</Button>
		</Box>
	);
};
