import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { V1BaseCoontroller } from '@v1/base.controller';
import { GoodsOrderListParamDTO } from '@v1/order/goods.order.dto';
import {
    GoodsOrderDetailDV,
    GoodsOrderListResultDV,
} from './goods.order.dataview';
import { GoodsOrderSercive } from './goods.order.service';

@ApiTags('物品订单')
@Controller(V1BaseCoontroller.toPrefix('order'))
export class GoodsOrderController {
    constructor(private readonly goodsOrderService: GoodsOrderSercive) {}

    @ApiHeader({
        name: 'token',
        description: '臨時密鑰',
        required: true,
    })
    @ApiResponse({
        description: '返回一組订单列表',
        type: GoodsOrderListResultDV,
    })
    @Get('list')
    async list(@Query() query: GoodsOrderListParamDTO) {
        const result = await this.goodsOrderService.list(query);
        return result;
    }

    @ApiHeader({
        name: 'token',
        description: '臨時密鑰',
        required: true,
    })
    @ApiResponse({
        description: '返回订单详情',
        type: GoodsOrderDetailDV,
    })
    @Get('data/:order_id')
    async data(@Param('order_id') orderId: number) {
        const result = await this.goodsOrderService.detail(orderId);
        return result;
    }
}
