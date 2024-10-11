export default () => ({
	auth: {
		jwt: {
			secret: process.env.JWT_SECRET,
			expiresIn: process.env.JWT_EXPIRATION,
		},
	},
});
