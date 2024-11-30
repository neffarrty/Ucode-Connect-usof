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
} from '@mui/material';
import { Layout } from '../components/layout/Layout';
import { Category } from '../interface/Category';
import { Cancel } from '@mui/icons-material';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import axios from '../utils/axios';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

const parser = new MarkdownIt();

export const CreatePostPage: React.FC = () => {
	const [content, setContent] = useState<string>('');
	const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
	const [postCategories, setPostCategories] = useState<string[]>([]);

	const handleSubmit = () => {
		console.log({
			content,
			status,
			categories: postCategories,
		});
	};

	const { isLoading, data: categories } = useQuery<Category[], AxiosError>({
		queryKey: ['categories'],
		queryFn: async () => {
			const { data } = await axios.get<Category[]>('/categories');
			return data;
		},
	});

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
								<Box sx={{ width: '100%' }}>
									<Typography variant="h6">Title</Typography>
									<TextField
										fullWidth
										placeholder="Enter your post title"
										variant="outlined"
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
										onChange={handleEditorChange}
									/>
								</Stack>
								{categories && (
									<Stack
										direction="column"
										gap={1}
										sx={{ width: '48%' }}
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
										variant="contained"
										color="primary"
										onClick={handleSubmit}
									>
										Submit
									</Button>
									<Button
										variant="outlined"
										color="secondary"
									>
										Cancel
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
