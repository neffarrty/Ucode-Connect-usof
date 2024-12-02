import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import {
	Box,
	Button,
	ButtonGroup,
	debounce,
	InputAdornment,
	Stack,
	TextField,
	Typography,
	Chip,
	Autocomplete,
} from '@mui/material';
import { Search, FilterAlt, Cancel } from '@mui/icons-material';
import { Category, PostFilters } from '../../interface';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import axios from '../../utils/axios';

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

	const { data: categories } = useQuery<Category[], AxiosError>({
		queryKey: ['categories', filters],
		queryFn: async () => {
			const { data } = await axios.get<Category[]>('/categories');
			return data;
		},
	});

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

	const handleCategoryChange = useCallback(
		(_event: React.ChangeEvent<{}>, value: string[]) => {
			setFilters((prev) => ({
				...prev,
				categories: value as string[],
			}));
			setPage(1);
		},
		[updateFilters],
	);

	const handleDelete = (category: string) => {
		setFilters((prev) => ({
			...prev,
			categories: prev.categories.filter((item) => item !== category),
		}));
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
				<Stack direction="row" gap={2} sx={{ flex: 1 }}>
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
					{categories && (
						<Autocomplete
							multiple
							options={categories.map(
								(category) => category.title,
							)}
							value={filters.categories}
							onChange={handleCategoryChange}
							renderInput={(params) => (
								<TextField
									{...params}
									placeholder="Search by categories"
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
													onMouseDown={(e) =>
														e.stopPropagation()
													}
												/>
											}
											onDelete={() => handleDelete(value)}
										/>
									))}
								</Box>
							)}
							size="small"
							sx={{ width: '50%' }}
						/>
					)}
				</Stack>
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
				</Stack>
			</Stack>
		</Stack>
	);
};
