import React, { useState } from 'react';
import {
	Avatar,
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
	Slide,
	Stack,
	Typography,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { TransitionProps } from '@mui/material/transitions';
import { Comment, Paginated } from '../../interface';
import { formatDate } from '../../utils/dates';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../../utils/axios';
import { useSelector } from 'react-redux';
import { DeleteCommentButton } from './DeleteCommentButton';
import { UpdateCommentButton } from './UpdateCommentButton';

interface PostCommentCardProps {
	postId: number;
	comment: Comment;
}

export const PostCommentCard: React.FC<PostCommentCardProps> = ({
	postId,
	comment,
}) => {
	const { user } = useSelector((state: any) => state.auth);

	return (
		<Box>
			<Card key={comment.id} sx={{ my: 2 }}>
				<CardHeader
					title={
						<Stack
							direction="row"
							sx={{ alignItems: 'center', gap: 1 }}
						>
							<Avatar
								src={comment.author.avatar}
								sx={{
									border: '2px solid',
									borderColor: 'primary.main',
								}}
							/>
							<Stack direction="column">
								<Stack direction="row" gap={0.5}>
									<Typography>
										{comment.author.fullname}
									</Typography>
									<Typography>{' • '}</Typography>
									<Typography
										variant="subtitle2"
										sx={{ color: 'text.secondary' }}
									>
										{formatDate(
											new Date(comment.createdAt),
										)}
									</Typography>
								</Stack>
								<Typography variant="subtitle2">{`@${comment.author.login}`}</Typography>
							</Stack>
							{(user.role === 'ADMIN' ||
								user.id === comment.authorId) && (
								<Stack
									direction="row"
									sx={{ flexGrow: 1, justifyContent: 'end' }}
								>
									<UpdateCommentButton
										postId={postId}
										comment={comment}
									/>
									<DeleteCommentButton
										postId={postId}
										comment={comment}
									/>
								</Stack>
							)}
						</Stack>
					}
				/>
				<CardContent sx={{ pt: 0 }}>
					<Typography variant="body2">{comment.content}</Typography>
				</CardContent>
			</Card>
		</Box>
	);
};
