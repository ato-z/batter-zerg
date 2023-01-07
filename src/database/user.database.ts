import { Injectable } from '@nestjs/common';
import { BaseModel } from './base.database';
import { ImageModel } from './image.databser';
import { SchoolModel } from './school.database';

export type UserBase = {
    id: number;
    open_id: string;
    union_id: string | null;
    schools_id: string | null;
    nickname: string | null;
    avatar: number | null;
    gender: 0 | 1 | 2;
    city: string | null;
    province: string | null;
    country: string | null;
    mobile: string | null;
    create_date: string;
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
        if (schoolsId === null) return null;
        const school = await schoolsModel.find(schoolsId);
        if (school === null) return null;
        return school.data;
    }
}
