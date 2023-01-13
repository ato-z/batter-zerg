import { Injectable } from '@nestjs/common';
import { ConfigType } from '@src/enum';
import { type } from 'os';
import { BaseModel } from './base.database';

export type ConfigBase = {
    id: number;
    name: string;
    des: string;
    value: string;
    type: number;
    group: string;
    order: number;
    create_date: string;
    delete_date: string | null;
};

export type ConfigSeleteValue = {
    option: Array<{ title: string; value: string }>;
    selectIndex: number;
};

@Injectable()
export class ConfigModel extends BaseModel<ConfigBase> {
    protected tableName = 'config';
    hideing: Array<keyof ConfigBase> = ['create_date', 'delete_date'];

    getting = {
        value: async (value: string, key: 'value', data: ConfigBase) => {
            if (data.type === ConfigType.SELECT) {
                return JSON.parse(value) as ConfigSeleteValue;
            }
            if (data.type === ConfigType.SWITCH) {
                return value === '1' ? true : false;
            }
            if (data.type === ConfigType.UPLOAD_IMG) {
                const img = await this.getImage(data.value);
                return img;
            }
            return value;
        },
    };
}
