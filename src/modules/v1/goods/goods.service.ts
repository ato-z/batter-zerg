import { GoodsModel } from '@database/goods.database';
import { Injectable } from '@nestjs/common';
import { GoodsCreateDTO } from './goods.dto';

@Injectable()
export class GoodsService {
    constructor(private readonly goodsModel: GoodsModel) {}

    async add(data: GoodsCreateDTO) {
        await this.goodsModel.insert(data);
    }
}
