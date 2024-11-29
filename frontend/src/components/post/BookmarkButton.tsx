import {
	Alert,
	Box,
	IconButton,
	Snackbar,
	SnackbarCloseReason,
	Tooltip,
} from '@mui/material';
import { Post } from '../../interface/Post';
import { Bookmark, BookmarkBorder } from '@mui/icons-material';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import axios from '../../utils/axios';
import { useState } from 'react';

interface BookmarkButtonProps {
	post: Post;
}

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({ post }) => {
	const [openSnackBar, setOpenSnackBar] = useState(false);
	const [bookmarked, setBookmarked] = useState(post.bookmarked);

	const handleCloseSnackbar = (
		_event: React.SyntheticEvent | Event,
		reason?: SnackbarCloseReason,
	) => {
		if (reason === 'clickaway') {
			return;
		}
		setOpenSnackBar(false);
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
		<Box>
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
