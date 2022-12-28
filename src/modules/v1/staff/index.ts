import { Module } from '@nestjs/common';
import { StaffModel } from '@database/staff.database';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';
import { TokenService } from '@v1/token.service';

@Module({
    imports: [],
    controllers: [StaffController],
    providers: [StaffService, StaffModel, TokenService],
})
export class V1StaffModule {}
