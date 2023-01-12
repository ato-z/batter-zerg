import { appConfig } from '@config/app';
import { Injectable } from '@nestjs/common';
import { ImageFrom } from '@src/enum';
import { ShortDBConfig } from '@src/modules/common/db-config';
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

const shortDBConfig = new ShortDBConfig<{
    domian: string;
    useOss: boolean;
}>([14, 7]);

@Injectable()
export class ImageModel extends BaseModel<ImageBase> {
    protected tableName = 'image';
    hideing: (keyof ImageBase)[] = ['from', 'create_date', 'size'];

    getting = {
        async path(path: string, key: 'path', data: ImageBase) {
            const config = await shortDBConfig.config;
            if (data.from === ImageFrom.QINIU && config.useOss) {
                return `${config.domian}${path}`;
            }
            return `/${path}`;
        },
        color(val: string | null) {
            if (val === null) return `#${appConfig.themeImageColor}`;
            return `#${appConfig.themeImageColor}`;
        },
    };
}
