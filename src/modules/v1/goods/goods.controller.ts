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
import { ApiTags } from '@nestjs/swagger';
import { V1BaseCoontroller } from '@v1/base.controller';
import { GoodsCreateDTO } from './goods.dto';
import { GoodsService } from './goods.service';

@ApiTags('商品')
@Controller(V1BaseCoontroller.toPrefix('goods'))
export class GoodsController extends V1BaseCoontroller {
    constructor(private readonly goodsService: GoodsService) {
        super();
    }

    @Get('list')
    list() {
        return '';
    }

    @Get('recall')
    recallList() {
        return '';
    }

    @Post('add')
    async add(@Body() data: GoodsCreateDTO) {
        await this.goodsService.add(data);
        return { message: '已添加' };
    }

    @Get('data/:goods_id')
    async data(@Param('goods_id') goodsId: number) {
        return '';
    }

    @Put('edit/:goods_id')
    edit() {
        return '';
    }

    @Delete('delete/:goods_ids')
    del(@Param('goods_ids') goodsIds: string) {
        return { message: '已移入回收列表' };
    }

    @Patch('recall/:goods_ids')
    async recall(@Param('goods_ids') goodsIds: string) {
        return { message: '已從回收列表中恢復' };
    }

    @Delete('destroy/:goods_ids')
    async destroy(@Param('goods_ids') goodsIds: string) {
        return { message: '已銷毀' };
    }
}
