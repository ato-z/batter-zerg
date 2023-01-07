import { Injectable } from '@nestjs/common';
import { BaseModel } from './base.database';

export type GoodsLikeBase = {
    id: number;
    uid: number;
    goods_id: number;
    create_date: string;
    delete_date: string | null;
};
@Injectable()
export class GoodsLikeModel extends BaseModel<GoodsLikeBase> {
    protected tableName = 'goods_like';
}
