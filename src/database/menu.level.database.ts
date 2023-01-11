import { StaffLevel, Visit } from '@src/enum';
import { BaseModel } from './base.database';

export type MenuLevelBase = {
    id: number;
    model: string;
    all: Visit;
    get: Visit;
    post: Visit;
    delete: Visit;
    put: Visit;
    patch: Visit;
    level: StaffLevel;
    create_date: string;
    delete_date: string | null;
};
export class MenuLevelModel extends BaseModel<MenuLevelBase> {
    protected tableName = 'menu_level';
}
