import { SelectOption } from '@database/base.database';
import { MenuLevelModel } from '@database/menu.level.database';
import { Injectable } from '@nestjs/common';
import { date, filterEmpty } from '@src/tool';
import { OP } from 'mysql-crud-core/enum';
import {
    MenuLevelCreateDTO,
    MenuLevelListParamDTO,
    MenuLevelUpdateDTO,
} from './menu.level.dto';

type SelectMenuLevelOption = SelectOption<MenuLevelModel['selete']>;

@Injectable()
export class MenuLevelService {
    constructor(private readonly menuLevelModel: MenuLevelModel) {}

    private withModel(model: string) {
        return model.replace(/^\s+|\s+$/, '');
    }

    private codeListParam(
        query: MenuLevelListParamDTO,
        where: SelectMenuLevelOption['where']['and'] = {},
    ) {
        const filterQuery = filterEmpty(query);
        const option: SelectMenuLevelOption = {
            where: { and: Object.assign({ delete_date: null }, where) },
            limit: [filterQuery.start ?? 0, filterQuery.end ?? 10],
            order: ['id', 'DESC'],
        };
        return option;
    }

    async list(
        query: MenuLevelListParamDTO,
        where: SelectMenuLevelOption['where']['and'] = {},
    ) {
        const option = this.codeListParam(query, where);
        const list = (await this.menuLevelModel.selete(option)).map(
            (item) => item.data,
        );

        const total = this.menuLevelModel.total({ where: option.where });

        return { list, total };
    }

    async add(data: MenuLevelCreateDTO) {
        data.model = this.withModel(data.model);
        await this.menuLevelModel.insert(data);
    }

    async edit(id: number, data: MenuLevelUpdateDTO) {
        if (data.model) data.model = this.withModel(data.model);
        await this.menuLevelModel.update(data, {
            where: { and: { id } },
        });
    }

    async del(ids: number[]) {
        await this.menuLevelModel.update(
            {
                delete_date: date('y-m-d h:i:s'),
            },
            {
                where: { and: { id: [OP.IN, ids], delete_date: null } },
            },
        );
    }

    async recall(ids: number[]) {
        await this.menuLevelModel.update(
            {
                delete_date: null,
            },
            {
                where: {
                    and: { id: [OP.IN, ids], delete_date: [OP.NEQ, null] },
                },
            },
        );
    }

    async destroy(ids: number[]) {
        await this.menuLevelModel._delete({
            where: {
                and: { id: [OP.IN, ids], delete_date: [OP.NEQ, null] },
            },
        });
    }
}
