import React, { useState } from 'react';
import {
	Stack,
	Paper,
	Typography,
	Divider,
	Button,
	Switch,
	TextField,
	Box,
	Select,
	OutlinedInput,
	SelectChangeEvent,
	Chip,
	MenuItem,
	CircularProgress,
	Alert,
} from '@mui/material';
import { Layout } from '../components/layout/Layout';
import { Category } from '../interface/Category';
import { Cancel } from '@mui/icons-material';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import axios from '../utils/axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Post } from '../interface';
import { useNavigate } from 'react-router-dom';

const parser = new MarkdownIt();

interface PostInput {
	title: string;
	content: string;
	status: 'ACTIVE' | 'INACTIVE';
	categories: string[];
}

export const CreatePostPage: React.FC = () => {
	const client = useQueryClient();
	const navigate = useNavigate();
	const [content, setContent] = useState<string>('');
	const [title, setTitle] = useState<string>('');
	const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
	const [postCategories, setPostCategories] = useState<string[]>([]);
	const [error, setError] = useState<string | null>(null);

	const { isLoading, data: categories } = useQuery<Category[], AxiosError>({
		queryKey: ['categories'],
		queryFn: async () => {
			const { data } = await axios.get<Category[]>('/categories');
			return data;
		},
	});

	const { mutate, isPending } = useMutation<Post, any, PostInput>({
		mutationKey: ['create_post'],
		mutationFn: async (post: PostInput) => {
			const { data } = await axios.post('/posts', post);
			return data;
		},
		onSuccess: (post: Post) => {
			client.invalidateQueries({ queryKey: ['create_post'] });
			navigate(`/posts/${post.id}`);
		},
		onError: (err) => {
			if (err instanceof AxiosError) {
				setError(
					err.response?.data?.message || 'Failed to create post.',
				);
			} else {
				setError('An unexpected error occurred.');
			}
		},
	});

	const handleSubmit = () => {
		if (!title.trim() || !content.trim()) {
			setError('Title and content are required.');
			return;
		}

		mutate({
			title,
			content,
			status,
			categories: postCategories,
		});
	};

	const handleEditorChange = ({ text }: { text: string }) => {
		setContent(text);
	};

	const handleDelete = (category: string) => {
		setPostCategories((prev) => prev.filter((item) => item !== category));
	};

	const handleStatusChange = () => {
		setStatus((prev) => (prev === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'));
	};

	const handleChange = (event: SelectChangeEvent<typeof postCategories>) => {
		const {
			target: { value },
		} = event;
		setPostCategories(typeof value === 'string' ? value.split(',') : value);
	};

	return (
		<Layout>
			<Stack gap={2} sx={{ maxWidth: 900, margin: '0 auto', padding: 2 }}>
				<Typography variant="h4" sx={{ color: 'primary.main' }}>
					Create Post
				</Typography>
				<Paper sx={{ p: 2 }}>
					<Stack>
						{isLoading ? (
							<CircularProgress
								size={24}
								sx={{
									alignSelf: 'center',
									justifySelf: 'center',
								}}
							/>
						) : (
							<Stack direction="column" gap={2}>
								{error && (
									<Alert severity="error">{error}</Alert>
								)}
								<Box sx={{ width: '100%' }}>
									<Typography variant="h6">Title</Typography>
									<TextField
										fullWidth
										placeholder="Enter your post title"
										variant="outlined"
										value={title}
										onChange={(e) =>
											setTitle(e.target.value)
										}
									/>
								</Box>
								<Stack direction="column" gap={1}>
									<Typography variant="h6">
										Content
									</Typography>
									<MdEditor
										style={{ height: '300px' }}
										renderHTML={(text) =>
											parser.render(text)
										}
										value={content}
										onChange={handleEditorChange}
									/>
								</Stack>
								{categories && (
									<Stack
										direction="column"
										gap={1}
										sx={{ width: '50%' }}
									>
										<Typography variant="h6">
											Categories
										</Typography>
										<Select
											multiple
											value={postCategories}
											onChange={handleChange}
											input={<OutlinedInput />}
											renderValue={(selected) => (
												<Box
													sx={{
														display: 'flex',
														flexWrap: 'wrap',
														gap: 0.5,
													}}
												>
													{selected.map((value) => (
														<Chip
															key={value}
															label={value}
															clickable
															deleteIcon={
																<Cancel
																	onMouseDown={(
																		e,
																	) =>
																		e.stopPropagation()
																	}
																/>
															}
															onDelete={() =>
																handleDelete(
																	value,
																)
															}
														/>
													))}
												</Box>
											)}
											MenuProps={{
												disablePortal: true,
											}}
										>
											{categories.map((category) => (
												<MenuItem
													key={category.id}
													value={category.title}
												>
													{category.title}
												</MenuItem>
											))}
										</Select>
									</Stack>
								)}
								<Stack
									direction="row"
									alignItems="center"
									sx={{ mt: 2 }}
								>
									<Switch
										checked={status === 'ACTIVE'}
										onChange={handleStatusChange}
										color="primary"
									/>
									<Typography variant="h6">
										{status}
									</Typography>
								</Stack>
								<Divider sx={{ my: 1 }} />
								<Stack
									direction="row"
									justifyContent="end"
									gap={1}
								>
									<Button
										variant="outlined"
										color="secondary"
										onClick={() => navigate('/posts')}
									>
										Cancel
									</Button>
									<Button
										variant="contained"
										color="primary"
										onClick={handleSubmit}
										disabled={isPending}
									>
										{isPending ? (
											<CircularProgress />
										) : (
											'Submit'
										)}
									</Button>
								</Stack>
							</Stack>
						)}
					</Stack>
				</Paper>
			</Stack>
		</Layout>
	);
};
