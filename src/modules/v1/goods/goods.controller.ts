import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import {
    ApiBody,
    ApiHeader,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { V1BaseCoontroller } from '@v1/base.controller';
import { OP } from 'mysql-crud-core/enum';
import {
    GoodsDetailDV,
    GoodsListResultDV,
    GoodsMessageDV,
} from './goods.dataview';
import { GoodsCreateDTO, GoodsListParamDTO, GoodsUpdateDTO } from './goods.dto';
import { GoodsService } from './goods.service';

@ApiTags('商品模块')
@Controller(V1BaseCoontroller.toPrefix('goods'))
export class GoodsController extends V1BaseCoontroller {
    constructor(private readonly goodsService: GoodsService) {
        super();
    }

    @ApiHeader({
        name: 'token',
        description: '臨時密鑰',
        required: true,
    })
    @ApiResponse({
        description: '返回一組商品列表',
        type: GoodsListResultDV,
    })
    @Get('list')
    async list(@Query() query: GoodsListParamDTO) {
        const result = await this.goodsService.list(query, {
            delete_date: null,
        });
        return result;
    }

    @ApiHeader({
        name: 'token',
        description: '臨時密鑰',
        required: true,
    })
    @ApiResponse({
        description: '返回回收列表的一組物品',
        type: GoodsListResultDV,
    })
    @Get('recall')
    async recallList(@Query() query: GoodsListParamDTO) {
        const result = await this.goodsService.list(query, {
            delete_date: [OP.NEQ, null],
        });
        return result;
    }

    @ApiResponse({
        description: '新增物品',
        type: GoodsMessageDV,
    })
    @ApiHeader({
        name: 'token',
        description: '臨時密鑰',
        required: true,
    })
    @Post('add')
    async add(@Body() data: GoodsCreateDTO) {
        await this.goodsService.add(data);
        return { message: '已添加' };
    }

    @ApiResponse({
        description: '物品的詳情信息',
        type: GoodsDetailDV,
    })
    @ApiHeader({
        name: 'token',
        description: '臨時密鑰',
        required: true,
    })
    @Get('data/:goods_id')
    async data(@Param('goods_id') goodsId: number) {
        const goodData = await this.goodsService.data(goodsId);
        return goodData;
    }

    @ApiResponse({
        description: '編輯物品信息， 傳入對應的新增字段進行更新',
        type: GoodsMessageDV,
    })
    @ApiHeader({
        name: 'token',
        description: '臨時密鑰',
        required: true,
    })
    @ApiBody({
        type: GoodsCreateDTO,
        required: false,
    })
    @Put('edit/:goods_id')
    async edit(
        @Param('goods_id') goodsId: number,
        @Body() updata: GoodsUpdateDTO,
    ) {
        await this.goodsService.edit(goodsId, updata);
        return { message: '已更新' };
    }

    @ApiResponse({
        status: 200,
        description: '將商品加入回收列表',
        type: GoodsMessageDV,
    })
    @ApiParam({
        name: 'goods_ids',
        description: '商品id1,商品id2,商品id3',
    })
    @ApiHeader({
        name: 'token',
        description: '臨時密鑰',
    })
    @Delete('delete/:goods_ids')
    async del(@Param('goods_ids') goodsIds: string) {
        const ids = this.toNumberIds(goodsIds);
        await this.goodsService.del(...ids);
        return { message: '已移入回收列表' };
    }

    @ApiResponse({
        status: 200,
        description: '從回收列表恢復',
        type: GoodsMessageDV,
    })
    @ApiParam({
        name: 'goods_ids',
        description: '商品id1,商品id2,商品id3',
    })
    @ApiHeader({
        name: 'token',
        description: '臨時密鑰',
    })
    @Patch('recall/:goods_ids')
    async recall(@Param('goods_ids') goodsIds: string) {
        const ids = this.toNumberIds(goodsIds);
        await this.goodsService.recall(...ids);
        return { message: '已從回收列表中恢復' };
    }

    @ApiResponse({
        status: 200,
        description: '將回收列表中的數據進行物理銷毀',
        type: GoodsMessageDV,
    })
    @ApiParam({
        name: 'goods_ids',
        description: '商品id1,商品id2,商品id3',
    })
    @ApiHeader({
        name: 'token',
        description: '臨時密鑰',
    })
    @Delete('destroy/:goods_ids')
    async destroy(@Param('goods_ids') goodsIds: string) {
        const ids = this.toNumberIds(goodsIds);
        await this.goodsService.destroy(...ids);
        return { message: '已銷毀' };
    }
}
