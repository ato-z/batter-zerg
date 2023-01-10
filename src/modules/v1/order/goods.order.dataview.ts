import { ApiProperty } from '@nestjs/swagger';
import { UserAddressDV } from '@v1/user/user.address.dataview';

class SimpleGoodsDV {
    @ApiProperty({
        description: '商品id',
    })
    id: number;

    @ApiProperty({
        description: '商品标题',
    })
    title: string;

    @ApiProperty({
        description: '封面地址',
    })
    cover: string;

    @ApiProperty({
        description: '标签数组',
        isArray: true,
    })
    tags: string;
}

class GoodsOrderListItemDV {
    @ApiProperty({
        description: '订单id',
    })
    id: number;

    @ApiProperty({
        description: '20位的订单号',
    })
    order_no: string;

    @ApiProperty({
        description: '发起交换的用户id',
    })
    from_uid: 1;

    @ApiProperty({
        description: '发起交换用户联系地址快照',
        type: UserAddressDV,
    })
    from_address: UserAddressDV;

    @ApiProperty({
        description: '发起交换用户的商品简要信息',
        type: SimpleGoodsDV,
    })
    from_goods: SimpleGoodsDV;

    @ApiProperty({
        description: '交换用户id',
    })
    to_uid: 1;

    @ApiProperty({
        description: '交换用户联系地址快照',
        type: UserAddressDV,
    })
    to_address: UserAddressDV;

    @ApiProperty({
        description: '交换用户的商品简要信息',
        type: SimpleGoodsDV,
    })
    to_goods: SimpleGoodsDV;

    @ApiProperty({
        description: '交易状态 交换阶段 0发起交换 1交换中 2交换成功 3交换失败',
    })
    status: 0;

    @ApiProperty({
        description: '创建时间',
    })
    create_date: string;

    @ApiProperty({
        description: '删除时间',
    })
    'delete_date': string;
}

export class GoodsOrderListResultDV {
    @ApiProperty({
        description: '订单简要数组',
        isArray: true,
        type: GoodsOrderListItemDV,
    })
    list: GoodsOrderListItemDV[];

    @ApiProperty({
        description: '统计条目',
    })
    total: number;
}

class GoodsOrderRecordDv {
    @ApiProperty({
        description: '交易状态',
    })
    action: string;

    @ApiProperty({
        description: '创建时间',
    })
    create_date: string;
}
export class GoodsOrderDetailDV extends GoodsOrderListItemDV {
    @ApiProperty({
        description: '订单交易记录',
        isArray: true,
    })
    record: GoodsOrderRecordDv;
}
