import { LineChart } from '@mui/x-charts';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Paginated } from '../../interface/Paginated';
import { AxiosError } from 'axios';
import { User } from '../../interface/User';
import { Comment } from '../../interface/Comment';
import axios from '../../utils/axios';
import { getDataByMonth } from './UserPostsChart';

interface UserCommentsChartProps {
	user: User;
}

export const UserCommentsChart: React.FC<UserCommentsChartProps> = ({
	user,
}) => {
	const { isLoading, data: comments } = useQuery<
		Paginated<Comment>,
		AxiosError
	>({
		queryKey: ['user_comments', user.id],
		queryFn: async () => {
			const response = await axios.get<Paginated<Comment>>(
				`/users/${user?.id}/comments`,
			);
			if (response.data.meta.pages > 1) {
				const { data } = await axios.get(
					`/users/${user.id}/comments?limit=${response.data.meta.total}`,
				);
				return data;
			}
			return response.data;
		},
	});

	return (
		<LineChart
			loading={isLoading}
			slotProps={{
				loadingOverlay: { message: 'Data should be available soon.' },
				noDataOverlay: { message: 'Select some data to display.' },
			}}
			dataset={getDataByMonth(comments?.data || [])}
			yAxis={[{ tickMinStep: 1 }]}
			xAxis={[
				{
					scaleType: 'band',
					dataKey: 'x',
					valueFormatter: (month, context) =>
						context.location === 'tick'
							? `${month.slice(0, 3)}\n${month.slice(3)}`
							: `${month} 2023`,
				},
			]}
			series={[
				{
					dataKey: 'y',
					color: '#FFBB94',
				},
			]}
			grid={{ vertical: true, horizontal: true }}
			leftAxis={{
				disableTicks: true,
			}}
			bottomAxis={{
				disableTicks: true,
			}}
			sx={{
				borderRadius: 1,
				m: 0,
			}}
		/>
	);
};
