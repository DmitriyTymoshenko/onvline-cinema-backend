import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { path } from 'app-root-path';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: `${path}/uploads`,
      serveRoot: '/uploads',
    }),
    CloudinaryModule,
  ],
  providers: [FileService],
  controllers: [FileController],
})
export class FileModule {}
