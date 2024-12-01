import React from 'react';
import {
	Avatar,
	Box,
	Card,
	CardContent,
	CardHeader,
	Stack,
	Typography,
} from '@mui/material';
import { Comment } from '../../interface';
import { formatDate } from '../../utils/dates';
import { useSelector } from 'react-redux';
import { DeleteCommentButton } from './DeleteCommentButton';
import { UpdateCommentButton } from './UpdateCommentButton';
import { CommentRateButtons } from './CommentRateButtons';

interface PostCommentCardProps {
	postId: number;
	comment: Comment;
}

export const CommentCard: React.FC<PostCommentCardProps> = ({
	postId,
	comment,
}) => {
	const { user } = useSelector((state: any) => state.auth);

	return (
		<Box>
			<Card key={comment.id} sx={{ my: 2, display: 'flex' }}>
				<CommentRateButtons comment={comment} />
				<Stack direction="column" sx={{ width: '100%' }}>
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
									<Typography variant="subtitle2">
										{comment.author.login}
									</Typography>
								</Stack>
								{(user.role === 'ADMIN' ||
									user.id === comment.authorId) && (
									<Stack
										direction="row"
										sx={{
											flexGrow: 1,
											justifyContent: 'end',
										}}
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
						<Typography variant="body2">
							{comment.content}
						</Typography>
					</CardContent>
				</Stack>
			</Card>
		</Box>
	);
};
