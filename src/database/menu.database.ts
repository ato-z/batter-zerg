import { Injectable } from '@nestjs/common';
import { StaffLevel } from '@src/enum';
import { BaseModel } from './base.database';

export type MenuBase = {
    id: number;
    title: string;
    path: string;
    pid: number;
    icon: number;
    level: StaffLevel;
    create_date: string;
    delete_date: string | null;
};

@Injectable()
export class MenuModel extends BaseModel<MenuBase> {
    protected tableName = 'menu';
    hideing: Array<keyof MenuBase> = ['create_date', 'delete_date'];

    getting = {
        icon: async (imgId: number) => (await this.getImage(imgId))?.path,
    };
}
