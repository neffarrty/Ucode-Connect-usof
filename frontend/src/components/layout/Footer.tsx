import {
	Box,
	Link,
	Typography,
	Container,
	IconButton,
	Divider,
} from '@mui/material';
import { Facebook, Instagram, GitHub, X } from '@mui/icons-material';
import Logo from '../Logo';

const socialLinks = {
	facebook: '#',
	twitter: '#',
	instagram: '#',
	github: '#',
};

const Copyright: React.FC = () => {
	return (
		<Typography color="text.secondary">
			{`© ${new Date().getFullYear()}`}
			<Link color="inherit" underline="none" href="/">
				{' CodeTalk'}
			</Link>
			{'. All rights reserved'}
		</Typography>
	);
};

export const Footer: React.FC = () => {
	return (
		<Box
			sx={{
				bgcolor: 'background.paper',
				color: 'text.secondary',
				py: 1,
				borderTop: '1px solid',
				borderColor: 'divider',
				maxWidth: 'none',
				mt: 'auto',
				zIndex: (theme) => theme.zIndex.drawer + 1,
			}}
		>
			<Container maxWidth={false}>
				<Box
					sx={{
						width: '100%',
						display: 'flex',
						flexWrap: 'wrap',
						justifyContent: 'space-between',
						alignItems: 'center',
						gap: 6,
					}}
				>
					<Box sx={{ display: 'flex' }}>
						<Logo />
					</Box>
				</Box>
				<Divider sx={{ my: 1 }} />
				<Box
					sx={{
						width: '100%',
						display: 'flex',
						flexWrap: 'wrap',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<Box sx={{ flex: '0 1 auto' }}>
						<Copyright />
					</Box>
					<Box
						sx={{
							display: 'flex',
							gap: 1,
						}}
					>
						<IconButton
							aria-label="Facebook"
							color="inherit"
							sx={{
								color: '#FFF',
								bgcolor: 'primary.main',
							}}
							href={socialLinks.facebook}
						>
							<Facebook />
						</IconButton>
						<IconButton
							aria-label="Twitter"
							color="inherit"
							sx={{
								color: '#FFF',
								bgcolor: 'primary.main',
							}}
							href={socialLinks.twitter}
						>
							<X />
						</IconButton>
						<IconButton
							aria-label="Instagram"
							color="inherit"
							sx={{
								color: '#FFF',
								bgcolor: 'primary.main',
							}}
							href={socialLinks.instagram}
						>
							<Instagram />
						</IconButton>
						<IconButton
							aria-label="Github"
							color="inherit"
							sx={{
								color: '#FFF',
								bgcolor: 'primary.main',
							}}
							href={socialLinks.github}
						>
							<GitHub />
						</IconButton>
					</Box>
				</Box>
			</Container>
		</Box>
	);
};
