import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
	jwt: {
		access: {
			secret: process.env.JWT_ACCESS_SECRET,
			expiration: process.env.JWT_ACCESS_EXPIRATION,
		},
		refresh: {
			secret: process.env.JWT_REFRESH_SECRET,
			expiration: process.env.JWT_REFRESH_EXPIRATION,
		},
	},
	google: {
		client: {
			id: process.env.GOOGLE_CLIENT_ID,
			secret: process.env.GOOGLE_CLIENT_SECRET,
		},
		callback: {
			url: process.env.GOOGLE_CALLBACK_URL,
		},
	},
	github: {
		client: {
			id: process.env.GITHUB_CLIENT_ID,
			secret: process.env.GITHUB_CLIENT_SECRET,
		},
		callback: {
			url: process.env.GITHUB_CALLBACK_URL,
		},
	},
}));
