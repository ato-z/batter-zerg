import { GoodsCateModel } from '@database/good.cate.databse';
import { GoodsModel } from '@database/goods.database';
import { Module } from '@nestjs/common';
import { GoodsCateController } from './goods.cate.controller';
import { GoodsCateService } from './goods.cate.service';
import { GoodsController } from './goods.controller';
import { GoodsService } from './goods.service';
@Module({
    imports: [],
    controllers: [GoodsCateController, GoodsController],
    providers: [GoodsCateModel, GoodsCateService, GoodsModel, GoodsService],
})
export class V1GoodsModule {}
