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

export class MenuLevelItemDV {
    @ApiProperty({
        description: '标题',
    })
    id: number;

    @ApiProperty({
        description: '标题',
    })
    title: string;

    @ApiProperty({
        description: '权限',
    })
    level: number;

    @ApiProperty({
        description: '模块名',
    })
    model: string;

    @ApiProperty({
        description: '任意 请求',
    })
    all: number;

    @ApiProperty({
        description: 'GET 请求',
    })
    get: number;

    @ApiProperty({
        description: 'POST 请求',
    })
    post: number;

    @ApiProperty({
        description: 'PUT 请求',
    })
    put: number;

    @ApiProperty({
        description: 'DELETE 请求',
    })
    delete: number;

    @ApiProperty({
        description: 'patch 请求',
    })
    patch: number;
}

export class MenuLevelListResultDV {
    @ApiProperty({
        description: '一组权限列表',
        isArray: true,
    })
    list: MenuLevelItemDV;

    @ApiProperty({
        description: '统计条目',
    })
    total: number;
}
