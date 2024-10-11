import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { cors: true });
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

	app.setGlobalPrefix('api');
	app.useGlobalPipes(new ValidationPipe());

	await app.listen(port);
}
bootstrap();
