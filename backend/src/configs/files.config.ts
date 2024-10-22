export default () => ({
	files: {
		avatar: {
			dest: process.env.AVATAR_DEST_DIR,
			maxsize: Number(process.env.AVATAR_MAXSIZE),
			types: process.env.AVATAR_EXTENSIONS,
		},
	},
});
