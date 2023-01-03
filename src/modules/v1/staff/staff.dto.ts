import { PartialType } from '@nestjs/mapped-types';
import { StaffLevel, StaffStatusEnum } from '@src/enum';
import { IsIn, IsNumber, IsString, Length, Max } from 'class-validator';

export class StaffLoginDTO {
    @IsString()
    @Length(4, 12)
    readonly name: string;

    @IsString()
    @Length(7, 16)
    readonly password: string;
}

export class StaffPropDTO {
    @IsString()
    @Length(4, 12)
    readonly name: string;

    @IsString()
    @Length(2, 8)
    readonly nickname: string;

    @IsNumber()
    readonly cover: number;

    @IsNumber()
    @IsIn([StaffLevel.ADMIN, StaffLevel.LEADER, StaffLevel.SALESMAN])
    readonly level: number;

    @IsIn([
        StaffStatusEnum.DIMISSINO,
        StaffStatusEnum.CREATEED,
        StaffStatusEnum.PUBLIC,
    ])
    readonly status: number;
}

export class StaffCreateDTO extends StaffPropDTO {
    @IsString()
    @Length(7, 16)
    readonly password: string;

    @IsString()
    @Length(7, 16)
    readonly rePassword: string;
}

export class StaffUpdateDTO extends PartialType(StaffPropDTO) {}

export class StaffRePasswordDTO {
    @IsString()
    @Length(7, 16)
    readonly password: string;

    @IsString()
    @Length(7, 16)
    readonly rePassword: string;
}
