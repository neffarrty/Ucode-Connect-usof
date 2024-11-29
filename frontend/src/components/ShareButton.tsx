import React, { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Share } from '@mui/icons-material';
import { SharePopover } from './SharePopover';

interface ShareButtonProps {
	url: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ url }) => {
	const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);

	const handleShareClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchor(event.currentTarget);
	};

	return (
		<React.Fragment>
			<Tooltip title="Share">
				<IconButton aria-label="share" onClick={handleShareClick}>
					<Share sx={{ color: 'primary.dark' }} />
				</IconButton>
			</Tooltip>
			<SharePopover anchor={anchor} setAnchor={setAnchor} url={url} />
		</React.Fragment>
	);
};
