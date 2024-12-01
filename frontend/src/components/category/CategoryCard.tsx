import React from 'react';
import {
	Box,
	IconButton,
	Paper,
	Popover,
	Stack,
	Tooltip,
	Typography,
} from '@mui/material';
import { Category } from '../../interface';
import { MoreVert, ArrowCircleDown } from '@mui/icons-material';
import { UpdateCategoryButton } from './UpdateCategoryButton';
import { DeleteCategoryButton } from './DeleteCategoryButton';
import { useSelector } from 'react-redux';

interface CategoryCardProps {
	category: Category;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
	const { user } = useSelector((state: any) => state.auth);
	const [anchor, setAnchor] = React.useState<HTMLButtonElement | null>(null);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchor(event.currentTarget);
	};

	const handleClose = () => {
		setAnchor(null);
	};

	return (
		<Paper
			sx={{
				p: 2,
				border: '1px solid',
				borderColor: 'primary.light',
				borderRadius: 3,
				boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
				transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out',
				'&:hover': {
					transform: 'translateY(-8px)',
					boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
				},
				minHeight: 185,
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				backgroundColor: '#fff',
			}}
		>
			<Stack gap={1} sx={{ flex: 1 }}>
				<Stack
					direction="row"
					alignItems="center"
					justifyContent="space-between"
				>
					<Typography variant="h6" color="primary.dark" noWrap>
						{category.title}
					</Typography>
					{user.role === 'ADMIN' && (
						<IconButton onClick={handleClick} size="small">
							<MoreVert />
						</IconButton>
					)}
					<Popover
						open={Boolean(anchor)}
						anchorEl={anchor}
						onClose={handleClose}
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'left',
						}}
					>
						<Stack direction="row" sx={{ gap: 1, p: 1 }}>
							<UpdateCategoryButton category={category} />
							<DeleteCategoryButton category={category} />
						</Stack>
					</Popover>
				</Stack>
				<Box
					sx={{
						flex: 1,
						display: '-webkit-box',
						WebkitBoxOrient: 'vertical',
						WebkitLineClamp: 3,
						overflow: 'hidden',
					}}
				>
					<Typography variant="body2" color="text.secondary">
						{category.description}
					</Typography>
				</Box>
			</Stack>
			<Stack
				direction="row"
				sx={{
					justifyContent: 'space-between',
					alignItems: 'center',
					marginTop: 'auto',
					pt: 1,
				}}
			>
				<Typography variant="caption" color="text.secondary">
					{`${new Intl.NumberFormat('en-US').format(category.posts)} posts`}
					{' from '}
					{new Date(category.createdAt).toDateString()}
				</Typography>
				<Tooltip title={`Go to posts`}>
					<IconButton
						href={`/categories/${category.id}/posts`}
						size="small"
					>
						<ArrowCircleDown
							sx={{
								transform: 'rotate(-90deg)',
								color: 'primary.main',
							}}
						/>
					</IconButton>
				</Tooltip>
			</Stack>
		</Paper>
	);
};
