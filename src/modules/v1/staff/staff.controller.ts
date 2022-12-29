import { Body, Post, Headers } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import { V1BaseCoontroller } from '@v1/base.controller';
import { TokenService } from '@v1/token.service';
import { StaffLoginDTO } from './staff.dto';
import { StaffService } from './staff.service';

@Controller(V1BaseCoontroller.toPrefix('staff'))
export class StaffController extends V1BaseCoontroller {
    constructor(
        private readonly staffService: StaffService,
        private readonly tokenService: TokenService,
    ) {
        super();
    }

    @Get('get')
    async getUserInfo(@Headers('token') token: string) {
        const staff = await this.tokenService.getByStaffByToken(token);
        staff.hidden('password');
        staff.hidden('status');
        return staff;
    }

    /** 用户登录 */
    @Post('login')
    async login(@Body() post: StaffLoginDTO) {
        const { staffService } = this;
        const staff = await staffService.login(post.name, post.password);
        const staffData = await staff.toJSON();
        const sign = await staffService.createSign(staffData);
        return { sign };
    }

    /** 颁发临时token */
    @Get('token')
    async token(@Headers('sign') sign: string) {
        const { staffService, tokenService } = this;
        const staff = await staffService.decodeLoginSign(sign);
        const staffData = await staff.toJSON();
        const tokenData = tokenService.create(staffData);
        return { tokenData };
    }
}
