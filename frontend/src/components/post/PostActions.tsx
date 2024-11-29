import { Stack } from '@mui/material';
import { Post } from '../../interface/Post';
import { ShareButton } from '../ShareButton';
import { BookmarkButton } from './BookmarkButton';
import { PostRateButtons } from './PostRateButtons';

interface PostPageActionsProps {
	post: Post;
}

export const PostActions: React.FC<PostPageActionsProps> = ({ post }) => {
	return (
		<Stack direction="row" justifyContent="space-between">
			<PostRateButtons post={post} />
			<Stack direction="row">
				<BookmarkButton post={post} />
				<ShareButton url={`http://localhost:3001/posts/${post.id}`} />
			</Stack>
		</Stack>
	);
};
