import { Injectable } from '@nestjs/common';
import { BaseModel } from './base.database';
import { ImageModel } from './image.databser';

export type StaffBase = {
    id: number;
    name: string;
    nickname: string;
    cover: number | string;
    level: number;
    password: string;
    status: number;
    create_date: string;
    delete_date: string | null;
};

const imageModel = new ImageModel();

@Injectable()
export class StaffModel extends BaseModel<StaffBase> {
    protected tableName = 'staff';

    getting = {
        cover: async (imgId: number | string) => {
            if (typeof imgId === 'number') {
                const img = await imageModel.find(imgId);
                const { path } = await img.toJSON();
                return path;
            }
            return imgId;
        },
    };
}
