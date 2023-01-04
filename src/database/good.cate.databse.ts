import { Injectable } from '@nestjs/common';
import { BaseModel } from './base.database';
import { ImageModel } from './image.databser';

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

const imageModel = new ImageModel();
@Injectable()
export class GoodsCateModel extends BaseModel<GoodsCateBase> {
    protected tableName = 'goods_cate';

    getting = {
        pic: async (imgId: number | string) => {
            if (typeof imgId === 'number') {
                const img = await imageModel.find(imgId);
                return img.data.path;
            }
            return imgId;
        },
    };
}
