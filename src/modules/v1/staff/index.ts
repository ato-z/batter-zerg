import { Module } from '@nestjs/common';
import { StaffModel } from '@database/staff.database';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';
import { TokenService } from '@src/modules/token.service';
import { ImageModel } from '@database/image.databser';

@Module({
    imports: [],
    controllers: [StaffController],
    providers: [StaffService, StaffModel, TokenService, ImageModel],
})
export class V1StaffModule {}
