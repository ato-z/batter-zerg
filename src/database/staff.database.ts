import { Injectable } from '@nestjs/common';
import { BaseModel } from './base.database';

export type StaffBase = {
    id: number;
    name: string;
    nickname: string;
    cover: number;
    level: number;
    password: string;
    status: number;
    create_date: string;
    delete_date: string | null;
};
@Injectable()
export class StaffModel extends BaseModel<StaffBase> {
    protected tableName = 'staff';
}
