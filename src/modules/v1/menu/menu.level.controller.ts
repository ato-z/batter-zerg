import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { V1BaseCoontroller } from '@v1/base.controller';
import { query } from 'express';
import {
    MenuLevelCreateDTO,
    MenuLevelListParamDTO,
    MenuLevelUpdateDTO,
} from './menu.level.dto';
import { MenuLevelService } from './menu.level.service';

@Controller(V1BaseCoontroller.toPrefix('menu_level'))
export class MenuLevelController extends V1BaseCoontroller {
    constructor(private readonly menuLevelService: MenuLevelService) {
        super();
    }

    @Get('list')
    async list(@Query() query: MenuLevelListParamDTO) {
        const result = await this.menuLevelService.list(query);
        return result;
    }

    @Get('recall')
    async recallList(@Query() query: MenuLevelListParamDTO) {
        const result = await this.menuLevelService.list(query);
        return result;
    }

    @Post('add')
    async add(@Body() data: MenuLevelCreateDTO) {
        await this.menuLevelService.add(data);
        return { message: '新增成功' };
    }

    @Put('edit/:id')
    async edit(@Param('id') id: number, data: MenuLevelUpdateDTO) {
        await this.menuLevelService.edit(id, data);
        return { message: '已修改' };
    }

    @Delete('delete/:ids')
    async del(@Param('ids') ids: string) {
        const intIds = this.toNumberIds(ids);
        await this.menuLevelService.del(intIds);
        return { message: '已放入回收列表' };
    }

    @Patch('recall/:ids')
    async recall(@Param('ids') ids: string) {
        const intIds = this.toNumberIds(ids);
        await this.menuLevelService.recall(intIds);
        return { message: '已從回收列表中恢復' };
    }

    @Delete('destroy/:ids')
    async destroy(@Param('ids') ids: string) {
        const intIds = this.toNumberIds(ids);
        await this.menuLevelService.destroy(intIds);
        return { message: '已刪除' };
    }
}
