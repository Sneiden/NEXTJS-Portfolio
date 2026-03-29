import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';
import { PostModule } from './post/post.module';
import { ReferenceModule } from './reference/reference.module';

@Module({
  imports: [
    // Load environment variables globally across all modules
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ProjectModule,
    PostModule,
    ReferenceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}