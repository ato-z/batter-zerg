import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Put,
} from '@nestjs/common';
import { V1BaseCoontroller } from '@v1/base.controller';
import { GoodsCateCreateDTO } from './goods.cate.dto';
import { GoodsCateService } from './goods.cate.service';

@Controller(V1BaseCoontroller.toPrefix('goods/cate'))
export class GoodsCateController {
    constructor(private readonly goodsCateServive: GoodsCateService) {}

    @Get('list')
    list() {
        return '商品分类列表';
    }

    @Get('recall')
    recallList() {
        return '商品分类列表';
    }

    @Post('add')
    async add(@Body() data: GoodsCateCreateDTO) {
        await this.goodsCateServive.add(data);
        return { message: '新增成功' };
    }

    @Get('data/:cate_id')
    async data(@Param('cate_id') cateId: number) {
        const cate = await this.goodsCateServive.find(cateId);
        cate.hidden(['delete_date']);
        const cateData = await cate.toJSON();
        return cateData;
    }

    @Put('edit')
    edit() {
        return '编辑';
    }

    @Delete('delete')
    del() {
        return '删除';
    }

    @Patch('recall/:cate_id')
    recall() {
        return '复原';
    }

    @Delete('destroy')
    destroy() {
        return '物理销毁';
    }
}
