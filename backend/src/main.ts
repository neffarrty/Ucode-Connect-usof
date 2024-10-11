import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { cors: true });
	const config = app.get(ConfigService);
	const port = config.get<string>('port');

	console.log(typeof port);

	app.setGlobalPrefix('api');
	app.useGlobalPipes(new ValidationPipe());

	await app.listen(port);
}
bootstrap();
