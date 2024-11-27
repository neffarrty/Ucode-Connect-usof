import { Bookmark, BookmarkBorder, Share } from '@mui/icons-material';
import {
	Alert,
	Box,
	Button,
	IconButton,
	Snackbar,
	SnackbarCloseReason,
	Tooltip,
} from '@mui/material';
import { SharePopover } from '../SharePopover';
import { useState } from 'react';
import { Post } from '../../interface/Post';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import axios from '../../utils/axios';

interface PostCardActionsProps {
	post: Post;
}

export const PostCardActions: React.FC<PostCardActionsProps> = ({ post }) => {
	const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);
	const [openSnackBar, setOpenSnackBar] = useState(false);
	const [bookmarked, setBookmarked] = useState(post.bookmarked);

	const handleCloseSnackbar = (
		event: React.SyntheticEvent | Event,
		reason?: SnackbarCloseReason,
	) => {
		if (reason === 'clickaway') {
			return;
		}
		setOpenSnackBar(false);
	};

	const handleShareClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchor(event.currentTarget);
	};

	const { mutate, isPending } = useMutation<void, AxiosError, boolean>({
		mutationFn: async (bookmarked: boolean) => {
			if (bookmarked) {
				await axios.post(`/posts/${post.id}/bookmarks`);
			} else {
				await axios.delete(`/posts/${post.id}/bookmarks`);
			}
		},
		onMutate: (bookmarked: boolean) => {
			setOpenSnackBar(true);
			setBookmarked(bookmarked);
		},
		onError: (_error, bookmarked, _context) => {
			setBookmarked(!bookmarked);
		},
	});

	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				width: '100%',
			}}
		>
			{bookmarked ? (
				<Tooltip title="Remove from bookmarks">
					<IconButton
						aria-label="remove from bookmarks"
						onClick={() => mutate(false)}
						disabled={isPending}
					>
						<Bookmark sx={{ color: 'primary.dark' }} />
					</IconButton>
				</Tooltip>
			) : (
				<Tooltip title="Add to bookmarks">
					<IconButton
						aria-label="add to bookmarks"
						onClick={() => mutate(true)}
						disabled={isPending}
					>
						<BookmarkBorder sx={{ color: 'primary.dark' }} />
					</IconButton>
				</Tooltip>
			)}
			<Tooltip title="Share">
				<IconButton aria-label="share" onClick={handleShareClick}>
					<Share sx={{ color: 'primary.dark' }} />
				</IconButton>
			</Tooltip>
			<SharePopover
				anchor={anchor}
				setAnchor={setAnchor}
				url={`http://localhost:3001/posts/${post.id}`}
			/>
			<Box sx={{ flexGrow: 1 }} />
			<Button
				href={`http://localhost:3001/posts/${post.id}`}
				size="small"
			>
				Learn More
			</Button>
			<Snackbar
				open={openSnackBar}
				autoHideDuration={3000}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
				onClose={handleCloseSnackbar}
			>
				<Alert onClose={handleCloseSnackbar}>
					{bookmarked
						? `Post '${post.title}' added to your bookmarks`
						: `Post '${post.title}' removed from your bookmarks`}
				</Alert>
			</Snackbar>
		</Box>
	);
};
