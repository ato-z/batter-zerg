import { IsString, Length } from 'class-validator';

export class StaffLoginDTO {
    @IsString()
    @Length(4, 12)
    readonly name: string;

    @IsString()
    @Length(7, 16)
    readonly password: string;
}
