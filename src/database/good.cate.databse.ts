import { Injectable } from '@nestjs/common';
import { BaseModel } from './base.database';

export type GoodsCateBase = {
    id: number;
    title: string;
    name: string;
    pid: number;
    pic: number;
    order: number;
    create_date: string;
    delete_date: string | null;
};

@Injectable()
export class GoodsCateModel extends BaseModel<GoodsCateBase> {
    protected tableName = 'goods_cate';

    getting = {
        pic: async (imgId: number) => (await this.getImage(imgId))?.path,
    };
}
