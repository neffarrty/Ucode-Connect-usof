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
	},
});
