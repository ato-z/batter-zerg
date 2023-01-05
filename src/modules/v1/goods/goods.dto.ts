import { ApiProperty } from '@nestjs/swagger';
import { GoodsSwitchType } from '@src/enum';
import { IsImgId, withGoodsCatePid } from '@src/tool/validator';
import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GoodsCreateDTO {
    @ApiProperty({
        description: '發佈用戶id，不傳則默認為系統用戶',
        type: Number,
        required: false,
    })
    @IsInt()
    uid = 1;

    @ApiProperty({
        description: '分類id, 如果為空設置0',
        type: Number,
    })
    @IsInt()
    @withGoodsCatePid()
    cate_id = 0;

    @ApiProperty({
        description: '標題',
    })
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        description: '封面圖id',
    })
    @IsInt()
    @IsImgId()
    cover: number;

    @ApiProperty({
        description: '留言信息',
        type: String,
    })
    @IsOptional()
    @IsString()
    message = '';

    @ApiProperty({
        description: '希望的交付方式 1交換 2免費',
    })
    @IsOptional()
    @IsIn([GoodsSwitchType.ALTERNATE, GoodsSwitchType.FREE])
    type: GoodsSwitchType = GoodsSwitchType.ALTERNATE;

    @ApiProperty({
        description: '物品介紹，詳情',
    })
    @IsString()
    content: string;

    @ApiProperty({
        description: '自定義標簽, [`標簽1`, `標簽2`, `標簽3`]',
        type: String,
        isArray: true,
    })
    @IsOptional()
    @IsString({ each: true })
    tags?: string[] | string = null;
}
