import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: '.env',
		}),
		PrismaModule,
	],
})
export class AppModule {}
