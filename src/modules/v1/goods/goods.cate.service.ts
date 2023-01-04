import { GoodsCateModel } from '@database/good.cate.databse';
import { Injectable, NotFoundException } from '@nestjs/common';
import { GoodsCateCreateDTO } from './goods.cate.dto';

@Injectable()
export class GoodsCateService {
    constructor(private readonly goodsCateModel: GoodsCateModel) {}

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
}
