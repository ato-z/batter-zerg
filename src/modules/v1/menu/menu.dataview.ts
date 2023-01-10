import { ApiProperty, OmitType } from '@nestjs/swagger';

export class MenuItemDV {
    @ApiProperty({
        description: '菜單id',
    })
    id: number;

    @ApiProperty({
        description: '標題',
    })
    title: string;

    @ApiProperty({
        description: '路由地址',
    })
    path: string;

    @ApiProperty({
        description: '父級id',
    })
    pid: number;

    @ApiProperty({
        description: '可訪問權限',
    })
    level: number;

    @ApiProperty({
        description: '子菜單',
        type: OmitType(MenuItemDV, ['children']),
    })
    children: MenuItemDV[];
}

export class MenuMessageDV {
    message: string;
}
