import { type SchoolBase } from '@database/school.database';
import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Patch,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { ApiHeader, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiException } from '@src/exceptions';
import { V1BaseCoontroller } from '@v1/base.controller';
import { OP } from 'mysql-crud-core/enum';
import {
    SchoolCreateDTO,
    SchoolListParam,
    SchoolUpdateDTO,
} from './scholl.dto';
import { SchoolItemDV, SchoolMessageDV } from './school.dataview';
import { SchoolService } from './school.service';

@ApiTags('學校模塊')
@Controller(V1BaseCoontroller.toPrefix('school'))
export class SchoolController extends V1BaseCoontroller {
    protected hidden: Array<keyof SchoolBase & string> = ['delete_date'];
    constructor(private readonly schoolService: SchoolService) {
        super();
    }

    /** 普通列表 */
    @ApiHeader({
        name: 'token',
        description: '臨時密鑰',
        required: true,
    })
    @ApiResponse({
        status: 200,
        description: '學校列表',
        type: SchoolItemDV,
        isArray: true,
    })
    @Get('list')
    async list(@Query() query) {
        const { start = 0, end = 10, name } = query;
        const result = this.schoolService.list({
            limit: [start, end],
            where: {
                and: {
                    name: name ? [OP.LIKE, `%${name}%`] : [OP.NEQ, null],
                    delete_date: null,
                },
            },
        });
        return result;
    }

    /** 查看詳情 */
    @ApiHeader({
        name: 'token',
        description: '臨時密鑰',
        required: true,
    })
    @ApiResponse({
        status: 200,
        description: '學校詳情',
        type: SchoolItemDV,
    })
    @ApiParam({
        name: 'school_id',
        description: '學校id',
    })
    @Get('data/:school_id')
    async detail(@Param('school_id') schoolId: number) {
        const school = await this.schoolService.findSchool(schoolId);
        if (school === null) throw new NotFoundException('未找到學校信息');
        const result = await school.toJSON();
        return result;
    }

    /** 新增学校 */
    @ApiHeader({
        name: 'token',
        description: '臨時密鑰',
        required: true,
    })
    @ApiResponse({
        status: 200,
        description: '新增學校',
        type: SchoolMessageDV,
    })
    @ApiParam({
        name: 'school_id',
        description: '學校id',
    })
    @Post('add')
    async add(@Body() body: SchoolCreateDTO) {
        const { schoolService } = this;
        await schoolService.create(body);
        return { message: '已添加' };
    }

    /** 编辑学校 */
    @ApiHeader({
        name: 'token',
        description: '臨時密鑰',
        required: true,
    })
    @ApiResponse({
        status: 200,
        description: '學校編輯, 傳入新增對應字段進行更新',
        type: SchoolMessageDV,
    })
    @ApiParam({
        name: 'school_id',
        description: '學校id',
    })
    @Put('edit/:school_id')
    async put(
        @Body() body: SchoolUpdateDTO,
        @Param('school_id') schoolId: number,
    ) {
        const { schoolService } = this;
        await schoolService.update(body, schoolId);
        return { message: '編輯成功' };
    }

    /** 刪除學校 */
    @ApiHeader({
        name: 'token',
        description: '臨時密鑰',
        required: true,
    })
    @ApiResponse({
        status: 200,
        description: '將一組學校放入回收列表中',
        type: SchoolMessageDV,
    })
    @ApiParam({
        name: 'school_ids',
        description: '學校id1,學校id2,...',
    })
    @Delete('delete/:school_ids')
    async del(@Param('school_ids') schoolIds: string) {
        const ids = this.toNumberIds(schoolIds);
        const { schoolService } = this;
        await schoolService.del(...ids);
        return { message: '已放入回收列表' };
    }

    /** 物理销毁 */
    @ApiHeader({
        name: 'token',
        description: '臨時密鑰',
        required: true,
    })
    @ApiResponse({
        status: 200,
        description: '將一組學校永久銷毀，操作不可逆',
        type: SchoolMessageDV,
    })
    @ApiParam({
        name: 'school_ids',
        description: '學校id1,學校id2,...',
    })
    @Delete('destroy/:school_ids')
    async destroy(@Param('school_ids') schoolIds: string) {
        const { schoolService } = this;
        if (schoolIds === 'all') {
            await schoolService.destroy();
        } else {
            const ids = this.toNumberIds(schoolIds);
            if (ids.length === 0) throw new ApiException('無操作');
            await schoolService.destroy(...ids);
        }
        return { message: '已銷毀' };
    }

    /** 回收列表 */
    @ApiHeader({
        name: 'token',
        description: '臨時密鑰',
        required: true,
    })
    @ApiResponse({
        status: 200,
        description: '返回一組回收列表中的數據',
        type: SchoolItemDV,
        isArray: true,
    })
    @Get('recall')
    async recallList(@Query() query: SchoolListParam) {
        const { start = 0, end = 10, name } = query;

        const result = this.schoolService.list({
            limit: [start, end],
            where: {
                and: {
                    name: name ? [OP.LIKE, `%${name}%`] : [OP.NEQ, null],
                    delete_date: [OP.NEQ, null],
                },
            },
        });
        return result;
    }

    /** 復原學校 */
    @ApiHeader({
        name: 'token',
        description: '臨時密鑰',
        required: true,
    })
    @ApiResponse({
        status: 200,
        description: '將一組學校從回收列表中恢復',
        type: SchoolMessageDV,
    })
    @ApiParam({
        name: 'school_ids',
        description: '學校id1,學校id2,...',
    })
    @Patch('recall/:school_ids')
    async recall(@Param('school_ids') schoolIds: string) {
        const ids = this.toNumberIds(schoolIds);
        const { schoolService } = this;
        /**
         * 0：  部分復原,部分學校名重複
         * 1：  全部復原
         * -1: 無操作,可能存在學校名重複
         */
        await schoolService.recall(...ids);
        return { message: '已從回收列表中恢復' };
    }
}
