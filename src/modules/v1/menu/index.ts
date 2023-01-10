import { MenuModel } from '@database/menu.database';
import { StaffModel } from '@database/staff.database';
import { Module } from '@nestjs/common';
import { TokenService } from '@src/modules/token.service';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
@Module({
    imports: [],
    controllers: [MenuController],
    providers: [MenuService, MenuModel, TokenService, StaffModel],
})
export class V1MenuModule {}
