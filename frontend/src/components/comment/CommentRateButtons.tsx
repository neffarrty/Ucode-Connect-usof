import React, { useState } from 'react';
import { Comment } from '../../interface';
import { useMutation } from '@tanstack/react-query';
import { LikeType } from '../../interface/Like';
import axios from '../../utils/axios';
import { AxiosError } from 'axios';
import { Box, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';

interface CommentRateButtonsProps {
	comment: Comment;
}

interface CommentRateButtonProps {
	type: LikeType;
	like: LikeType | undefined;
	setLike: (newLike: LikeType | undefined) => void;
	comment: Comment;
}
export const PostRateButton: React.FC<CommentRateButtonProps> = ({
	type,
	like,
	setLike,
	comment,
}) => {
	const createLike = useMutation<void, AxiosError, void>({
		mutationFn: async () => {
			if (like) {
				await axios.delete(`/comments/${comment.id}/like`);
			}
			await axios.post(`/comments/${comment.id}/like`, { type });
		},
		onSuccess: () => {
			setLike(type);
		},
	});

	const deleteLike = useMutation<void, AxiosError, void>({
		mutationFn: async () => {
			await axios.delete(`/comments/${comment.id}/like`);
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
				title={
					type === 'LIKE' ? 'Like the comment' : 'Dislike the comment'
				}
			>
				<IconButton
					disabled={deleteLike.isPending || createLike.isPending}
					onClick={handleClick}
					sx={{
						border: '1px solid',
						borderColor:
							like === type ? 'primary.main' : 'text.secondary',
						color: like === type ? 'primary.main' : undefined,
					}}
					size="small"
				>
					{type === 'LIKE' ? (
						<KeyboardArrowUp fontSize="inherit" />
					) : (
						<KeyboardArrowDown fontSize="inherit" />
					)}
				</IconButton>
			</Tooltip>
		</Box>
	);
};

export const CommentRateButtons: React.FC<CommentRateButtonsProps> = ({
	comment,
}) => {
	const [like, setLike] = useState<LikeType | undefined>(comment.like);
	const [rating, setRating] = useState(comment.rating);

	const updateRating = (newLike: LikeType | undefined) => {
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
		<Paper
			sx={{
				m: 1,
				p: 1,
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				gap: 0.5,
				borderColor: 'primary.main',
			}}
		>
			<PostRateButton
				type={LikeType.LIKE}
				like={like}
				setLike={updateRating}
				comment={comment}
			/>
			<Typography>{rating}</Typography>
			<PostRateButton
				type={LikeType.DISLIKE}
				like={like}
				setLike={updateRating}
				comment={comment}
			/>
		</Paper>
	);
};
