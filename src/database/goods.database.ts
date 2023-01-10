import { Injectable } from '@nestjs/common';
import { GoodsStatus, GoodsSwitchType } from '@src/enum';
import { BaseModel } from './base.database';
import { GoodsTagModel } from './goods.tag.database';

export type GoodsBase = {
    id: number;
    uid: number;
    cate_id: number;
    title: string;
    status: GoodsStatus;
    cover: number;
    message: string;
    type: GoodsSwitchType;
    content: string;
    tags: string[] | string;
    create_date: string;
    delete_date: string | null;
};

const goodsTagModel = new GoodsTagModel();

@Injectable()
export class GoodsModel extends BaseModel<GoodsBase> {
    protected tableName = 'goods';

    getting = {
        cover: async (imgId: number) => (await this.getImage(imgId))?.path,

        async tags(val: string | string[]) {
            if (typeof val !== 'string') return [];
            const ids = val.split(',').filter((item) => item);
            if (ids.length === 0) return [];
            const tags = await goodsTagModel.findNamesByIds(ids);
            return tags;
        },
    };

    setting = {
        async tags(val?: string | string[]) {
            if (val instanceof Array) {
                const tags = await goodsTagModel.findOrCreateNames(val);
                return tags;
            } else {
                return '';
            }
        },
    };
}
