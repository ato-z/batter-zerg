import { Injectable } from '@nestjs/common';
import { BaseModel } from './base.database';

export type UserAddressBase = {
    id: number;
    uid: number;
    nickname: string;
    province: string;
    city: string;
    country: string;
    detail: string;
    mobile: string;
    wechat: string;
    longitude: string;
    latitude: string;
    create_date: string;
    delete_date: string | null;
};

@Injectable()
export class UserAddressModel extends BaseModel<UserAddressBase> {
    protected tableName = 'user_address';
}
