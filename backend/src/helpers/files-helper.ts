import { UnprocessableEntityException } from '@nestjs/common';
import { Request } from 'express';
import { FileFilterCallback } from 'multer';

export const generateFilename = (
	req: Request,
	file: Express.Multer.File,
	callback: (error: Error | null, filename: string) => void,
) => {
	callback(null, `${Date.now()}-${file.originalname}`);
};

export const imageFileFilter = (
	req: Request,
	file: Express.Multer.File,
	callback: FileFilterCallback,
) => {
	if (!file.mimetype.startsWith('image')) {
		return callback(
			new UnprocessableEntityException('Only image files are allowed!'),
		);
	}
	callback(null, true);
};
