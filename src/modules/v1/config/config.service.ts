import { ConfigModel, ConfigSeleteValue } from '@database/config.database';
import { ImageBase } from '@database/image.database';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigType } from '@src/enum';
import { ApiException } from '@src/exceptions';
import { OP } from 'mysql-crud-core/enum';
import { ConfigUpdateDTO } from './config.dto';

type PromiseResult<T> = T extends Promise<infer R> ? R : T;

@Injectable()
export class ConfigService {
    constructor(private readonly configModel: ConfigModel) {}

    protected readonly groups = ['系統信息', '七牛雲'];

    get ShortDBConfig() {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { ShortDBConfig } = require('../../common/db-config');
        return ShortDBConfig;
    }

    async upConfig(configId: number, updata: ConfigUpdateDTO) {
        const config = await this.configModel.find(configId);
        if (config === null) throw new NotFoundException('當前配置項不存在');
        const configData = await config.toJSON();

        let value = updata.value;
        const order = updata.order ?? configData.order;
        if (configData.type === ConfigType.SWITCH) {
            value = updata.value ? 1 : 0;
        }
        if (
            configData.type === ConfigType.SELECT &&
            this.isSelectValue(configData.value)
        ) {
            if (configData.value.option[value] === undefined) {
                throw new ApiException('下標不存在');
            }
            value = JSON.stringify(
                Object.assign({}, configData.value, {
                    selectIndex: value,
                }),
            );
        }
        await this.configModel.update(
            { value, order },
            { where: { and: { id: configId } } },
        );

        // 更新对应配置
        this.upSShortDBConfig(configId);
    }

    private upSShortDBConfig(id: number) {
        this.ShortDBConfig.reload((config) => config.ids.includes(id));
    }

    async detail() {
        const { groups } = this;
        const list = await this.configModel.selete({
            where: {
                and: { group: [OP.IN, groups], delete_date: null },
            },
        });
        if (list === null) return [];
        const result = await Promise.all(
            groups.map(async (group) => {
                const groupList = await Promise.all(
                    list
                        .filter((item) => item.data.group === group)
                        .map((i) => i.toJSON()),
                );
                groupList.sort((n, m) => m.order - n.order);
                return { title: group, list: groupList };
            }),
        );
        return result;
    }

    async withOsConfig<S>(ids: number[]) {
        const configList = await this.configModel.selete({
            where: { and: { id: [OP.IN, ids] } },
        });
        if (configList === null) return {} as S;
        const data = this.listConfigToObject(configList);
        return data as unknown as S;
    }

    private async listConfigToObject<S>(
        configList: PromiseResult<ReturnType<ConfigModel['selete']>>,
    ) {
        const list = await Promise.all(configList.map((i) => i.toJSON()));
        const dataList = list.map((item) => {
            const { name, value, type } = item;
            let codeValue = value;

            if (type === ConfigType.SELECT && this.isSelectValue(value)) {
                codeValue = value.option[value.selectIndex].value;
            }

            if (type === ConfigType.UPLOAD_IMG && this.isImageValue(value)) {
                codeValue = value.path;
            }

            return [name, codeValue];
        });
        return Object.fromEntries(dataList);
    }

    private isSelectValue(value: unknown): value is ConfigSeleteValue {
        return true;
    }

    private isImageValue(value: unknown): value is ImageBase {
        return true;
    }
}
