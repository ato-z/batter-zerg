import { GoodsOrderModel } from '@database/goods.order.database';
import { StaffBase } from '@database/staff.database';
import { Injectable, NotFoundException } from '@nestjs/common';
import { date, filterEmpty, pickObject } from '@src/tool';
import type { SelectOption } from '@database/base.database';
import { GoodsOrderListParamDTO } from './goods.order.dto';
import { OP } from 'mysql-crud-core/enum';
import { GoodsModel, type GoodsBase } from '@database/goods.database';
import { GoodsOrderReacordModel } from '@database/goods.order.record.database';

export type SelectGoodsOrderOption = SelectOption<GoodsOrderModel['selete']>;

@Injectable()
export class GoodsOrderSercive {
    constructor(
        private readonly goodsOrderModel: GoodsOrderModel,
        private readonly goodsOrderRecord: GoodsOrderReacordModel,
        private readonly goodsModel: GoodsModel,
    ) {}

    /** 生成20位订单号 */
    private codeOrderNO(staff: Partial<StaffBase>) {
        const em = String.fromCharCode((staff.id % 26) + 97).toUpperCase();
        const after = Math.random().toString();
        const now = date('ymdhis');
        return `${em}${now}${after.substring(after.length - 5, after.length)}`;
    }

    private codeListParam(query: GoodsOrderListParamDTO) {
        const filterQuery = filterEmpty(query);
        const option: SelectGoodsOrderOption = {
            where: { and: { delete_date: null } },
            limit: [filterQuery.start ?? 0, filterQuery.end ?? 10],
            order: ['id', 'DESC'],
        };
        if (filterQuery.order_no !== undefined)
            option.where.and.order_no = filterQuery.order_no;
        if (filterQuery.status !== undefined)
            option.where.and.status = filterQuery.start;
        let create_date = null;
        if (filterQuery.start_date && filterQuery.end_date) {
            create_date = [
                OP.BETWEEN,
                [filterQuery.start_date, filterQuery.end_date],
            ];
        } else if (filterQuery.start_date) {
            create_date = [OP.EGT, filterQuery.start_date];
        } else if (query.end_date) {
            create_date = [OP.ELT, filterQuery.end_date];
        }
        if (create_date !== null) option.where.and.create_date = create_date;
        return option;
    }

    private async getGoodsMap(goodsIds: number[]) {
        const goodsList = await this.goodsModel.selete({
            where: { and: { id: [OP.IN, goodsIds] } },
        });
        if (goodsList === null) return {};
        const map = {};
        await Promise.all(
            goodsList.map(async (goods) => {
                const data = await goods.toJSON();
                map[data.id] = pickObject(data, [
                    'id',
                    'cover',
                    'tags',
                    'title',
                ]);
                return data;
            }),
        );

        return map;
    }

    /** 获取普通列表 */
    async list(query: GoodsOrderListParamDTO) {
        const option = this.codeListParam(query);
        const list = await this.goodsOrderModel.selete(option);
        const total = await this.goodsOrderModel.total(option);
        if (list === null) return { list: [], total };
        const goodsIds: number[] = [];
        list.forEach((item) => {
            goodsIds.push(item.data.from_goods_id);
            goodsIds.push(item.data.to_goods_id);
        });
        const goodsMap = await this.getGoodsMap(goodsIds);
        const listData = await Promise.all(
            list.map((item) => {
                item.hidden(['from_goods_id', 'to_goods_id']);
                item.append({
                    from_goods: (data) => goodsMap[data.from_goods_id],
                    to_goods: (data) => goodsMap[data.to_goods_id],
                });
                return item.toJSON();
            }),
        );
        return {
            list: listData,
            total,
        };
    }

    /** 获取详情 */
    async detail(orderId: number) {
        const order = await this.goodsOrderModel.find(orderId);
        if (order === null) throw new NotFoundException('订单不存在');
        const goodsMap = await this.getGoodsMap([
            order.data.from_goods_id,
            order.data.to_goods_id,
        ]);
        const record = await this.goodsOrderRecord.selete({
            where: { and: { order_id: orderId } },
        });
        order.hidden(['from_goods_id', 'to_goods_id']);
        order.append({
            from_goods: (data) => goodsMap[data.from_goods_id],
            to_goods: (data) => goodsMap[data.to_goods_id],
            record: () => Promise.all(record.map((i) => i.toJSON())),
        });
        return order.toJSON();
    }
}
