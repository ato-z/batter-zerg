import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { StaffLevel, Visit } from '@src/enum';
import { IsIn, IsInt, IsOptional, Max, MaxLength, Min } from 'class-validator';

export class MenuLevelCreateDTO {
    @ApiProperty({
        description: '标题',
    })
    @MaxLength(100)
    title: string;

    @ApiProperty({
        description: '权限',
    })
    @IsIn([StaffLevel.SALESMAN, StaffLevel.LEADER, StaffLevel.ADMIN])
    level: StaffLevel;

    @ApiProperty({
        description: '模块名',
    })
    @MaxLength(100)
    model: string;

    @ApiProperty({
        description: '任意 请求',
    })
    @IsIn([Visit.BAN, Visit.RELEASE])
    all: Visit;

    @ApiProperty({
        description: 'GET 请求',
    })
    @IsIn([Visit.BAN, Visit.RELEASE])
    get: Visit;

    @ApiProperty({
        description: 'POST 请求',
    })
    @IsIn([Visit.BAN, Visit.RELEASE])
    post: Visit;

    @ApiProperty({
        description: 'PUT 请求',
    })
    @IsIn([Visit.BAN, Visit.RELEASE])
    put: Visit;

    @ApiProperty({
        description: 'DELETE 请求',
    })
    @IsIn([Visit.BAN, Visit.RELEASE])
    delete: Visit;

    @ApiProperty({
        description: 'patch 请求',
    })
    @IsIn([Visit.BAN, Visit.RELEASE])
    patch: Visit;
}

export class MenuLevelUpdateDTO extends PartialType(MenuLevelCreateDTO) {}

export class MenuLevelListParamDTO {
    @ApiProperty({
        description: '权限类型',
        required: false,
        default: 0,
        type: Number,
    })
    @IsOptional()
    @IsIn([StaffLevel.SALESMAN, StaffLevel.SALESMAN, StaffLevel.ADMIN])
    level: StaffLevel;

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
        description: '獲取多少條目，默認25. 最大100',
        required: false,
        default: 10,
        type: Number,
    })
    @IsOptional()
    @IsInt()
    @Max(100)
    end = 25;
}
