import { appConfig } from '@config/app';
import { Injectable } from '@nestjs/common';
import { ImageFrom } from '@src/enum';
import { BaseModel } from './base.database';

export type ImageBase = {
    id: number;
    path: string;
    width: number;
    height: number;
    size: number;
    color: string | null;
    from: ImageFrom;
    create_date: string;
};
@Injectable()
export class ImageModel extends BaseModel<ImageBase> {
    protected tableName = 'image';
    hideing: (keyof ImageBase)[] = ['from', 'create_date', 'size'];

    getting = {
        path(path: string, key: 'path', data: ImageBase) {
            if (data.from === ImageFrom.LOCAL) return path;
            return path;
        },
        color(val: string | null) {
            if (val === null) return `#${appConfig.themeImageColor}`;
            return `#${appConfig.themeImageColor}`;
        },
    };
}
