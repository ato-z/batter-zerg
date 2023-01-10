import { ApiProperty } from '@nestjs/swagger';

export class MenuItemDV {
    @ApiProperty()
    title: string;
}
export class MenuTreeDV {}

export class MenuMessageDV {
    message: string;
}
