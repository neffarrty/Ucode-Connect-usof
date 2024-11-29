import {
	Card,
	CardHeader,
	Avatar,
	CardContent,
	Typography,
	CardActions,
	Box,
	Chip,
	Tooltip,
	Skeleton,
} from '@mui/material';
import { Star, Forum } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import axios from '../../utils/axios';

import { Post } from '../../interface/Post';
import { Comment } from '../../interface/Comment';
import { Category } from '../../interface/Category';
import { Paginated } from '../../interface/Paginated';
import { PostCardActions } from './PostCardActions';
import { formatDate } from '../../utils/dates';

interface PostCardProps {
	post: Post;
}

interface QueryData {
	categories: Category[];
	comments: Paginated<Comment>;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
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
					subheader={formatDate(new Date(post.createdAt))}
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
					<PostCardActions post={post} />
				</CardActions>
			</Box>
			<Box
				sx={{
					width: 80,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					p: 2,
				}}
			>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: 0.5,
						mb: 2,
						color: 'text.primary',
					}}
				>
					<Star color="primary" />
					<Typography variant="body1">{post.rating}</Typography>
				</Box>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
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
	);
};