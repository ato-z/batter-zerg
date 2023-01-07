import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, Max, Min } from 'class-validator';

export class UserListParamDTO {
    @ApiProperty({
        description: '模糊查询的用戶名，游客的name為null',
        required: false,
    })
    @IsOptional()
    nickname?: string;

    @ApiProperty({
        description: '精准查询open_id',
        required: false,
    })
    @IsOptional()
    open_id?: string;

    @ApiProperty({
        description: '跳過條目，默認為0',
        default: 0,
        required: false,
    })
    @IsInt()
    @Min(0)
    start = 0;

    @ApiProperty({
        description: '獲取條目，默認為15，最多為100',
        default: 15,
        required: false,
    })
    @IsInt()
    @Max(100)
    end = 15;

    /** 開始時間 */
    @IsOptional()
    @ApiProperty({
        required: false,
    })
    @IsDateString(undefined, {
        message: 'start_date為 y-m-d h:i:s 時間格式的字符串',
    })
    start_date?: string;

    /** 結束時間 */
    @IsOptional()
    @ApiProperty({
        required: false,
    })
    @IsDateString(undefined, {
        message: 'end_date為 y-m-d h:i:s 時間格式的字符串',
    })
    end_date?: string;
}
