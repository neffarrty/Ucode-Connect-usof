import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import {
	Box,
	Button,
	ButtonGroup,
	debounce,
	InputAdornment,
	MenuItem,
	Select,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import { Search, FilterAlt } from '@mui/icons-material';
import { PostFilters } from '../interface';

interface PostsPageHeaderProps {
	count: number;
	filters: PostFilters;
	title: ReactNode;
	setFilters: React.Dispatch<React.SetStateAction<PostFilters>>;
	setPage: React.Dispatch<React.SetStateAction<number>>;
}

export const PostsPageHeader: React.FC<PostsPageHeaderProps> = ({
	count,
	filters,
	title,
	setFilters,
	setPage,
}) => {
	const [searchValue, setSearchValue] = useState(filters.title);

	const updateFilters = useMemo(
		() =>
			debounce((value: string) => {
				setFilters((prev) => ({
					...prev,
					title: value,
				}));
				setPage(1);
			}, 500),
		[setFilters, setPage],
	);

	const handleSearchChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const value = event.target.value;
			setSearchValue(value);
			updateFilters(value);
		},
		[updateFilters],
	);

	const handleCategoryChange = (categories: string[]) => {
		setFilters((prev) => ({
			...prev,
			categories,
		}));
		setPage(1);
	};

	const handleDateChange = (type: 'gte' | 'lte', date: Date | null) => {
		setFilters((prev) => ({
			...prev,
			createdAt: {
				...prev.createdAt,
				[type]: date,
			},
		}));
		setPage(1);
	};

	const handleSortChange = (sort: string, order: string) => {
		setFilters((prev) => ({
			...prev,
			sort,
			order,
		}));
	};

	return (
		<Stack direction="column" gap={0.5} sx={{ px: 3 }}>
			{title}
			<Box
				sx={{
					width: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
			>
				<Typography variant="subtitle1" color="text.secondary">
					{`${new Intl.NumberFormat('en-US').format(count)} posts`}
				</Typography>
			</Box>
			<Stack
				direction="row"
				sx={{ justifyContent: 'space-between', maxHeight: 40 }}
			>
				<Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
					<TextField
						placeholder="Search by title"
						variant="outlined"
						size="small"
						value={searchValue}
						onChange={handleSearchChange}
						slotProps={{
							input: {
								startAdornment: (
									<InputAdornment position="start">
										<Search />
									</InputAdornment>
								),
							},
						}}
					/>
				</Box>
				<Stack direction="row" gap={0.5}>
					<ButtonGroup variant="outlined">
						<Button
							sx={{ width: 125 }}
							onClick={() =>
								handleSortChange('createdAt', 'desc')
							}
							disabled={
								filters.sort === 'createdAt' &&
								filters.order === 'desc'
							}
						>
							Newest
						</Button>
						<Button
							sx={{ width: 125 }}
							onClick={() => handleSortChange('rating', 'desc')}
							disabled={
								filters.sort === 'rating' &&
								filters.order === 'desc'
							}
						>
							Most rated
						</Button>
					</ButtonGroup>
					<Button variant="contained" startIcon={<FilterAlt />}>
						Filter
					</Button>
					<Select
						multiple
						value={filters.categories}
						onChange={(event) => {
							const value = event.target.value as string[];
							handleCategoryChange(value);
						}}
						renderValue={(selected) => selected.join(', ')}
					>
						<MenuItem value="Category1">Category1</MenuItem>
						<MenuItem value="Category2">Category2</MenuItem>
						<MenuItem value="Category3">Category3</MenuItem>
					</Select>
				</Stack>
			</Stack>
		</Stack>
	);
};
