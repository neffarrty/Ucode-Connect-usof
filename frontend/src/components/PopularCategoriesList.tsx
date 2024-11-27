import React from 'react';
import {
	Typography,
	List,
	ListItem,
	ListItemText,
	Paper,
	ListItemButton,
	ListSubheader,
	Divider,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import axios from '../utils/axios';
import { Category } from '../interface/Category';
import { Paginated } from '../interface/Paginated';

interface PopularCategoriesListProps {
	size: number;
}

export const PopularCategoriesList: React.FC<PopularCategoriesListProps> = ({
	size,
}) => {
	const { isLoading, data } = useQuery<Paginated<Category>, AxiosError>({
		queryKey: ['top_categories'],
		queryFn: async () => {
			const response = await axios.get<Paginated<Category>>(
				`/categories?limit=${size}`,
			);

			return response.data;
		},
	});

	return (
		<Paper
			sx={{ display: 'flex', flexDirection: 'row', position: 'relative' }}
		>
			<List
				sx={{
					width: '100%',
					maxWidth: 360,
					bgcolor: 'background.paper',
				}}
				subheader={
					<ListSubheader component="div">
						<Typography
							variant="subtitle1"
							sx={{
								my: 2,
								color: 'primary.dark',
								display: 'block',
								fontWeight: 'bold',
								fontSize: 20,
								textAlign: 'justify',
							}}
						>
							Most popular categories
						</Typography>
						<Divider />
					</ListSubheader>
				}
			>
				{data &&
					data.data.map((categorie) => (
						<ListItemButton key={categorie.id}>
							<ListItem sx={{ p: 0 }}>
								<ListItemText
									primary={
										<Typography
											component="div"
											variant="subtitle1"
											sx={{
												color: 'primary.main',
												display: 'block',
												fontWeight: 'bold',
											}}
										>
											{categorie.title}
										</Typography>
									}
									secondary={
										<React.Fragment>
											<Typography
												component="div"
												variant="body2"
												sx={{
													color: 'text.primary',
													display: 'block',
													textAlign: 'justify',
												}}
											>
												{categorie.description}
											</Typography>
											<Typography
												component="div"
												variant="caption"
												sx={{
													color: 'text.secondary',
													display: 'block',
												}}
											>
												{`${categorie.posts} posts`}
											</Typography>
										</React.Fragment>
									}
								/>
							</ListItem>
						</ListItemButton>
					))}
			</List>
		</Paper>
	);
};
