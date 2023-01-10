import { StaffLevel } from '@src/enum';
import { BaseModel } from './base.database';

export type MenuLevelBase = {
    id: number;
    model: string;
    get: number;
    post: number;
    delete: number;
    put: number;
    patch: number;
    level: StaffLevel;
    create_date: string;
    delete_date: string | null;
};
export class MenuLevelModel extends BaseModel<MenuLevelBase> {
    protected tableName = 'menu_level';
}
