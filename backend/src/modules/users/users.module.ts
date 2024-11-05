import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/modules/prisma/prisma.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
	providers: [UsersService],
	controllers: [UsersController],
	imports: [MulterModule.register({})],
	exports: [UsersService],
})
export class UsersModule {}
