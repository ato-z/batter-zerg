import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { V1BaseCoontroller } from '@v1/base.controller';
import { MenuService } from './menu.service';

@ApiTags('菜單模塊')
@Controller(V1BaseCoontroller.toPrefix('menu'))
export class MenuController {
    constructor(private readonly menuService: MenuService) {}

    @Get('index')
    async index() {
        const menu = await this.menuService.index();
        console.log('菜單索引');
        return menu;
    }
}
