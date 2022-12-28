import { Module } from '@nestjs/common';
import { StaffModel } from '@database/staff.database';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';

@Module({
    imports: [],
    controllers: [StaffController],
    providers: [StaffService, StaffModel],
})
export class V1StaffModule {}
