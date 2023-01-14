import { Module } from '@nestjs/common';
import { DataViewController } from './dataview.controller';

@Module({
    controllers: [DataViewController],
    providers: [],
})
export class V1DataViewModule {}
