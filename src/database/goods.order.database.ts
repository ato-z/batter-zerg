import { Injectable } from '@nestjs/common';
import { BaseModel } from './base.database';

export type GoodsOrderBase = {
    id: number;
    order_no: string;
    from_uid: number;
    from_goods_id: number;
    from_address: string;
    to_uid: number;
    to_goods_id: number;
    to_address: string;
    status: number;
    create_date: string;
    delete_date: string | null;
};

const deCodeAddressJSON = (json: string) => {
    try {
        const data = JSON.parse(json);
        return data;
    } catch {
        return json;
    }
};

@Injectable()
export class GoodsOrderModel extends BaseModel<GoodsOrderBase> {
    protected tableName = 'goods_order';

    getting = {
        from_address: (json: string) => deCodeAddressJSON(json),
        to_address: (json: string) => deCodeAddressJSON(json),
    };
}
