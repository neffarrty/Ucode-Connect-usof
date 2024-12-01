import React from 'react';
import { Stack } from '@mui/material';
import { Post } from '../../interface/Post';
import { ShareButton } from '../ShareButton';
import { BookmarkButton } from './BookmarkButton';
import { PostRateButtons } from './PostRateButtons';
import { useSelector } from 'react-redux';
import { DeletePostButton } from './DeletePostButton';
import { UpdatePostButton } from './UpdatePostButton';

interface PostPageActionsProps {
	post: Post;
}

export const PostActions: React.FC<PostPageActionsProps> = ({ post }) => {
	const { user } = useSelector((state: any) => state.auth);

	return (
		<Stack direction="row" justifyContent="space-between">
			<PostRateButtons post={post} />
			<Stack direction="row">
				<BookmarkButton post={post} />
				<ShareButton url={`http://localhost:3001/posts/${post.id}`} />
				{(user.role === 'ADMIN' || user.id === post.authorId) && (
					<Stack
						direction="row"
						sx={{ flexGrow: 1, justifyContent: 'end' }}
					>
						<UpdatePostButton post={post} />
						<DeletePostButton post={post} />
					</Stack>
				)}
			</Stack>
		</Stack>
	);
};
