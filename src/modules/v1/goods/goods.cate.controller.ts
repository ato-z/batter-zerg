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
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { V1BaseCoontroller } from '@v1/base.controller';
import { OP } from 'mysql-crud-core/enum';
import {
    GoodsCateCreateDTO,
    GoodsCateListParam,
    GoodsCateUpdateDTO,
} from './goods.cate.dto';
import { GoodsCateSeleteOption, GoodsCateService } from './goods.cate.service';
import {
    GoodsCateDetailDV,
    GoodsCateListDV,
    GoodsMessageDV,
} from './goods.dataview';

@ApiTags('商品分類')
@Controller(V1BaseCoontroller.toPrefix('goods_cate'))
export class GoodsCateController extends V1BaseCoontroller {
    constructor(private readonly goodsCateServive: GoodsCateService) {
        super();
    }

    private codeListParam(query: GoodsCateListParam) {
        const { start = 0, end = 15 } = query;
        const option: GoodsCateSeleteOption = {
            where: { and: {} },
            limit: [start, end],
            order: ['order', 'DESC'],
        };
        const { where } = option;
        if (query.name) where.and.name = [OP.LIKE, `%${query.name}%`];
        if (query.title) where.and.title = [OP.LIKE, `%${query.title}%`];
        let create_date = null;
        if (query.start_date && query.end_date) {
            create_date = [OP.BETWEEN, [query.start_date, query.end_date]];
        } else if (query.start_date) {
            create_date = [OP.EGT, query.start_date];
        } else if (query.end_date) {
            create_date = [OP.ELT, query.end_date];
        }
        if (create_date !== null) where.and.create_date = create_date;
        return option;
    }

    @ApiResponse({
        description: '返回一組分類列表',
        type: GoodsCateListDV,
    })
    @Get('list')
    list(@Query() query: GoodsCateListParam) {
        const param = this.codeListParam(query);
        param.where.and.delete_date = null;
        const result = this.goodsCateServive.list(param);
        return result;
    }

    @ApiResponse({
        description: '從回收站中返回一組分類列表',
        type: GoodsCateListDV,
    })
    @Get('recall')
    recallList(@Query() query: GoodsCateListParam) {
        const param = this.codeListParam(query);
        param.where.and.delete_date = [OP.NEQ, null];
        const result = this.goodsCateServive.list(param);
        return result;
    }

    @ApiResponse({
        status: 200,
        description: '新增商品分類',
        type: GoodsMessageDV,
    })
    @Post('add')
    async add(@Body() data: GoodsCateCreateDTO) {
        await this.goodsCateServive.add(data);
        return { message: '新增成功' };
    }

    @ApiResponse({
        status: 200,
        description: '獲取商品分类詳情',
        type: GoodsCateDetailDV,
    })
    @ApiParam({
        name: 'cate_id',
        description: '商品分類id',
    })
    @Get('data/:cate_id')
    async data(@Param('cate_id') cateId: number) {
        const cate = await this.goodsCateServive.find(cateId);
        cate.hidden(['delete_date']);
        const { pid } = cate.data;
        const parentCate = 'parent_cate';
        if (pid === 0) cate.append(parentCate, () => null);
        else {
            cate.append(
                parentCate,
                async () => (await this.goodsCateServive.find(pid)).data,
            );
        }
        const cateData = await cate.toJSON();
        return cateData;
    }

    @ApiResponse({
        status: 200,
        description: '编辑商品分类, 传入更新字段',
        type: GoodsMessageDV,
    })
    @ApiParam({
        name: 'cate_id',
        description: '商品分類id',
    })
    @ApiBody({
        type: GoodsCateCreateDTO,
        required: false,
    })
    @Put('edit/:cate_id')
    async edit(
        @Param('cate_id') cateId: number,
        @Body() updata: GoodsCateUpdateDTO,
    ) {
        await this.goodsCateServive.updata(cateId, updata);
        return { message: '已更新' };
    }

    @ApiResponse({
        status: 200,
        description: '將商品加入回收列表',
        type: GoodsMessageDV,
    })
    @ApiParam({
        name: 'cate_ids',
        description: '商品分類id1,商品分類id2,商品分類id3',
    })
    @Delete('delete/:cate_ids')
    async del(@Param('cate_ids') cateIds: string) {
        const ids = this.toNumberIds(cateIds);
        await this.goodsCateServive.del(...ids);
        return { message: '已移入回收列表' };
    }

    @ApiResponse({
        status: 200,
        description: '將商品從回收列表恢復',
        type: GoodsMessageDV,
    })
    @ApiParam({
        name: 'cate_ids',
        description: '商品分類id1,商品分類id2,商品分類id3',
    })
    @Patch('recall/:cate_ids')
    async recall(@Param('cate_ids') cateIds: string) {
        const ids = this.toNumberIds(cateIds);
        await this.goodsCateServive.recall(...ids);
        return { message: '已從回收列表中恢復' };
    }

    @ApiResponse({
        status: 200,
        description: '將回收列表中的數據進行物理銷毀',
        type: GoodsMessageDV,
    })
    @ApiParam({
        name: 'cate_ids',
        description: '商品分類id1,商品分類id2,商品分類id3',
    })
    @Delete('destroy/:cate_ids')
    async destroy(@Param('cate_ids') cateIds: string) {
        const ids = this.toNumberIds(cateIds);
        await this.goodsCateServive.destroy(...ids);
        return { message: '已銷毀' };
    }
}
