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
    private _imageMode: BaseModel<T>;
    get imageMode() {
        if (this._imageMode === undefined) {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const { ImageModel } = require('./image.databser');
            const _imageMode = new ImageModel();
            this._imageMode = _imageMode;
        }
        return this._imageMode;
    }
    protected prefix: string = table_prefix;
    constructor() {
        super(pool); // 傳入鏈接池
    }

    protected async getImage(imgId: number | string) {
        if (!imgId) return null;
        const image = await this.imageMode.find(imgId);
        if (image === null) return null;
        const imageData = await image.toJSON();
        return imageData;
    }
}
