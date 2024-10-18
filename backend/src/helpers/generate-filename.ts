export const generateFilename = (file: Express.Multer.File) => {
	return `${Date.now()}-${file.originalname}`;
};
