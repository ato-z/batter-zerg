import { Body, Post, Headers, Query, Param } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import { V1BaseCoontroller } from '@v1/base.controller';
import { TokenService } from '@src/modules/token.service';
import { StaffCreateDTO, StaffLoginDTO } from './staff.dto';
import { StaffSelect, StaffService } from './staff.service';
import { OP } from 'mysql-crud-core/enum';
import { WhereParmaValue } from 'mysql-crud-core';
import { ApiException } from '@src/exceptions';
import { StaffLevel } from '@src/enum';

@Controller(V1BaseCoontroller.toPrefix('staff'))
export class StaffController extends V1BaseCoontroller {
    constructor(
        private readonly staffService: StaffService,
        private readonly tokenService: TokenService,
    ) {
        super();
    }

    /** 组合员工列表的查询参数 */
    private async codeQueryList(query, token) {
        const {
            start = 0,
            end = 10,
            name,
            start_date,
            end_date,
            status,
        } = query;
        let createDate = [OP.NEQ, null] as WhereParmaValue;
        if (start_date && end_date)
            createDate = [OP.BETWEEN, [start_date, end_date]];
        else if (start_date) createDate = [OP.EGT, start_date];
        else if (end_date) createDate = [OP.ELT, end_date];

        // 只允许查询比自己低一级的员工
        const staff = await this.tokenService.getByStaffByToken(token);
        const { level } = await staff.toJSON();

        return {
            limit: [start, end],
            where: {
                and: {
                    name: name ? [OP.LIKE, `%${name}%`] : [OP.NEQ, null],
                    delete_date: null,
                    status: status !== undefined ? status : [OP.NEQ, null],
                    create_date: createDate,
                    level: [OP.LT, level],
                },
            },
        } as StaffSelect;
    }

    /** 获取员工列表 */
    @Get('list')
    async list(@Query() query, @Headers('token') token: string) {
        const option = await this.codeQueryList(query, token);
        const list = this.staffService.list(option);
        return list;
    }

    /** 获取回收列表 */
    @Get('recall')
    async reacallList(@Query() query, @Headers('token') token: string) {
        const option = await this.codeQueryList(query, token);
        option.where.and.delete_date = [OP.NEQ, null];
        const list = this.staffService.list(option);
        return list;
    }

    /** 返回員工的配置屬性 */
    @Get('prop')
    async getStaffProp(switchLevel?: number) {
        const level = await this.staffService.getSwitchByLevel(
            switchLevel ?? StaffLevel.SUPER_ADMIN,
        );
        const status = this.staffService.staffStatus();
        return { level, status };
    }

    /** 获取指定id员工信息 */
    @Get('data/:staff_id')
    async getStaffByID(
        @Param('staff_id') staffId: number,
        @Headers('token') token: string,
    ) {
        const currentStaff = await this.tokenService.getByStaffByToken(token);
        const { level } = await currentStaff.toJSON();
        const findStaff = await this.staffService.getStaffByID(staffId);
        findStaff.append('switch', () => this.getStaffProp());
        const findStaffData = await findStaff.toJSON();
        if (findStaffData.level >= level) throw new ApiException('非法訪問');
        return findStaffData;
    }

    /** 获取当前登录的员工信息 */
    @Get('get')
    async getCurrentStaff(@Headers('token') token: string) {
        const staff = await this.tokenService.getByStaffByToken(token);
        staff.hidden(['password', 'status', 'delete_date', 'id']);
        return staff.toJSON();
    }

    /** 注冊新員工 */
    @Post('add')
    async create(@Body() body: StaffCreateDTO) {
        await this.staffService.createStaff(body);
        return { message: '已添加' };
    }

    /** 用户登录 */
    @Post('login')
    async login(@Body() post: StaffLoginDTO, @Headers('User-Agent') ua) {
        const { staffService } = this;
        const staffData = await staffService.login(post.name, post.password);
        const sign = await staffService.createSign(staffData, ua ?? '');
        return { sign };
    }

    /** 颁发临时token */
    @Get('token')
    async token(@Headers('sign') sign: string, @Headers('User-Agent') ua) {
        const { staffService, tokenService } = this;
        const staffData = await staffService.decodeLoginSign(sign, ua ?? '');
        const tokenData = tokenService.create(staffData);
        return { tokenData };
    }
}
