import { Body, Post } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import { V1BaseCoontroller } from '@v1/base.controller';
import { StaffLoginDTO } from './staff.dto';
import { StaffService } from './staff.service';

@Controller(V1BaseCoontroller.toPrefix('staff'))
export class StaffController extends V1BaseCoontroller {
    constructor(private readonly service: StaffService) {
        super();
    }

    @Get('get')
    getUserInfo() {
        return 'hi';
    }

    /**
     * 用户登录
     */
    @Post('login')
    async login(@Body() post: StaffLoginDTO) {
        const staff = await this.service.login(post.name, post.password);
        const sign = await this.service.createSign(staff);
        return { sign };
    }
}
