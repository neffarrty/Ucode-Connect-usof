import { Bookmark, BookmarkBorder } from '@mui/icons-material';
import {
	Alert,
	Box,
	Button,
	IconButton,
	Snackbar,
	SnackbarCloseReason,
	Tooltip,
} from '@mui/material';
import { useState } from 'react';
import { Post } from '../../interface/Post';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import axios from '../../utils/axios';
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
