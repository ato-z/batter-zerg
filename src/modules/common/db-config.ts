import { ConfigService } from '@v1/config/config.service';
import { ConfigModel } from '@database/config.database';

const configModel = new ConfigModel();
const configService = new ConfigService(configModel);

export class ShortDBConfig<S extends object> {
    static instances: ShortDBConfig<any>[] = [];
    static async reload(cb?: (current: ShortDBConfig<any>) => boolean) {
        const uplist =
            cb === undefined ? this.instances : this.instances.filter(cb);
        await Promise.all(uplist.map((instance) => instance.getConfigByDB()));
    }
    private data: S;
    constructor(readonly ids: number[]) {
        ShortDBConfig.instances.push(this);
    }

    get config() {
        if (!this.data) return this.getConfigByDB();
        return Promise.resolve(this.data);
    }

    async getConfigByDB() {
        const config = await configService.withOsConfig<S>(this.ids);
        this.data = config;
        return config;
    }
}
