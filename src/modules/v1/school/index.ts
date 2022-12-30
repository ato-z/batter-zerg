import { SchoolModel } from '@database/school.database';
import { Module } from '@nestjs/common';
import { SchoolController } from './school.controller';
import { SchoolService } from './school.service';
@Module({
    imports: [],
    controllers: [SchoolController],
    providers: [SchoolService, SchoolModel],
})
export class V1SchoolModule {}
