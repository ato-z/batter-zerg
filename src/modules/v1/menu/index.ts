import { MenuModel } from '@database/menu.database';
import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
@Module({
    imports: [],
    controllers: [MenuController],
    providers: [MenuService, MenuModel],
})
export class V1MenuModule {}
