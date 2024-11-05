import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const port = process.env.PORT || 3000;

	app.use(cookieParser());
	app.enableCors({
		credentials: true,
	});
	app.setGlobalPrefix('api');
	app.useGlobalPipes(new ValidationPipe({ transform: true }));

	const builder = new DocumentBuilder()
		.setTitle('BugTalk API')
		.setDescription(
			'BugTalk is a developer-focused forum that allows users to discuss software bugs, share solutions, and collaborate on debugging issues. The API provides endpoints for managing users, posts, comments, and categories, facilitating seamless interactions between community members.',
		)
		.setVersion('1.0')
		.setLicense('MIT', 'https://opensource.org/licenses/MIT')
		.addServer(process.env.APP_BASE_URL)
		.addBearerAuth({
			type: 'http',
			scheme: 'bearer',
			bearerFormat: 'JWT',
		})
		.build();
	const document = SwaggerModule.createDocument(app, builder);
	SwaggerModule.setup('docs', app, document);

	await app.listen(port);
}
bootstrap();
