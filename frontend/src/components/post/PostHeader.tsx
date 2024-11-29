import { Avatar, Stack, Typography } from '@mui/material';
import { formatDate } from '../../utils/dates';
import { AccessTime } from '@mui/icons-material';
import { Post } from '../../interface/Post';
import { Category } from '../../interface/Category';
import axios from '../../utils/axios';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

interface PostPageHeaderProps {
	post: Post;
}

export const PostHeader: React.FC<PostPageHeaderProps> = ({ post }) => {
	const { data: categories } = useQuery<Category[], AxiosError>({
		queryKey: ['post_categories', post.id],
		queryFn: async () => {
			const { data } = await axios.get<Category[]>(
				`/posts/${post.id}/categories`,
			);

			return data;
		},
	});

	return (
		<Stack direction="row" gap={1} sx={{ width: '100%', p: 2 }}>
			<Avatar src={post.author.avatar} alt={post.author.login} />
			<Stack
				direction="row"
				sx={{
					flexGrow: 1,
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<Typography>{post.author.login}</Typography>
				<Typography
					color="text.secondary"
					sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
				>
					<AccessTime />
					Posted {formatDate(new Date(post.createdAt))}
				</Typography>
			</Stack>
		</Stack>
	);
};
