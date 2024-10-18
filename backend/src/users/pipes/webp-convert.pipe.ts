import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class WebpConvertPipe implements PipeTransform {
	transform(file: Express.Multer.File) {
		return file;
	}
}
