import React, { useState } from 'react';
import {
	Alert,
	Autocomplete,
	Box,
	Button,
	Chip,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	IconButton,
	MenuItem,
	OutlinedInput,
	Select,
	SelectChangeEvent,
	Slide,
	Stack,
	Switch,
	TextField,
	Typography,
} from '@mui/material';
import { Cancel, Edit } from '@mui/icons-material';
import { TransitionProps } from '@mui/material/transitions';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Category, Post } from '../../interface';
import axios from '../../utils/axios';
import { AxiosError } from 'axios';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

const Transition = React.forwardRef(function Transition(
	props: TransitionProps & {
		children: React.ReactElement<any, any>;
	},
	ref: React.Ref<unknown>,
) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const parser = new MarkdownIt();

interface UpdatePostButtonProps {
	post: Post;
}

interface PostInput {
	title: string;
	content: string;
	status: 'ACTIVE' | 'INACTIVE';
	categories: string[];
}

export const UpdatePostButton: React.FC<UpdatePostButtonProps> = ({ post }) => {
	const [content, setContent] = useState<string>(post.content);
	const [title, setTitle] = useState<string>(post.title);
	const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>(post.status);
	const [postCategories, setPostCategories] = useState<string[]>(
		post.categories.map(({ category }) => category.title),
	);
	const [error, setError] = useState<string | null>(null);

	const [openUpdateDialog, setOpenUpdateDialog] = useState(false);

	const { isLoading, data: categories } = useQuery<Category[], AxiosError>({
		queryKey: ['categories'],
		queryFn: async () => {
			const { data } = await axios.get<Category[]>('/categories');
			return data;
		},
	});

	const { mutate, isPending } = useMutation<void, any, PostInput>({
		mutationKey: ['update_post', post.id],
		mutationFn: async (data: PostInput) => {
			await axios.patch<Post>(`/posts/${post.id}`, data);
		},
		onSuccess: () => {
			setOpenUpdateDialog(false);
		},
	});

	const handleUpdateClose = () => {
		setOpenUpdateDialog(false);
	};

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

	const handleChange = (_event: React.ChangeEvent<{}>, value: string[]) => {
		setPostCategories(value);
	};

	return (
		<Box>
			<IconButton onClick={() => setOpenUpdateDialog(true)}>
				<Edit sx={{ color: 'primary.dark' }} />
			</IconButton>
			<Dialog
				open={openUpdateDialog}
				onClose={() => setOpenUpdateDialog(false)}
				component="form"
				TransitionComponent={Transition}
				fullWidth
				maxWidth="md"
			>
				<DialogTitle sx={{ color: 'white', bgcolor: 'primary.main' }}>
					Edit post
				</DialogTitle>
				<DialogContent>
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
										<Autocomplete
											multiple
											options={categories.map(
												(category) => category.title,
											)}
											value={postCategories}
											onChange={handleChange}
											renderInput={(params) => (
												<TextField
													{...params}
													placeholder="Select categories"
													variant="outlined"
												/>
											)}
											renderTags={(selected) => (
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
										/>
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
								></Stack>
							</Stack>
						)}
					</Stack>
				</DialogContent>
				<DialogActions sx={{ px: 3, mb: 1 }}>
					<Button onClick={handleUpdateClose} color="primary">
						{'Cancel'}
					</Button>
					<Button
						type="submit"
						variant="contained"
						color="primary"
						disabled={isPending}
						onClick={handleSubmit}
					>
						{isPending ? <CircularProgress /> : 'Submit'}
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};
