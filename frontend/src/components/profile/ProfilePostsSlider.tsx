import React, { useEffect, useState } from 'react';
import {
	Slide,
	Card,
	CardContent,
	Typography,
	CardActions,
	Button,
	IconButton,
	Stack,
	Box,
	CardHeader,
	Skeleton,
	Tooltip,
	Chip,
} from '@mui/material';
import { ArrowBackIos, ArrowForwardIos, Star } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { Paginated, Post } from '../../interface/';
import { useSelector } from 'react-redux';
import { AxiosError } from 'axios';
import axios from '../../utils/axios';
import { formatDate } from '../../utils/dates';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const truncateText = (text: string, limit: number) => {
	const words = text.split(' ');
	if (words.length <= limit) {
		return text;
	}
	return words.slice(0, limit).join(' ') + '...';
};

export const ProfilePostsSlider: React.FC = () => {
	const { user } = useSelector((state: any) => state.auth);
	const [currentSlide, setCurrentSlide] = useState(0);
	const [direction, setDirection] = useState<'left' | 'right'>('right');
	const [posts, setPosts] = useState<Post[]>([]);

	const handlePrev = () => {
		setDirection('right');
		setCurrentSlide((prev) => (prev === 0 ? posts.length - 1 : prev - 1));
	};

	const handleNext = () => {
		setDirection('left');
		setCurrentSlide((prev) => (prev === posts.length - 1 ? 0 : prev + 1));
	};

	const { isLoading, data } = useQuery<Post[], AxiosError>({
		queryKey: ['user_popular_posts', user.id],
		queryFn: async () => {
			const { data } = await axios.get<Paginated<Post>>(
				`/users/${user.id}/posts?limit=5`,
			);

			return data.data;
		},
	});

	useEffect(() => {
		if (!isLoading) {
			setPosts(data || []);
		}
	}, [data, isLoading]);

	if (isLoading) {
		return <Skeleton variant="rectangular" />;
	}

	return (
		<Stack direction="column" sx={{ py: 0.5 }}>
			{posts.length > 0 ? (
				<>
					<Slide
						in={true}
						direction={direction}
						timeout={500}
						mountOnEnter
						unmountOnExit
						key={posts[currentSlide].id}
					>
						<Card
							sx={{
								display: 'flex',
								flexDirection: 'row',
								position: 'relative',
							}}
						>
							<Box sx={{ flex: 1 }}>
								<CardHeader
									subheader={formatDate(
										new Date(
											posts[currentSlide].createdAt ||
												Date.now(),
										),
									)}
									sx={{ py: 0.5 }}
								/>
								<CardContent sx={{ py: 0 }}>
									<Box>
										<Typography
											variant="h6"
											sx={{
												color: 'text.primary',
											}}
										>
											{posts[currentSlide].title}
										</Typography>
										<Box
											sx={{
												my: 1,
												display: 'flex',
												gap: 1,
												color: 'text.secondary',
											}}
										>
											{posts[currentSlide].categories.map(
												({ category }) => (
													<Tooltip
														key={category.id}
														title={
															category.description
														}
													>
														<Chip
															component="a"
															href={`http://localhost:3001/category/${category.id}`}
															label={
																category.title
															}
															variant="outlined"
															size="small"
															color="primary"
															clickable
														/>
													</Tooltip>
												),
											)}
										</Box>
										<Typography
											variant="body2"
											sx={{
												color: 'text.secondary',
												textAlign: 'justify',
												display: '-webkit-box',
												WebkitBoxOrient: 'vertical',
												overflow: 'hidden',
												WebkitLineClamp: 3,
											}}
										>
											<Markdown
												remarkPlugins={[remarkGfm]}
											>
												{posts[currentSlide]?.content}
											</Markdown>
										</Typography>
									</Box>
								</CardContent>
								<CardActions disableSpacing>
									<Button
										href={`http://localhost:3001/posts/${posts[currentSlide]?.id}`}
										size="small"
									>
										Learn More
									</Button>
								</CardActions>
							</Box>
							<Box
								sx={{
									width: 80,
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
								}}
							>
								<Box
									sx={{
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										gap: 0.5,
										color: 'text.primary',
									}}
								>
									<Star color="primary" />
									<Typography variant="body1">
										{posts[currentSlide]?.rating || 0}
									</Typography>
								</Box>
							</Box>
						</Card>
					</Slide>
					<Stack
						direction="row"
						sx={{ justifyContent: 'space-between' }}
					>
						<IconButton color="primary" onClick={handlePrev}>
							<ArrowBackIos />
						</IconButton>
						<IconButton color="primary" onClick={handleNext}>
							<ArrowForwardIos />
						</IconButton>
					</Stack>
				</>
			) : (
				<Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
					No posts available.
				</Typography>
			)}
		</Stack>
	);
};
