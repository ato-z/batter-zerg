import { Injectable } from '@nestjs/common';
import { type } from 'os';
import { BaseModel } from './base.database';
import { ImageModel } from './image.databser';
import { SchoolModel } from './school.database';

export type UserBase = {
    id: number;
    openid: string;
    union_id: string;
    schools_id: string;
    nickname: string;
    avatar: number;
    gender: 0 | 1 | 2;
    city: string;
    province: string;
    country: string;
    mobile: string;
    create_date: string;
    delete_date: string | null;
};
export type SimpleUeseBase = Pick<UserBase, 'id' | 'avatar' | 'nickname'>;

const schoolsModel = new SchoolModel();
const imageModel = new ImageModel();

@Injectable()
export class UserModel extends BaseModel<UserBase> {
    protected tableName = 'user';
    hideing: Array<keyof UserBase> = ['schools_id'];

    getting = {
        async avatar(imgId: number) {
            if (typeof imgId === 'number') {
                const img = await imageModel.find(imgId);
                const { path } = await img.toJSON();
                return path;
            }
            return imgId;
        },
    };

    async findSchoolByID(schoolsId: number | string) {
        const school = await schoolsModel.find(schoolsId);
        return school.data;
    }
}
