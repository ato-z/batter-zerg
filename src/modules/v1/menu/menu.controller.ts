import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import { ApiHeader, ApiParam, ApiProperty, ApiTags } from '@nestjs/swagger';
import { V1BaseCoontroller } from '@v1/base.controller';
import { MenuMessageDV } from './menu.dataview';
import { MenuCreateDTO, MenuUpdataDTO } from './menu.dto';
import { MenuService } from './menu.service';

@ApiTags('菜單模塊')
@Controller(V1BaseCoontroller.toPrefix('menu'))
export class MenuController extends V1BaseCoontroller {
    constructor(private readonly menuService: MenuService) {
        super();
    }

    @Get('index')
    async index() {
        const menu = await this.menuService.index();
        return menu;
    }

    @ApiProperty({
        description: '新增分類',
        type: MenuMessageDV,
    })
    @ApiHeader({
        name: 'token',
        description: '臨時密鑰',
        required: true,
    })
    @Post('add')
    async add(@Body() data: MenuCreateDTO) {
        await this.menuService.add(data);
        return { message: '已添加分類' };
    }

    @ApiProperty({
        description: '編輯分類，傳入對應的新增字段進行更新',
        type: MenuMessageDV,
    })
    @ApiHeader({
        name: 'token',
        description: '臨時密鑰',
        required: true,
    })
    @Put('edit/:menu_id')
    async edit(
        @Param('menu_id') menuId: number,
        @Body() updata: MenuUpdataDTO,
    ) {
        await this.menuService.edit(updata, menuId);
        return { message: '操作成功' };
    }

    @ApiProperty({
        description: '刪除分類',
        type: MenuMessageDV,
    })
    @ApiParam({
        name: 'menu_ids',
        description: '分類id1,分類id2,分類id3',
    })
    @ApiHeader({
        name: 'token',
        description: '臨時密鑰',
        required: true,
    })
    @Delete('delete/:menu_ids')
    async del(@Param('menu_ids') menuIds: string) {
        const ids = this.toNumberIds(menuIds);
        await this.menuService.del(ids);
        return { message: '已刪除' };
    }
}
