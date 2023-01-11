import {
    All,
    Body,
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { V1BaseCoontroller } from '@v1/base.controller';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService, type imageFile } from './image.service';
import { ApiException } from '@src/exceptions';
import { ApiBody, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ImageUploadDTO, ImageQiniuCallbackDTO } from './image.dto';
import { ImageFrom } from '@src/enum';

@ApiTags('公共模塊')
@Controller(V1BaseCoontroller.toPrefix('upload'))
export class UploadController extends V1BaseCoontroller {
    constructor(private readonly imageService: ImageService) {
        super();
    }

    @ApiHeader({
        name: 'token',
        description: '臨時密鑰',
        required: true,
    })
    @ApiResponse({
        description: '單圖上傳接口',
    })
    @ApiBody({
        description:
            'jpg | jpeg | png | gif 文件，如果上傳同一文件將返回上一回結果',
        type: ImageUploadDTO,
    })
    @Post('image')
    @UseInterceptors(FileInterceptor('img'))
    async image(@UploadedFile() img: imageFile | undefined) {
        if (img === undefined) throw new ApiException('img 不能为空');
        const image = await this.imageService.uploadToLocal(img);
        const imageData = await image.toJSON();
        return imageData;
    }

    @ApiResponse({
        description: '七牛雲回調url，黨圖像上傳至七牛雲被動調用',
    })
    @All('callback/qiniu_image')
    async qiniuCallBack(@Body() data: ImageQiniuCallbackDTO) {
        await this.imageService.saveFrom(data.id, ImageFrom.QINIU);
        return { message: `IMG: ${data.id} 已更新` };
    }
}
