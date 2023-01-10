import { MenuModel } from '@database/menu.database';
import { MenuLevelModel } from '@database/menu.level.database';
import { StaffModel } from '@database/staff.database';
import { Module } from '@nestjs/common';
import { TokenService } from '@src/modules/token.service';
import { MenuController } from './menu.controller';
import { MenuLevelController } from './menu.level.controller';
import { MenuLevelService } from './menu.level.service';
import { MenuService } from './menu.service';
@Module({
    imports: [],
    controllers: [MenuController, MenuLevelController],
    providers: [
        MenuService,
        MenuModel,
        TokenService,
        StaffModel,
        MenuLevelModel,
        MenuLevelService,
    ],
})
export class V1MenuModule {}
