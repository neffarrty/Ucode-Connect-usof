import { Box, CssBaseline, Stack } from '@mui/material';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { SideBar } from '../components/SideBar';
import { useQuery } from '@tanstack/react-query';
import { PostCard } from '../components/PostCard';
import { AxiosError } from 'axios';
import axios from '../utils/axios';
import { PopularCategoriesList } from '../components/PopularCategoriesList';
import { Post } from '../interface/Post';

export interface PaginationMetadata {
	page: number;
	total: number;
	count: number;
	pages: number;
	next: number | null;
	prev: number | null;
}

export interface Paginated<T> {
	data: T[];
	meta: PaginationMetadata;
}

const sidebarWidth = 200;

export const Dashboard: React.FC = () => {
	const { isLoading, error, data } = useQuery<Paginated<Post>, AxiosError>({
		queryKey: ['posts'],
		queryFn: async () => {
			const response = await axios.get<Paginated<Post>>('/posts');
			return response.data;
		},
	});

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				minHeight: '100vh',
			}}
		>
			<Box>
				<CssBaseline />
				<Header />
				<Box sx={{ display: 'flex', flex: 1, pt: 8 }}>
					<SideBar width={sidebarWidth} />
					<Stack
						component="main"
						direction="row"
						sx={{
							flexGrow: 1,
							p: 3,
						}}
					>
						{isLoading && <div>Loading posts...</div>}
						{error && (
							<div>Error loading posts: {error.message}</div>
						)}
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
			</Box>
			<Footer />
		</Box>
	);
};
