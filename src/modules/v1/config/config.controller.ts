import { Controller, Get } from '@nestjs/common';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { V1BaseCoontroller } from '@v1/base.controller';
import { ConfigService } from './condig.service';

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
    @Get('os')
    async des() {
        const config = await this.configService.withOsConfig([10, 11, 12]);
        return config;
    }
}
