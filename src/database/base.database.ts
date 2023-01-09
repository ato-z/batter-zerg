import { databaseConfig } from '@config/database';
import { createPool } from 'mysql';
import DataBaseModel from 'mysql-crud-model';

const { host, port, password, database, user, table_prefix } = databaseConfig;
const pool = createPool({ host, port, password, database, user });

export type SelectOption<T extends BaseModel<any>['selete']> = T extends (
    o: infer O,
) => unknown
    ? O
    : never;

export class BaseModel<T> extends DataBaseModel<T> {
    protected prefix: string = table_prefix;
    constructor() {
        super(pool); // 傳入鏈接池
    }
}
