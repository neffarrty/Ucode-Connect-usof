import { UnprocessableEntityException } from '@nestjs/common';
import { Request } from 'express';
import { FileFilterCallback } from 'multer';
import { v4 as uuid } from 'uuid';
import { extname } from 'path';

export const generateFilename = (
	req: Request,
	file: Express.Multer.File,
	callback: (error: Error | null, filename: string) => void,
) => {
	callback(null, `${uuid()}${extname(file.originalname)}`);
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
