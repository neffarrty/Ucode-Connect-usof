import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const config = app.get(ConfigService);
	const port = config.get<string>('port');

	const builder = new DocumentBuilder()
		.setTitle('BugTalk')
		.setDescription('The Q&A app for developers')
		.setVersion('1.0')
		.addTag('api')
		.build();
	const document = SwaggerModule.createDocument(app, builder);
	SwaggerModule.setup('docs', app, document);

	app.use(cookieParser());
	app.enableCors({
		credentials: true,
	});
	app.setGlobalPrefix('api');
	app.useGlobalPipes(new ValidationPipe());

	// console.log(join(__dirname, '..', '..', 'uploads'));

	await app.listen(port);
}
bootstrap();
