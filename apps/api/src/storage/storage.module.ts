import { Module } from '@nestjs/common';
import { FileUploadService } from './storage.service';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  ],
  providers: [FileUploadService],
  exports: [FileUploadService],

})
export class FileUploadModule { }
