import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const port = process.env.POST || 3000;

	app.use(cookieParser());
	app.enableCors({
		credentials: true,
	});
	app.setGlobalPrefix('api');
	app.useGlobalPipes(new ValidationPipe({ transform: true }));

	const builder = new DocumentBuilder()
		.setTitle('BugTalk')
		.setDescription('The Q&A app for developers')
		.setVersion('1.0')
		.setLicense('MIT', 'https://opensource.org/licenses/MIT')
		.addBearerAuth({
			type: 'http',
			scheme: 'bearer',
			in: 'header',
		})
		.build();
	const document = SwaggerModule.createDocument(app, builder);
	SwaggerModule.setup('docs', app, document);

	await app.listen(port);
}
bootstrap();
