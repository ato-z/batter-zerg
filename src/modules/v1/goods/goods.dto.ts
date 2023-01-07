import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { GoodsStatus, GoodsSwitchType } from '@src/enum';
import { IsImgId, withGoodsCatePid } from '@src/tool/validator';
import {
    IsDateString,
    IsIn,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    Max,
    Min,
} from 'class-validator';

export class GoodsCreateDTO {
    /*  @ApiProperty({
        description: '發佈用戶id，不傳則默認為系統用戶',
        type: Number,
        required: false,
    })
    @IsInt()
    uid: number; */

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
        type: Number,
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

    @ApiProperty({
        description: '当前物品的状态，默认为0 对外不可见',
        type: Number,
    })
    @IsOptional()
    @IsIn([
        GoodsStatus.OUT,
        GoodsStatus.CREATE,
        GoodsStatus.ONLINE,
        GoodsStatus.EXCHANGE,
        GoodsStatus.OVER,
    ])
    status = GoodsStatus.CREATE;
}

export class GoodsUpdateDTO extends PartialType(GoodsCreateDTO) {
    type?: GoodsSwitchType;
    status?: GoodsStatus;
    cate_id?: number;
}

export class GoodsListParamDTO {
    @ApiProperty({
        description: '分類id, 如果為空設置0',
        type: Number,
        required: false,
    })
    @IsOptional()
    @IsInt()
    @withGoodsCatePid()
    cate_id: number;

    @ApiProperty({
        description: '标签',
        required: false,
    })
    @IsOptional()
    tags: string;

    @ApiProperty({
        description: '当前物品的状态',
        type: Number,
        required: false,
    })
    @IsOptional()
    @IsIn([
        GoodsStatus.OUT,
        GoodsStatus.CREATE,
        GoodsStatus.ONLINE,
        GoodsStatus.EXCHANGE,
        GoodsStatus.OVER,
    ])
    status?: number;

    @ApiProperty({
        description: '希望的交付方式 1交換 2免費',
        required: false,
    })
    @IsOptional()
    @IsIn([GoodsSwitchType.ALTERNATE, GoodsSwitchType.FREE])
    type?: number;

    @ApiProperty({
        description: '模糊搜索的标题',
        required: false,
    })
    @IsOptional()
    title?: string;

    @ApiProperty({
        description: '用户id',
        required: false,
    })
    @IsOptional()
    @IsInt()
    uid?: number;

    @ApiProperty({
        description: '跳過條目',
        required: false,
        default: 0,
        type: Number,
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    start = 0;

    @ApiProperty({
        description: '獲取多少條目，默認15. 最大100',
        required: false,
        default: 15,
        type: Number,
    })
    @IsOptional()
    @IsInt()
    @Max(100)
    end = 15;

    @ApiProperty({
        description: '創建時間之前',
        required: false,
    })
    @IsOptional()
    @IsDateString()
    start_date?: string;

    @ApiProperty({
        description: '創建時間之後',
        required: false,
    })
    @IsOptional()
    @IsDateString()
    end_date?: string;
}
