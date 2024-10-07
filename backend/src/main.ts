import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const PORT = process.env.POST || 5000;
	const app = await NestFactory.create(AppModule, { cors: true });

	app.setGlobalPrefix('api');
	app.useGlobalPipes(new ValidationPipe());
	await app.listen(PORT);
}
bootstrap();
