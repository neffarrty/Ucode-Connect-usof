import {
	AttachFile,
	Facebook,
	Telegram,
	Reddit,
	LinkedIn,
} from '@mui/icons-material';
import {
	Popover,
	Box,
	Tooltip,
	IconButton,
	Alert,
	Snackbar,
	SnackbarCloseReason,
} from '@mui/material';
import React, { useState } from 'react';
import {
	FacebookShareButton,
	TelegramShareButton,
	RedditShareButton,
	LinkedinShareButton,
} from 'react-share';

interface SharePopoverProps {
	anchor: HTMLButtonElement | null;
	setAnchor: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
	url: string;
}

export const SharePopover: React.FC<SharePopoverProps> = ({
	anchor,
	setAnchor,
	url,
}) => {
	const [open, setOpen] = useState(false);

	const handleCloseSnackbar = (
		event: React.SyntheticEvent | Event,
		reason?: SnackbarCloseReason,
	) => {
		if (reason === 'clickaway') {
			return;
		}
		setOpen(false);
	};

	const handlePopoverClose = () => {
		setAnchor(null); // Сбрасываем якорь, чтобы Popover закрылся
	};

	return (
		<React.Fragment>
			<Popover
				open={Boolean(anchor)}
				anchorEl={anchor}
				onClose={handlePopoverClose} // Используем корректный обработчик
				anchorOrigin={{
					vertical: 'center',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: 'center',
					horizontal: 'left',
				}}
			>
				<Box
					sx={{
						display: 'flex',
						gap: 1,
						p: 1,
					}}
				>
					<Tooltip title="Copy link to clipboard">
						<IconButton
							sx={{
								display: 'flex',
								alignItems: 'center',
								padding: 0,
								'&:hover': {
									backgroundColor: 'transparent',
									boxShadow: 'none',
								},
							}}
							onClick={() => {
								setOpen(true);
								navigator.clipboard.writeText(url);
							}}
						>
							<AttachFile
								sx={{
									transform: 'rotate(45deg)',
									color: 'text.primary',
								}}
							/>
						</IconButton>
					</Tooltip>
					<Tooltip title="Share via Facebook">
						<FacebookShareButton
							style={{
								display: 'flex',
								alignItems: 'center',
								color: '#3B5998',
							}}
							url={url}
						>
							<Facebook />
						</FacebookShareButton>
					</Tooltip>
					<Tooltip title="Share via Telegram">
						<TelegramShareButton
							style={{
								display: 'flex',
								alignItems: 'center',
								color: '#229ED9',
							}}
							url={url}
						>
							<Telegram />
						</TelegramShareButton>
					</Tooltip>
					<Tooltip title="Share via Reddit">
						<RedditShareButton
							style={{
								display: 'flex',
								alignItems: 'center',
								color: '#FF4500',
							}}
							url={url}
						>
							<Reddit />
						</RedditShareButton>
					</Tooltip>
					<Tooltip title="Share via LinkedIn">
						<LinkedinShareButton
							style={{
								display: 'flex',
								alignItems: 'center',
								color: '#0077B5',
							}}
							url={url}
						>
							<LinkedIn />
						</LinkedinShareButton>
					</Tooltip>
				</Box>
			</Popover>
			<Snackbar
				open={open}
				autoHideDuration={3000}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
				onClose={handleCloseSnackbar} // Указываем обработчик для Snackbar
			>
				<Alert onClose={handleCloseSnackbar}>
					Link copied to your clipboard.
				</Alert>
			</Snackbar>
		</React.Fragment>
	);
};
