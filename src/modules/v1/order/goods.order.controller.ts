import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { V1BaseCoontroller } from '@v1/base.controller';
import { GoodsListParamDTO } from '@v1/goods/goods.dto';
import { GoodsOrderSercive } from './goods.order.service';

@ApiTags('物品订单')
@Controller(V1BaseCoontroller.toPrefix('order'))
export class GoodsOrderController {
    constructor(private readonly goodsOrderService: GoodsOrderSercive) {}

    @Get('list')
    async list(@Query() query: GoodsListParamDTO) {
        const result = await this.goodsOrderService.list(query);
        return result;
    }

    @Get('data/:order_id')
    async data(@Param('order_id') orderId: number) {
        const result = await this.goodsOrderService.detail(orderId);
        return result;
    }
}
