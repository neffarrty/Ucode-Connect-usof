import React from 'react';
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { ThumbUp, ThumbDown } from '@mui/icons-material';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useState } from 'react';
import axios from '../../utils/axios';
import { Post } from '../../interface/Post';

interface PostRateButtonsProps {
	post: Post;
}

interface PostRateButtonProps {
	type: 'LIKE' | 'DISLIKE';
	like: 'LIKE' | 'DISLIKE' | undefined;
	setLike: (newLike: 'LIKE' | 'DISLIKE' | undefined) => void;
	post: Post;
}
export const PostRateButton: React.FC<PostRateButtonProps> = ({
	type,
	like,
	setLike,
	post,
}) => {
	const createLike = useMutation<void, AxiosError, void>({
		mutationFn: async () => {
			if (like) {
				await axios.delete(`/posts/${post.id}/like`);
			}
			await axios.post(`/posts/${post.id}/like`, { type });
		},
		onSuccess: () => {
			setLike(type);
		},
	});

	const deleteLike = useMutation<void, AxiosError, void>({
		mutationFn: async () => {
			await axios.delete(`/posts/${post.id}/like`);
		},
		onSuccess: () => {
			setLike(undefined);
		},
	});

	const handleClick = () => {
		if (like === type) {
			deleteLike.mutate();
		} else {
			createLike.mutate();
		}
	};

	return (
		<Box>
			<Tooltip
				title={type === 'LIKE' ? 'Like the post' : 'Dislike the post'}
			>
				<IconButton
					disabled={deleteLike.isPending || createLike.isPending}
					onClick={handleClick}
					sx={{
						color: like === type ? 'primary.main' : undefined,
					}}
				>
					{type === 'LIKE' ? <ThumbUp /> : <ThumbDown />}
				</IconButton>
			</Tooltip>
		</Box>
	);
};

export const PostRateButtons: React.FC<PostRateButtonsProps> = ({ post }) => {
	const [like, setLike] = useState<'LIKE' | 'DISLIKE' | undefined>(post.like);
	const [rating, setRating] = useState(post.rating);

	const updateRating = (newLike: 'LIKE' | 'DISLIKE' | undefined) => {
		if (like === 'LIKE' && newLike === undefined) {
			setRating((prev) => prev - 1);
		} else if (like === 'DISLIKE' && newLike === undefined) {
			setRating((prev) => prev + 1);
		} else if (like === 'LIKE' && newLike === 'DISLIKE') {
			setRating((prev) => prev - 2);
		} else if (like === 'DISLIKE' && newLike === 'LIKE') {
			setRating((prev) => prev + 2);
		} else if (like === undefined && newLike === 'LIKE') {
			setRating((prev) => prev + 1);
		} else if (like === undefined && newLike === 'DISLIKE') {
			setRating((prev) => prev - 1);
		}

		setLike(newLike);
	};

	return (
		<Stack direction="row" sx={{ alignItems: 'center' }}>
			<PostRateButton
				type="LIKE"
				like={like}
				setLike={updateRating}
				post={post}
			/>
			<Typography>{rating}</Typography>
			<PostRateButton
				type="DISLIKE"
				like={like}
				setLike={updateRating}
				post={post}
			/>
		</Stack>
	);
};
