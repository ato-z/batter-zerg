import { GoodsModel } from '@database/goods.database';
import { GoodsOrderModel } from '@database/goods.order.database';
import { GoodsOrderReacordModel } from '@database/goods.order.record.database';
import { Module } from '@nestjs/common';
import { GoodsOrderController } from './goods.order.controller';
import { GoodsOrderSercive } from './goods.order.service';

@Module({
    controllers: [GoodsOrderController],
    providers: [
        GoodsOrderSercive,
        GoodsOrderModel,
        GoodsModel,
        GoodsOrderReacordModel,
    ],
})
export class V1OrderModule {}
