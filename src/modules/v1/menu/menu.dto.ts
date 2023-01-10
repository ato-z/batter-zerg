import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { StaffLevel } from '@src/enum';
import { IsImgId, withGoodsCatePid } from '@src/tool/validator';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MenuCreateDTO {
    @ApiProperty({
        description: '标题',
    })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({
        description: '路由地址',
    })
    @IsNotEmpty()
    @IsString()
    path: string;

    @ApiProperty({
        description: '父级id',
    })
    @IsOptional()
    @withGoodsCatePid()
    pid: number;

    @ApiProperty({
        description: '图标',
    })
    @IsImgId()
    icon: number;

    @ApiProperty({
        description: '等级',
    })
    @IsIn([StaffLevel.SALESMAN, StaffLevel.LEADER, StaffLevel.ADMIN])
    level: StaffLevel;
}

export class MenuUpdataDTO extends PartialType(MenuCreateDTO) {}
