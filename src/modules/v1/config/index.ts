import { ConfigModel } from '@database/config.database';
import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { ConfigController } from './config.controller';

@Module({
    controllers: [ConfigController],
    providers: [ConfigService, ConfigModel],
})
export class V1ConfigModule {}
