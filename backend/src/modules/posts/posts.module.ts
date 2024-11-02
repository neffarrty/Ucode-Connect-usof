import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaModule } from 'src/modules/prisma/prisma.module';

@Module({
	providers: [PostsService],
	controllers: [PostsController],
	imports: [PrismaModule],
})
export class PostsModule {}
