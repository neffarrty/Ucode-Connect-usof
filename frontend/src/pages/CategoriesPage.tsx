import React, { useCallback, useState } from 'react';
import {
	Box,
	Button,
	ButtonGroup,
	CircularProgress,
	Grid2 as Grid,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Category } from '../interface';
import { AxiosError } from 'axios';
import axios from '../utils/axios';
import { Search } from '@mui/icons-material';
import { CategoryCard } from '../components/category/CategoryCard';
import { useSelector } from 'react-redux';
import { Layout } from '../components/layout/Layout';
import { CreateCategoryButton } from '../components/category/CreateCategoryButton';

interface CategoryFilters {
	sort: string;
	order: string;
	title: string;
}

export const CategoriesPage: React.FC = () => {
	const { user } = useSelector((state: any) => state.auth);

	const [filters, setFilters] = useState<CategoryFilters>({
		sort: 'posts',
		order: 'desc',
		title: '',
	});

	const cleanFilters = ({ sort, order, title }: CategoryFilters) => {
		const cleaned: Partial<CategoryFilters> = {};

		if (title.trim()) {
			cleaned.title = title;
		}
		if (sort) {
			cleaned.sort = sort;
		}
		if (order) {
			cleaned.order = order;
		}

		return cleaned;
	};

	const { isLoading, data: categories } = useQuery<Category[], AxiosError>({
		queryKey: ['categories', filters],
		queryFn: async () => {
			const params = cleanFilters(filters);
			const { data } = await axios.get<Category[]>('/categories', {
				params,
			});

			return data;
		},
	});

	const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setFilters((prev) => ({
			...prev,
			title: event.target.value,
		}));
	};

	const handleSortChange = (sort: string, order: string) => {
		setFilters((prev) => ({
			...prev,
			sort,
			order,
		}));
	};

	return (
		<Layout>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					flex: 1,
				}}
			>
				<Stack direction="column" gap={0.5} sx={{ px: 3 }}>
					<Box
						sx={{
							width: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
						}}
					>
						<Typography variant="h4" color="primary.dark">
							All categories
						</Typography>
						{user.role === 'ADMIN' && <CreateCategoryButton />}
					</Box>
					<Box
						sx={{
							width: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
						}}
					>
						<Typography variant="subtitle1" color="text.secondary">
							{`${new Intl.NumberFormat('en-US').format(categories?.length || 0)} categories`}
						</Typography>
					</Box>
					<Stack
						direction="row"
						sx={{ justifyContent: 'space-between', maxHeight: 40 }}
					>
						<Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
							<Search
								sx={{ color: 'action.active', mr: 1, my: 0.5 }}
							/>
							<TextField
								placeholder="Search category by title"
								variant="standard"
								value={filters.title}
								onChange={handleTitleChange}
							/>
						</Box>
						<Stack direction="row" gap={0.5}>
							<ButtonGroup variant="outlined">
								<Button
									sx={{ width: 75 }}
									onClick={() =>
										handleSortChange('posts', 'desc')
									}
									disabled={
										filters.sort === 'posts' &&
										filters.order === 'desc'
									}
								>
									Popular
								</Button>
								<Button
									sx={{ width: 75 }}
									onClick={() =>
										handleSortChange('title', 'asc')
									}
									disabled={
										filters.sort === 'title' &&
										filters.order === 'asc'
									}
								>
									Name
								</Button>
								<Button
									sx={{ width: 75 }}
									onClick={() =>
										handleSortChange('createdAt', 'desc')
									}
									disabled={
										filters.sort === 'createdAt' &&
										filters.order === 'desc'
									}
								>
									New
								</Button>
							</ButtonGroup>
						</Stack>
					</Stack>
				</Stack>
				{isLoading ? (
					<Box
						sx={{
							display: 'flex',
							flexGrow: 1,
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<CircularProgress size={24} />
					</Box>
				) : categories?.length ? (
					<Grid
						component="main"
						container
						spacing={2}
						alignItems="stretch"
						sx={{ flexGrow: 1, p: 3 }}
					>
						{categories.map((category) => (
							<Grid size={3} key={category.id}>
								<CategoryCard category={category} />
							</Grid>
						))}
					</Grid>
				) : (
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
							flexGrow: 1,
						}}
					>
						<Typography variant="h6" color="text.secondary">
							No categories found
						</Typography>
					</Box>
				)}
			</Box>
		</Layout>
	);
};
