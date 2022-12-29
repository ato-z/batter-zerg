import { appConfig } from '@config/app';
import { Injectable } from '@nestjs/common';
import { BaseModel } from './base.database';

export type ImageBase = {
    id: number;
    path: string;
    width: number;
    height: number;
    size: number;
    color: string | null;
    from: 1 | 2;
    create_date: string;
};
@Injectable()
export class ImageModel extends BaseModel<ImageBase> {
    protected tableName = 'image';
    hideing: (keyof ImageBase)[] = ['from', 'create_date', 'size'];

    getting = {
        color(val: string | null) {
            if (val === null) return `#${appConfig.themeImageColor}`;
            return `#${appConfig.themeImageColor}`;
        },
    };
}
