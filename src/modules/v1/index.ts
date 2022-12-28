import { Module } from '@nestjs/common';
import { V1StaffModule } from './staff';

@Module({
    imports: [V1StaffModule],
    controllers: [],
    providers: [],
})
export class V1Module {}
