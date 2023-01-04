import {
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    Length,
    Max,
    Min,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
export class SchoolCreateDTO {
    @ApiProperty({
        description: '唯一的学校名称',
    })
    @IsString()
    @Length(2, 20)
    readonly name: string;

    @ApiProperty({
        description: '經度',
    })
    @IsNotEmpty()
    @IsString()
    readonly latitude: string;

    @ApiProperty({
        description: '緯度',
    })
    @IsNotEmpty()
    @IsString()
    readonly longitude: string;
}

export class SchoolUpdateDTO extends PartialType(SchoolCreateDTO) {}

export class SchoolListParam {
    /** 跳過條目， 默認為0 */
    @IsOptional()
    @IsInt()
    @Min(0)
    @ApiProperty({
        default: 0,
        required: false,
    })
    readonly start?: number;

    /**獲取的條目 10就是獲取10條， 最多一次獲取50條 */
    @IsOptional()
    @IsInt()
    @Max(50)
    @ApiProperty({
        default: 10,
        required: false,
    })
    end?: number;

    /** 查詢學校名 */
    @IsOptional()
    @ApiProperty({
        required: false,
    })
    @Length(2, 20)
    name?: string;
}
