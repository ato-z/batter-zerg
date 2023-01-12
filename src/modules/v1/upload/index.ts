import { ImageModel } from '@database/image.database';
import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { UploadController } from './upload.controller';

@Module({
    imports: [],
    controllers: [UploadController],
    providers: [ImageService, ImageModel],
})
export class V1UploadModule {}
