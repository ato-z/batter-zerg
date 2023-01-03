import {
    Body,
    Post,
    Headers,
    Query,
    Param,
    Put,
    Patch,
    Delete,
} from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import { V1BaseCoontroller } from '@v1/base.controller';
import { TokenService } from '@src/modules/token.service';
import {
    StaffCreateDTO,
    StaffLoginDTO,
    StaffRePasswordDTO,
    StaffUpdateDTO,
} from './staff.dto';
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

    /** 軟刪除員工 */
    @Delete('delete/:staff_ids')
    async del(@Param('staff_ids') staffIds: string) {
        console.log(staffIds);
        const ids = this.toNumberIds(staffIds);
        const { staffService } = this;
        await staffService.del(...ids);
        return { message: '已放入回收列表' };
    }

    /** 硬刪除員工 */
    @Delete('destroy/:staff_ids')
    async destroy(@Param('staff_ids') staffIds: string) {
        console.log(staffIds);
        const ids = this.toNumberIds(staffIds);
        const { staffService } = this;
        await staffService.destroy(...ids);
        return { message: '已銷毀' };
    }

    /** 復原員工 */
    @Patch('recall/:staff_ids')
    async recall(@Param('staff_ids') staffIds: string) {
        const ids = this.toNumberIds(staffIds);
        const { staffService } = this;
        await staffService.recall(...ids);
        return { message: '已從回收列表中恢復' };
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
        const { findStaff } = await this.touchStaffDataByCurrentStaff(
            token,
            staffId,
        );
        findStaff.append('switch', () => this.getStaffProp());
        const findStaffData = findStaff.toJSON();
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

    /** 修改 */
    @Put('edit/:staff_id')
    async edit(
        @Headers('token') token: string,
        @Param('staff_id') staffId: number,
        @Body() updata: StaffUpdateDTO,
    ) {
        const { findStaffData, currentStaffData } =
            await this.touchStaffDataByCurrentStaff(token, staffId);
        const { staffService } = this;
        await staffService.updataStaff(findStaffData, currentStaffData, updata);
        return { message: '更新成功~' };
    }

    /** 重置密码 */
    @Put('re_password/:staff_id')
    async rePass(
        @Headers('token') token: string,
        @Param('staff_id') staffId: number,
        @Body() updata: StaffRePasswordDTO,
    ) {
        const { findStaffData, currentStaffData } =
            await this.touchStaffDataByCurrentStaff(token, staffId);
        const { staffService } = this;
        await staffService.updataStaff(findStaffData, currentStaffData, updata);
        return { message: '密码已更换~' };
    }

    /** 颁发临时token */
    @Get('token')
    async token(@Headers('sign') sign: string, @Headers('User-Agent') ua) {
        const { staffService, tokenService } = this;
        const staffData = await staffService.decodeLoginSign(sign, ua ?? '');
        const tokenData = tokenService.create(staffData);
        return { tokenData };
    }

    private async touchStaffDataByCurrentStaff(
        token: string,
        touchStaffId: number,
    ) {
        const currentStaff = await this.tokenService.getByStaffByToken(token);
        const currentStaffData = await currentStaff.toJSON();
        const findStaff = await this.staffService.getStaffByID(touchStaffId);
        const findStaffData = await findStaff.toJSON();
        if (
            findStaffData.id !== currentStaffData.id &&
            findStaffData.level >= currentStaffData.level
        )
            throw new ApiException('非法訪問');
        return { findStaff, currentStaff, findStaffData, currentStaffData };
    }
}
