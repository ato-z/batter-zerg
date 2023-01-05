import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsImgId, withGoodsCatePid } from '@src/tool/validator';
import {
    IsDateString,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    Length,
    Max,
    Min,
} from 'class-validator';

export class GoodsCateCreateDTO {
    @ApiProperty()
    @IsNotEmpty()
    @Length(2, 32)
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @Length(2, 16)
    title: string;

    @ApiProperty()
    @IsInt()
    @IsImgId()
    pic: number;

    @ApiProperty()
    @IsInt()
    @withGoodsCatePid()
    pid: number;

    @ApiProperty({
        type: Number,
    })
    @IsInt()
    order = 0;
}

export class GoodsCateUpdateDTO extends PartialType(GoodsCateCreateDTO) {}

export class GoodsCateListParam {
    @ApiProperty({
        description: '根據name模糊查詢分類',
        required: false,
    })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({
        description: '根據title模糊查詢分類',
        required: false,
    })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty({
        description: '跳過條目',
        required: false,
        default: 0,
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    start: number;

    @ApiProperty({
        description: '獲取多少條目，默認15. 最大100',
        required: false,
        default: 15,
    })
    @IsOptional()
    @IsInt()
    @Max(100)
    end: number;

    @ApiProperty({
        description: '創建時間之前',
        required: false,
    })
    @IsOptional()
    @IsDateString()
    start_date: string;

    @ApiProperty({
        description: '創建時間之後',
        required: false,
    })
    @IsOptional()
    @IsDateString()
    end_date: string;
}
