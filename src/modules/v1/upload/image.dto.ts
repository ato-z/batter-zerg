import { ApiProperty } from '@nestjs/swagger';
import { IsImgId } from '@src/tool/validator';
import { IsNotEmpty } from 'class-validator';

export class ImageUploadDTO {
    @ApiProperty({ type: 'string', format: 'binary' })
    img: Buffer;
}

export class ImageQiniuCallbackDTO {
    @ApiProperty({
        description: '文件名',
    })
    @IsNotEmpty()
    key: string;

    @ApiProperty({
        description: '圖片id',
    })
    @IsNotEmpty()
    @IsImgId()
    id: number;
}
