import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { V1BaseCoontroller } from '@v1/base.controller';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService, type imageFile } from './image.service';
import { ApiException } from '@src/exceptions';

@Controller(V1BaseCoontroller.toPrefix('upload'))
export class UploadController extends V1BaseCoontroller {
    constructor(private readonly imageService: ImageService) {
        super();
    }

    @Post('image')
    @UseInterceptors(FileInterceptor('img'))
    async image(@UploadedFile() img: imageFile | undefined) {
        if (img === undefined) throw new ApiException('img 不能为空');
        const image = await this.imageService.uploadToLocal(img);
        const imageData = await image.toJSON();
        return imageData;
    }
}
