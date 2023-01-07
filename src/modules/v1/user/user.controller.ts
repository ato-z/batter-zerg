import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { V1BaseCoontroller } from '@v1/base.controller';
import { SimpleUserDV, UserFullDV, WithUserDV } from './user.dataview';
import { UserListParamDTO } from './user.dto';
import { UserService } from './user.service';

@ApiTags('微信小程序用户模块')
@Controller(V1BaseCoontroller.toPrefix('user'))
export class V1UserController extends V1BaseCoontroller {
    constructor(private readonly userService: UserService) {
        super();
    }

    @ApiHeader({
        name: 'token',
        description: '臨時密鑰',
        required: true,
    })
    @ApiResponse({
        description: '返回一组简易的用户信息',
        type: SimpleUserDV,
        isArray: true,
    })
    @Get('simple_list')
    async simpleList(@Query() query: UserListParamDTO) {
        const result = await this.userService.simpleList(query);
        return result;
    }

    @ApiHeader({
        name: 'token',
        description: '臨時密鑰',
        required: true,
    })
    @ApiResponse({
        description: '返回一组的用户信息',
        type: WithUserDV,
        isArray: true,
    })
    @Get('list')
    async list(@Query() query: UserListParamDTO) {
        const result = await this.userService.list(query);
        return result;
    }

    @ApiHeader({
        name: 'token',
        description: '臨時密鑰',
        required: true,
    })
    @ApiResponse({
        description: '返回用户详情',
        type: UserFullDV,
    })
    @Get('data/:uid')
    async detail(@Param('uid') uid: number) {
        const result = await this.userService.detail(uid);
        return result;
    }
}
