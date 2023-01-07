import { GoodsCateModel } from '@database/good.cate.databse';
import { GoodsModel } from '@database/goods.database';
import { GoodsLikeModel } from '@database/goods.llike.database';
import { GoodsObserveModel } from '@database/goods.observe.database';
import { GoodsTagModel } from '@database/goods.tag.database';
import { UserModel } from '@database/user.database';
import { Module } from '@nestjs/common';
import { GoodsCateController } from './goods.cate.controller';
import { GoodsCateService } from './goods.cate.service';
import { GoodsController } from './goods.controller';
import { GoodsService } from './goods.service';
@Module({
    imports: [],
    controllers: [GoodsCateController, GoodsController],
    providers: [
        GoodsCateService,
        GoodsService,
        GoodsCateModel,
        GoodsModel,
        GoodsLikeModel,
        GoodsObserveModel,
        GoodsTagModel,
        UserModel,
    ],
})
export class V1GoodsModule {}
