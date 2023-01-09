import { GoodsOrderState } from '@src/enum';
import { BaseModel } from './base.database';

type GoodsOrderReacordBase = {
    id: number;
    order_id: number;
    action: number;
    create_date: string;
};
export class GoodsOrderReacordModel extends BaseModel<GoodsOrderReacordBase> {
    protected tableName = 'goods_order_record';

    getting = {
        action(action: number) {
            if (action === GoodsOrderState.CREATE) return '創建訂單';
            if (action === GoodsOrderState.EXCHANGE) return '交換中';
            if (action === GoodsOrderState.SUCCESS) return '交換成功';
            if (action === GoodsOrderState.ERROR) return '交換取消';
            return '未知狀態';
        },
    };
}
