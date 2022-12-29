import { Module } from '@nestjs/common';
import { V1StaffModule } from './staff';
import { V1UploadModule } from './upload';

@Module({
    imports: [V1StaffModule, V1UploadModule],
    controllers: [],
    providers: [],
})
export class V1Module {}
