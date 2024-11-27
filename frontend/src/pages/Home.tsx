import { Box, Stack } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { PostCard } from '../components/post-card/PostCard';
import { AxiosError } from 'axios';
import axios from '../utils/axios';
import { PopularCategoriesList } from '../components/PopularCategoriesList';
import { Post } from '../interface/Post';
import Layout from '../components/layout/Layout';
import { Paginated } from '../interface/Paginated';

export const Home: React.FC = () => {
	const { isLoading, error, data } = useQuery<Paginated<Post>, AxiosError>({
		queryKey: ['posts'],
		queryFn: async () => {
			const response = await axios.get<Paginated<Post>>('/posts');
			return response.data;
		},
	});

	return (
		<Layout>
			<Box sx={{ display: 'flex', flex: 1 }}>
				<Stack
					component="main"
					direction="row"
					sx={{
						flexGrow: 1,
						p: 3,
					}}
				>
					{isLoading && <div>Loading posts...</div>}
					{error && <div>Error loading posts: {error.message}</div>}
					{data && (
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								gap: 2,
							}}
						>
							{data.data.map((post) => (
								<Box key={post.id} sx={{ flexGrow: 1 }}>
									<PostCard post={post} />
								</Box>
							))}
						</Box>
					)}
				</Stack>
				<Box
					component="section"
					sx={{
						minWidth: 300,
						p: 3,
						pl: 0,
					}}
				>
					<PopularCategoriesList size={10} />
				</Box>
			</Box>
		</Layout>
	);
};
