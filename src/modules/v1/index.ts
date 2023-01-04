import { Module } from '@nestjs/common';
import { V1GoodsModule } from './goods';
import { V1MenuModule } from './menu';
import { V1SchoolModule } from './school';
import { V1StaffModule } from './staff';
import { V1UploadModule } from './upload';

@Module({
    imports: [
        V1StaffModule,
        V1UploadModule,
        V1SchoolModule,
        V1MenuModule,
        V1GoodsModule,
    ],
    controllers: [],
    providers: [],
})
export class V1Module {}
