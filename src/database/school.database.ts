import { Injectable } from '@nestjs/common';
import { BaseModel } from './base.database';

export type SchoolBase = {
    id: number;
    name: string;
    latitude: string;
    longitude: string;
    create_date: string;
    delete_date: string | null;
};
@Injectable()
export class SchoolModel extends BaseModel<SchoolBase> {
    protected tableName = 'schools';
}
