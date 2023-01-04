import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { StaffLevel, StaffStatusEnum } from '@src/enum';
import {
    IsDateString,
    IsIn,
    IsInt,
    IsNumber,
    IsOptional,
    IsString,
    Length,
    Max,
    MaxLength,
    Min,
} from 'class-validator';

export class StaffLoginDTO {
    @ApiProperty()
    @IsString()
    @Length(4, 12)
    readonly name: string;

    @ApiProperty()
    @IsString()
    @Length(7, 16)
    readonly password: string;
}

export class StaffPropDTO {
    @ApiProperty()
    @IsString()
    @Length(4, 12)
    readonly name: string;

    @ApiProperty()
    @IsString()
    @Length(2, 8)
    readonly nickname: string;

    @ApiProperty()
    @IsNumber()
    readonly cover: number;

    @ApiProperty()
    @IsNumber()
    @IsIn([StaffLevel.ADMIN, StaffLevel.LEADER, StaffLevel.SALESMAN])
    readonly level: number;

    @ApiProperty()
    @IsIn([
        StaffStatusEnum.DIMISSINO,
        StaffStatusEnum.CREATEED,
        StaffStatusEnum.PUBLIC,
    ])
    readonly status: number = StaffStatusEnum.CREATEED;
}

export class StaffCreateDTO extends StaffPropDTO {
    @ApiProperty()
    @IsString()
    @Length(7, 16)
    readonly password: string;

    @ApiProperty()
    @IsString()
    @Length(7, 16)
    readonly rePassword: string;
}

export class StaffUpdateDTO extends PartialType(StaffPropDTO) {}

export class StaffRePasswordDTO {
    @ApiProperty()
    @IsString()
    @Length(7, 16)
    readonly password: string;

    @ApiProperty()
    @IsString()
    @Length(7, 16)
    readonly rePassword: string;
}

/** 獲取列表的參數 */
export class StaffPartiaListParamDTO {
    /** 跳過條目， 默認為0 */
    @IsOptional()
    @IsInt()
    @Min(0)
    @ApiProperty({
        default: 0,
        required: false,
    })
    readonly start?: number;

    /**獲取的條目 10就是獲取10條， 最多一次獲取20條 */
    @IsOptional()
    @IsInt()
    @Max(20)
    @ApiProperty({
        default: 10,
        required: false,
    })
    end?: number;

    /** 查詢用戶名，默認爲空如果傳入則篩選相關的用戶名 */
    @IsOptional()
    @ApiProperty({
        required: false,
    })
    @MaxLength(12, { message: 'name 長度不可超過12' })
    name?: string;

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

    /** 員工狀態 */
    @IsOptional()
    @ApiProperty({
        required: false,
    })
    @IsIn(
        [
            StaffStatusEnum.DIMISSINO,
            StaffStatusEnum.CREATEED,
            StaffStatusEnum.PUBLIC,
        ],
        {
            message: `status 可選值為 ${[
                StaffStatusEnum.DIMISSINO,
                StaffStatusEnum.CREATEED,
                StaffStatusEnum.PUBLIC,
            ].join('|')}`,
        },
    )
    status?: StaffStatusEnum;
}
