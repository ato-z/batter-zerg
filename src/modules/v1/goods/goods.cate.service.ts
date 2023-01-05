import { GoodsCateModel } from '@database/good.cate.databse';
import { Injectable, NotFoundException } from '@nestjs/common';
import { date } from '@src/tool';
import { OP } from 'mysql-crud-core/enum';
import { GoodsCateCreateDTO, GoodsCateUpdateDTO } from './goods.cate.dto';

export type GoodsCateSeleteOption = GoodsCateModel['selete'] extends (
    option: infer R,
) => unknown
    ? R
    : never;

@Injectable()
export class GoodsCateService {
    constructor(private readonly goodsCateModel: GoodsCateModel) {}

    /** 获取列表 */
    async list(option: GoodsCateSeleteOption) {
        const list = await this.goodsCateModel.selete(option);
        if (list === null) return { list: [], total: 0 };
        const listData = await Promise.all(list.map((item) => item.toJSON()));
        const total = await this.goodsCateModel.total({
            where: option.where,
            join: option.join,
        });
        return { list: listData, total };
    }

    /** 新增分类 */
    async add(data: GoodsCateCreateDTO) {
        await this.goodsCateModel.insert(data);
    }

    /** 获取分类信息 */
    async find(cateId: number) {
        const cate = await this.goodsCateModel.find(cateId);
        if (cate === null) throw new NotFoundException('當前分類信息不存在');
        return cate;
    }

    /** 更新分类信息 */
    async updata(cateId: number, updata: GoodsCateUpdateDTO) {
        await this.find(cateId);
        await this.goodsCateModel.update(updata, {
            where: { and: { id: cateId } },
        });
    }

    /** 將一組商品加入回收列表 */
    async del(...ids: number[]) {
        await this.goodsCateModel.update(
            {
                delete_date: date('y-m-d h:i:s'),
            },
            {
                where: { and: { id: [OP.IN, ids], delete_date: null } },
            },
        );
    }

    /** 從回收列表中回復數據 */
    async recall(...ids: number[]) {
        await this.goodsCateModel.update(
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

    /** 將回收列表中商品物理刪除 */
    async destroy(...ids: number[]) {
        await this.goodsCateModel._delete({
            where: {
                and: {
                    delete_date: [OP.NEQ, null],
                    id: [OP.IN, ids],
                },
            },
        });
    }
}
