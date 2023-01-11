import { ConfigModel, ConfigSeleteValue } from '@database/config.database';
import { ImageBase } from '@database/image.databser';
import { Injectable } from '@nestjs/common';
import { ConfigType } from '@src/enum';
import { OP } from 'mysql-crud-core/enum';

type PromiseResult<T> = T extends Promise<infer R> ? R : T;

@Injectable()
export class ConfigService {
    constructor(private readonly configModel: ConfigModel) {}

    protected readonly groups = ['系統信息', '七牛雲'];

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
