import { ApiProperty } from '@nestjs/swagger';
import { IsImgId, withGoodsCatePid } from '@src/tool/validator';
import { IsInt, IsNotEmpty, Length } from 'class-validator';

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

    @ApiProperty()
    @IsInt()
    order = 0;
}
