import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { LineChart } from '@mui/x-charts';
import { Paginated } from '../../interface/Paginated';
import { Post } from '../../interface/Post';
import { User } from '../../interface/User';
import { AxiosError } from 'axios';
import axios from '../../utils/axios';

import { format, isWithinInterval, startOfMonth, subMonths } from 'date-fns';
import { Entity } from '../../interface/Entity';

export const getDataByMonth = (data: Entity[]) => {
	const months = Array.from({ length: 12 }, (_, i) => {
		const date = subMonths(new Date(), i);
		return {
			month: format(date, 'MMM yyyy'),
			start: startOfMonth(date),
			end: startOfMonth(subMonths(date, -1)),
			count: 0,
		};
	}).reverse();

	if (!data || data.length === 0) {
		return months.map(({ month }) => ({
			x: month,
			y: 0,
		}));
	}

	data.forEach((element) => {
		const date = new Date(element.createdAt);
		const monthGroup = months.find(({ start, end }) =>
			isWithinInterval(date, { start, end }),
		);
		if (monthGroup) {
			monthGroup.count += 1;
		}
	});

	return months.map(({ month, count }) => ({
		x: month,
		y: count,
	}));
};

interface UserPostsChartProps {
	user: User;
}

export const UserPostsChart: React.FC<UserPostsChartProps> = ({ user }) => {
	const { data: posts } = useQuery<Paginated<Post>, AxiosError>({
		queryKey: ['user_posts', user.id],
		queryFn: async () => {
			const response = await axios.get<Paginated<Post>>(
				`/users/${user?.id}/posts`,
			);
			if (response.data.meta.pages > 1) {
				const { data } = await axios.get(
					`/users/${user.id}/posts?limit=${response.data.meta.total}`,
				);
				return data;
			}
			return response.data;
		},
	});

	return (
		<LineChart
			sx={{
				borderRadius: 1,
				m: 0,
			}}
			dataset={getDataByMonth(posts?.data || [])}
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
				},
			]}
			grid={{ vertical: true, horizontal: true }}
			leftAxis={{
				disableTicks: true,
			}}
			bottomAxis={{
				disableTicks: true,
			}}
		/>
	);
};