import { Injectable } from '@nestjs/common';
import { OP } from 'mysql-crud-core/enum';
import { BaseModel } from './base.database';

type GoodsTagBase = {
    id: number;
    name: string;
    create_date: string;
    detele_date: string | null;
};

@Injectable()
export class GoodsTagModel extends BaseModel<GoodsTagBase> {
    protected tableName = 'goods_tag';

    async findNamesByIds(ids: Array<string | number>) {
        const withNames = await this.selete({
            where: { and: { id: [OP.IN, ids] } },
        });
        return withNames.map((item) => item.data.name);
    }

    async findOrCreateNames(names: string[]) {
        if (names.length === 0) return '';
        const withNames = names.map((name) => name.trim());
        const findNames =
            (
                await this.selete({
                    where: {
                        and: {
                            name: [OP.IN, withNames],
                        },
                    },
                })
            )?.map((item) => item.data) ?? [];
        if (findNames.length === withNames.length)
            return `,${findNames.map((item) => item.id).join(',')},`;

        const diffNames = withNames.filter(
            (name) => !findNames.find((item) => item.name === name),
        );
        await this.createNames(diffNames);

        const result = await this.findOrCreateNames(withNames);
        return result;
    }

    async createNames(names: string[]) {
        const datas = names.map((name) => ({ name }));
        await this.insert(datas);
    }
}
