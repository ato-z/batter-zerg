import { Controller, Get } from '@nestjs/common';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { V1BaseCoontroller } from '@v1/base.controller';

@ApiTags('統計模塊')
@Controller(V1BaseCoontroller.toPrefix('dataview'))
export class DataViewController extends V1BaseCoontroller {
    @ApiResponse({
        description: '統計數據的聚合接口',
    })
    @ApiHeader({
        description: '臨時的token',
        name: 'token',
        required: true,
    })
    @Get('index')
    index() {
        return '首頁統計';
    }
}
