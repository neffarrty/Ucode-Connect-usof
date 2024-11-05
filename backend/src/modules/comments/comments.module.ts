import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { PrismaModule } from 'src/modules/prisma/prisma.module';

@Module({
	providers: [CommentsService],
	controllers: [CommentsController],
})
export class CommentsModule {}
