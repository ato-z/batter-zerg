import { Controller, Get } from '@nestjs/common';
import { V1BaseCoontroller } from '@v1/base.controller';

@Controller(V1BaseCoontroller.toPrefix('staff'))
export class StaffController extends V1BaseCoontroller {
    @Get('get')
    getUserInfo() {
        return 'hi';
    }
}
