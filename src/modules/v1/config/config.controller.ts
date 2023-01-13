import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { V1BaseCoontroller } from '@v1/base.controller';
import { ConfigService } from './config.service';
import { ConfigUpdateDTO } from './config.dto';

@ApiTags('公共模塊')
@Controller(V1BaseCoontroller.toPrefix('config'))
export class ConfigController extends V1BaseCoontroller {
    constructor(private readonly configService: ConfigService) {
        super();
    }

    @ApiHeader({
        name: 'token',
        description: '臨時密鑰',
        required: true,
    })
    @ApiHeader({
        name: 'token',
        description: '臨時密鑰',
        required: true,
    })
    @ApiResponse({
        description: '返回所有系統配置',
    })
    @Get('detail')
    async detail() {
        const result = await this.configService.detail();
        return result;
    }

    @ApiResponse({
        description: '返回系統的描述信息',
    })
    @ApiHeader({
        name: 'token',
        description: '臨時密鑰',
        required: true,
    })
    @Get('os')
    async des() {
        const config = await this.configService.withOsConfig([10, 11, 12]);
        return config;
    }

    @ApiResponse({
        description: '修改對應配置',
    })
    @ApiHeader({
        name: 'token',
        description: '臨時密鑰',
        required: true,
    })
    @Put('edit/:config_id')
    async edit(
        @Param('config_id') configId: number,
        @Body() body: ConfigUpdateDTO,
    ) {
        await this.configService.upConfig(configId, body);
        return { message: '已更新' };
    }
}
