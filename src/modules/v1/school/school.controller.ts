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
import { ApiException } from '@src/exceptions';
import { V1BaseCoontroller } from '@v1/base.controller';
import { OP } from 'mysql-crud-core/enum';
import { SchoolCreateDTO, SchoolUpdateDTO } from './scholl.dto';
import { SchoolService } from './school.service';

@Controller(V1BaseCoontroller.toPrefix('school'))
export class SchoolController extends V1BaseCoontroller {
    protected hidden: Array<keyof SchoolBase & string> = ['delete_date'];
    constructor(private readonly schoolService: SchoolService) {
        super();
    }

    /** 普通列表 */
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
    @Get('data/:school_id')
    async detail(@Param('school_id') schoolId: number) {
        const school = await this.schoolService.findSchool(schoolId);
        if (school === null) throw new NotFoundException('未找到學校信息');
        const result = await school.toJSON();
        return result;
    }

    /** 新增学校 */
    @Post('add')
    async add(@Body() body: SchoolCreateDTO) {
        const { schoolService } = this;
        const school = await schoolService.create(body);
        return school;
    }

    /** 编辑学校 */
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
    @Delete('delete/:school_ids')
    async del(@Param('school_ids') schoolIds: string) {
        const ids = this.toNumberIds(schoolIds);
        const { schoolService } = this;
        await schoolService.del(...ids);
        return { message: '已刪除' };
    }

    /** 物理销毁 */
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
        return { message: '已銷毀~' };
    }

    /** 回收列表 */
    @Get('recall')
    async recallList(@Query() query) {
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
    @Patch('recall/:school_ids')
    async recall(@Param('school_ids') schoolIds: string) {
        const ids = this.toNumberIds(schoolIds);
        const { schoolService } = this;
        const state = await schoolService.recall(...ids);
        switch (state) {
            case 0:
                return { message: '部分復原,部分學校名重複,已忽略' };
            case 1:
                return { message: '已復原' };
            default:
                return { message: '無操作,可能存在學校名重複' };
        }
    }

    private toNumberIds(schoolIds: string) {
        const ids = schoolIds
            .split(',')
            .filter((id) => +id)
            .map((id) => +id);
        return ids;
    }
}
