import {
	Card,
	CardHeader,
	Avatar,
	IconButton,
	CardContent,
	Typography,
	CardActions,
	Button,
	Box,
	Chip,
	Divider,
	Tooltip,
	Skeleton,
	Snackbar,
	Alert,
	SnackbarCloseReason,
} from '@mui/material';
import {
	Bookmark,
	BookmarkBorder,
	Share,
	Star,
	Forum,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useState } from 'react';
import axios from '../utils/axios';

import { Post } from '../interface/Post';
import { Comment } from '../interface/Comment';
import { Category } from '../interface/Category';
import { SharePopover } from './SharePopover';
import { Paginated } from '../interface/Paginated';

interface PostCardProps {
	post: Post;
}

interface QueryData {
	categories: Category[];
	comments: Paginated<Comment>;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
	const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);
	const [bookmarked, setBookmarked] = useState(post.bookmarked);

	const [openSnackBar, setOpenSnackBar] = useState(false);

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

	const { isLoading, data } = useQuery<QueryData, AxiosError>({
		queryKey: ['post_data', post.id],
		queryFn: async () => {
			const [categories, comments] = await Promise.all([
				axios.get<Category[]>(`/posts/${post.id}/categories`),
				axios.get<Paginated<Comment>>(`/posts/${post.id}/comments`),
			]);

			return {
				categories: categories.data,
				comments: comments.data,
			};
		},
	});

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
		onError: (error, bookmarked, context) => {
			setBookmarked(!bookmarked);
		},
	});

	const truncateText = (text: string, limit: number) => {
		const words = text.split(' ');
		if (words.length <= limit) {
			return text;
		}
		return words.slice(0, limit).join(' ') + '...';
	};

	if (isLoading) {
		return <Skeleton variant="rectangular" height={300} />;
	}

	return (
		<>
			<Card
				sx={{
					display: 'flex',
					flexDirection: 'row',
					position: 'relative',
				}}
			>
				<Box sx={{ flex: 1 }}>
					<CardHeader
						avatar={<Avatar src={post.author.avatar} />}
						title={post.author.login}
						subheader={formatDistanceToNow(
							new Date(post.createdAt),
							{
								addSuffix: true,
							},
						)}
					/>
					<CardContent>
						<Box>
							<Box
								sx={{
									display: 'flex',
									gap: 1,
									color: 'text.secondary',
								}}
							>
								{data?.categories.map((category) => (
									<Tooltip
										key={category.id}
										title={category.description}
									>
										<Chip
											component="a"
											href={`http://localhost:3001/category/${category.id}`}
											label={category.title}
											variant="outlined"
											size="small"
											color="primary"
											clickable
										/>
									</Tooltip>
								))}
							</Box>
							<Typography
								variant="h6"
								sx={{ color: 'text.primary', mt: 1 }}
							>
								{post.title}
							</Typography>
							<Typography
								variant="body2"
								sx={{
									color: 'text.secondary',
									textAlign: 'justify',
								}}
							>
								{truncateText(post.content, 50)}
							</Typography>
						</Box>
					</CardContent>
					<CardActions disableSpacing>
						{bookmarked ? (
							<Tooltip title="Remove from bookmarks">
								<IconButton
									aria-label="remove from bookmarks"
									onClick={() => mutate(false)}
									disabled={isPending}
								>
									<Bookmark />
								</IconButton>
							</Tooltip>
						) : (
							<Tooltip title="Add to bookmarks">
								<IconButton
									aria-label="add to bookmarks"
									onClick={() => mutate(true)}
									disabled={isPending}
								>
									<BookmarkBorder
										sx={{ color: 'primary.dark' }}
									/>
								</IconButton>
							</Tooltip>
						)}
						<Tooltip title="Share">
							<IconButton
								aria-label="share"
								onClick={handleShareClick}
							>
								<Share />
							</IconButton>
						</Tooltip>
						<SharePopover
							anchor={anchor}
							setAnchor={setAnchor}
							url={`http://localhost:3001/posts/${post.id}`}
						/>
						<Button
							href={`http://localhost:3001/posts/${post.id}`}
							size="small"
						>
							Learn More
						</Button>
					</CardActions>
				</Box>
				<Divider orientation="vertical" variant="middle" />
				<Box
					sx={{
						width: 80,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'start',
						bgcolor: 'background.paper',
						borderColor: 'divider',
						p: 2,
					}}
				>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: 0.5,
							mb: 2,
							color: 'text.primary',
						}}
					>
						<Star color="primary" />
						<Typography variant="body1" sx={{ fontWeight: 'bold' }}>
							{post.rating}
						</Typography>
					</Box>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: 0.5,
							color: 'text.primary',
						}}
					>
						<Forum color="action" />
						<Typography variant="body1">
							{data?.comments.meta.total}
						</Typography>
					</Box>
				</Box>
			</Card>
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
		</>
	);
};
