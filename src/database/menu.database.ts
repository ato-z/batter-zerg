import { Injectable } from '@nestjs/common';
import { BaseModel } from './base.database';

export type MenuBase = {
    id: number;
    title: string;
    path: string;
    pid: number;
    create_date: string;
    delete_date: string | null;
};
@Injectable()
export class MenuModel extends BaseModel<MenuBase> {
    protected tableName = 'schools';
}
