import { Injectable } from '@nestjs/common';
import { GoodsStatus, GoodsSwitchType } from '@src/enum';
import { ApiException } from '@src/exceptions';
import { BaseModel } from './base.database';
import { GoodsTagModel } from './goods.tag.database';
import { ImageModel } from './image.databser';

type GoodsBase = {
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
    detele_date: string | null;
};

const imageModel = new ImageModel();
const goodsTagModel = new GoodsTagModel();

@Injectable()
export class GoodsModel extends BaseModel<GoodsBase> {
    protected tableName = 'goods';

    getting = {
        async cover(imgId: number) {
            if (typeof imgId === 'number') {
                const img = await imageModel.find(imgId);
                const { path } = await img.toJSON();
                return path;
            }
            return imgId;
        },

        async tags(val: string | string[]) {
            if (typeof val !== 'string') return [];
            const tags = await goodsTagModel.findOrCreateNames(
                val.substring(1).split(','),
            );
            return tags;
        },
    };

    setting = {
        async tags(val?: string | string[]) {
            if (val instanceof Array) {
                const tags = await goodsTagModel.findOrCreateNames(val);
                return tags;
            }
            throw new ApiException('tags 必須為字符串數組');
        },
    };
}
