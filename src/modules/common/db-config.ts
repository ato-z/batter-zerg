import { ConfigService } from '@v1/config/condig.service';
import { ConfigModel } from '@database/config.database';

const configModel = new ConfigModel();
const configService = new ConfigService(configModel);

export class ShortDBConfig<S extends object> {
    static instances: ShortDBConfig<any>[] = [];
    static async reload(cb?: (current: ShortDBConfig<any>) => boolean) {
        const uplist =
            cb === undefined ? this.instances : this.instances.filter(cb);
        await Promise.all(
            this.instances.map((instance) => instance.getConfigByDB()),
        );
    }
    private data: S;
    private prevRequest = 0;
    constructor(
        readonly ids: number[],
        private readonly exTime: number = 1800000,
    ) {
        ShortDBConfig.instances.push(this);
    }

    get config() {
        const { prevRequest, exTime } = this;
        if (prevRequest + exTime < Date.now()) {
            return this.getConfigByDB();
        }
        return Promise.resolve(this.data);
    }

    async getConfigByDB() {
        const config = await configService.withOsConfig<S>(this.ids);
        this.prevRequest = Date.now();
        this.data = config;
        return config;
    }
}
