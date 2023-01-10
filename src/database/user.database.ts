import { Injectable } from '@nestjs/common';
import { BaseModel } from './base.database';
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

@Injectable()
export class UserModel extends BaseModel<UserBase> {
    protected tableName = 'user';
    hideing: Array<keyof UserBase> = ['schools_id'];

    getting = {
        avatar: async (imgId: number) => (await this.getImage(imgId))?.path,
    };

    async findSchoolByID(schoolsId: number | string) {
        if (schoolsId === null) return null;
        const school = await schoolsModel.find(schoolsId);
        if (school === null) return null;
        return school.data;
    }
}
