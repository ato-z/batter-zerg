import { IsString, Length } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
export class SchoolCreateDTO {
    @IsString()
    @Length(2, 20)
    readonly name: string;

    @IsString()
    readonly latitude: string;

    @IsString()
    readonly longitude: string;
}

export class SchoolUpdateDTO extends PartialType(SchoolCreateDTO) {}
