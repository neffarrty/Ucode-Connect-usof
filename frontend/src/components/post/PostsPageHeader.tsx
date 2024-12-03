import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import {
	Box,
	Button,
	ButtonGroup,
	InputAdornment,
	Stack,
	TextField,
	Typography,
	Chip,
	Autocomplete,
	Collapse,
	debounce,
	Select,
	MenuItem,
} from '@mui/material';
import { Search, FilterAlt, Cancel } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
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
	const [expanded, setExpanded] = useState(false);

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
			}, 100),
		[setFilters, setPage],
	);

	const handleSearchChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			updateFilters(event.target.value);
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
		[setFilters, setPage],
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
				<TextField
					placeholder="Search by title"
					variant="outlined"
					size="small"
					value={filters.title}
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
				<Stack direction="row" gap={2}>
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
					<Button
						startIcon={<FilterAlt />}
						variant={expanded ? 'contained' : 'outlined'}
						onClick={() => setExpanded(!expanded)}
					>
						Filters
					</Button>
				</Stack>
			</Stack>
			<Collapse
				in={expanded}
				timeout="auto"
				unmountOnExit
				sx={{
					mt: 1,
					border: 1,
					borderColor: 'primary.main',
					borderRadius: 2,
					p: 2,
				}}
			>
				{categories && (
					<Autocomplete
						multiple
						options={categories.map((category) => category.title)}
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
						sx={{ mb: 2, width: '100%' }}
					/>
				)}

				<Stack direction="row" gap={2}>
					<DatePicker
						label="From Date"
						value={filters.createdAt?.gte || null}
						onChange={(date) => handleDateChange('gte', date)}
						slotProps={{
							textField: {
								variant: 'outlined',
								size: 'small',
							},
						}}
					/>
					<DatePicker
						label="To Date"
						value={filters.createdAt?.lte || null}
						onChange={(date) => handleDateChange('lte', date)}
						slotProps={{
							textField: {
								variant: 'outlined',
								size: 'small',
							},
						}}
					/>
					<Select
						value={filters.status || ''}
						onChange={(e) =>
							setFilters((prev) => ({
								...prev,
								status: e.target.value as string,
							}))
						}
						displayEmpty
						variant="outlined"
						size="small"
						sx={{ minWidth: 120 }}
					>
						<MenuItem value="">All</MenuItem>
						<MenuItem value="ACTIVE">ACTIVE</MenuItem>
						<MenuItem value="INACTIVE">INACTIVE</MenuItem>
					</Select>
					<Box sx={{ marginLeft: 'auto' }}>
						<Button
							variant="outlined"
							color="error"
							onClick={() => {
								setFilters({
									title: '',
									categories: [],
									createdAt: { gte: null, lte: null },
									sort: 'createdAt',
									order: 'desc',
									status: '',
								});
								setPage(1);
							}}
						>
							Clear
						</Button>
					</Box>
				</Stack>
			</Collapse>
		</Stack>
	);
};
