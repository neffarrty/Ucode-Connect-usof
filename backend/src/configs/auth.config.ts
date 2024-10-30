export default () => ({
	auth: {
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
	},
});
