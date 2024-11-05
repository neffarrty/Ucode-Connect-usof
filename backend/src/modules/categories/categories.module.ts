import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { PrismaModule } from 'src/modules/prisma/prisma.module';

@Module({
	providers: [CategoriesService],
	controllers: [CategoriesController],
})
export class CategoriesModule {}
