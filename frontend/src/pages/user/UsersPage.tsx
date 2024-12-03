import React, { useCallback, useState } from 'react';
import {
	Alert,
	Box,
	Button,
	ButtonGroup,
	CircularProgress,
	debounce,
	Grid2 as Grid,
	InputAdornment,
	Pagination,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { UserCard } from '../../components/user/UserCard';
import { useSelector } from 'react-redux';
import { AxiosError } from 'axios';
import { Layout } from '../../components/layout/Layout';
import axios from '../../utils/axios';
import { Paginated, User } from '../../interface';
import { CreateUserButton } from '../../components/user/CreateUserButton';

interface UserParams {
	page: number;
	limit: number;
	login?: string;
}

export const UsersPage: React.FC = () => {
	const { user } = useSelector((state: any) => state.auth);
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(15);
	const [loginFilter, setLoginFilter] = useState<string>('');
	const [searchValue, setSearchValue] = useState<string>('');

	const handlePageChange = (
		_event: React.ChangeEvent<unknown>,
		value: number,
	) => {
		window.scrollTo({ top: 0 });
		setPage(value);
	};

	const handleLimitChange = (value: number) => {
		window.scrollTo({ top: 0 });
		setLimit(value);
		setPage(1);
	};

	const debouncedSetLoginFilter = useCallback(
		debounce((value: string) => {
			setLoginFilter(value);
			setPage(1);
		}, 500),
		[],
	);

	const handleLoginChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setSearchValue(value);
		debouncedSetLoginFilter(value);
	};

	const {
		isLoading,
		error,
		data: users,
	} = useQuery<Paginated<User>, AxiosError>({
		queryKey: ['users', page, limit, loginFilter],
		queryFn: async () => {
			const params: UserParams = {
				page,
				limit,
			};

			if (loginFilter.trim()) {
				params.login = loginFilter;
			}

			const { data } = await axios.get<Paginated<User>>('/users', {
				params,
			});
			return data;
		},
	});

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
							Users
						</Typography>
						{user.role === 'ADMIN' && <CreateUserButton />}
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
							{`${new Intl.NumberFormat('en-US').format(users?.meta.total || 0)} users`}
						</Typography>
					</Box>
					<Stack
						direction="row"
						sx={{ justifyContent: 'space-between', maxHeight: 40 }}
					>
						<TextField
							placeholder="Search by username"
							variant="outlined"
							size="small"
							value={searchValue}
							onChange={handleLoginChange}
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
					</Stack>
				</Stack>
				{error && (
					<Box
						sx={{
							flexGrow: 1,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							color: 'error.main',
						}}
					>
						<Alert severity="error">
							Error loading users: {error.message}
						</Alert>
					</Box>
				)}
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
				) : users && users?.data.length ? (
					<Stack direction="column" gap={2}>
						<Grid
							component="main"
							container
							spacing={2}
							alignItems="stretch"
							sx={{ flexGrow: 1, p: 3 }}
						>
							{users.data.map((user) => (
								<Grid size={4} key={user.id}>
									<UserCard user={user} />
								</Grid>
							))}
						</Grid>
						<Stack
							component="section"
							direction="row"
							sx={{
								justifyContent: 'space-between',
								p: 3,
							}}
						>
							<Pagination
								count={users.meta.pages}
								page={page}
								variant="outlined"
								shape="rounded"
								color="primary"
								showFirstButton
								showLastButton
								onChange={handlePageChange}
								sx={{ color: 'primary.main', alignSelf: 'end' }}
							/>
							<Box>
								<ButtonGroup variant="outlined">
									{[15, 30, 50].map((lim) => (
										<Button
											onClick={() =>
												handleLimitChange(lim)
											}
											disabled={limit === lim}
											key={lim}
										>
											{lim}
										</Button>
									))}
								</ButtonGroup>
							</Box>
						</Stack>
					</Stack>
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
							No users found
						</Typography>
					</Box>
				)}
			</Box>
		</Layout>
	);
};
