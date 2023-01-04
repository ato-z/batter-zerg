import { GoodsCateModel } from '@database/good.cate.databse';
import { Module } from '@nestjs/common';
import { GoodsCateController } from './goods.cate.controller';
import { GoodsCateService } from './goods.cate.service';
@Module({
    imports: [],
    controllers: [GoodsCateController],
    providers: [GoodsCateModel, GoodsCateService],
})
export class V1GoodsModule {}
