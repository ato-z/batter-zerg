import { ApiProperty } from '@nestjs/swagger';
import { GoodsOrderState } from '@src/enum';
import {
    IsDateString,
    IsIn,
    IsInt,
    IsOptional,
    IsString,
    Max,
    Min,
} from 'class-validator';

export class GoodsOrderListParamDTO {
    @ApiProperty({
        description: '订单号',
        required: false,
    })
    @IsOptional()
    @IsString()
    order_no?: string;

    @ApiProperty({
        description: '交换阶段 0发起订单 1双方统一意见 2交换成功 3交换失败',
        required: false,
    })
    @IsOptional()
    @IsIn([
        GoodsOrderState.CREATE,
        GoodsOrderState.EXCHANGE,
        GoodsOrderState.SUCCESS,
        GoodsOrderState.ERROR,
    ])
    status?: number;

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
        description: '獲取多少條目，默認10. 最大50',
        required: false,
        default: 10,
        type: Number,
    })
    @IsOptional()
    @IsInt()
    @Max(50)
    end = 10;

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
