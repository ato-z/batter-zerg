import { Injectable } from '@nestjs/common';
import { BaseModel } from './base.database';

export type GoodsObserveBase = {
    id: number;
    uid: number;
    goods_id: number;
    from_id: number;
    content: string;
    status: string;
    create_date: string;
    delete_date: string | null;
};
@Injectable()
export class GoodsObserveModel extends BaseModel<GoodsObserveBase> {
    protected tableName = 'goods_observe';
}
