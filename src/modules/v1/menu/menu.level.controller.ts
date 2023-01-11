import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Put,
    Query,
    Headers,
} from '@nestjs/common';
import { ApiHeader, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TokenService } from '@src/modules/token.service';
import { V1BaseCoontroller } from '@v1/base.controller';
import {
    MenuLevelItemDV,
    MenuLevelListResultDV,
    MenuMessageDV,
} from './menu.dataview';
import {
    MenuLevelCreateDTO,
    MenuLevelListParamDTO,
    MenuLevelUpdateDTO,
} from './menu.level.dto';
import { MenuLevelService } from './menu.level.service';

@ApiTags('權限模塊')
@Controller(V1BaseCoontroller.toPrefix('menu_level'))
export class MenuLevelController extends V1BaseCoontroller {
    constructor(
        private readonly menuLevelService: MenuLevelService,
        private readonly tokenService: TokenService,
    ) {
        super();
    }

    @ApiHeader({
        name: 'token',
        description: '臨時密鑰',
        required: true,
    })
    @ApiResponse({
        description: '返回一组权限列表',
        type: MenuLevelListResultDV,
    })
    @Get('list')
    async list(@Query() query: MenuLevelListParamDTO) {
        const result = await this.menuLevelService.list(query);
        return result;
    }

    @ApiHeader({
        name: 'token',
        description: '臨時密鑰',
        required: true,
    })
    @ApiResponse({
        description: '返回一组权限列表',
        type: MenuLevelListResultDV,
    })
    @Get('recall')
    async recallList(@Query() query: MenuLevelListParamDTO) {
        const result = await this.menuLevelService.list(query);
        return result;
    }

    @ApiHeader({
        name: 'token',
        description: '臨時密鑰',
        required: true,
    })
    @ApiResponse({
        description: '返回一组权限列表',
        type: MenuLevelItemDV,
        isArray: true,
    })
    @Get('get')
    async get(@Headers('token') token: string) {
        const { level } = this.tokenService.tokenMap.get(token);
        const result = await this.menuLevelService.getByLevel(level);
        return result;
    }

    @ApiHeader({
        name: 'token',
        description: '臨時密鑰',
        required: true,
    })
    @ApiResponse({
        description: '新增权限项',
        type: MenuMessageDV,
    })
    @Post('add')
    async add(@Body() data: MenuLevelCreateDTO) {
        await this.menuLevelService.add(data);
        return { message: '新增成功' };
    }

    @ApiHeader({
        name: 'token',
        description: '臨時密鑰',
        required: true,
    })
    @ApiResponse({
        description: '编辑权限项，传入对应的新增项目进行更新',
        type: MenuMessageDV,
    })
    @Put('edit/:id')
    async edit(@Param('id') id: number, data: MenuLevelUpdateDTO) {
        await this.menuLevelService.edit(id, data);
        return { message: '已修改' };
    }

    @ApiHeader({
        name: 'token',
        description: '臨時密鑰',
        required: true,
    })
    @ApiResponse({
        description: '将一组权限列表放入回收站',
        type: MenuMessageDV,
    })
    @ApiParam({
        name: 'ids',
        description: '权限id1,权限id2,权限id3',
    })
    @Delete('delete/:ids')
    async del(@Param('ids') ids: string) {
        const intIds = this.toNumberIds(ids);
        await this.menuLevelService.del(intIds);
        return { message: '已放入回收列表' };
    }

    @ApiHeader({
        name: 'token',
        description: '臨時密鑰',
        required: true,
    })
    @ApiResponse({
        description: '从回收站复原',
        type: MenuMessageDV,
    })
    @ApiParam({
        name: 'ids',
        description: '权限id1,权限id2,权限id3',
    })
    @Patch('recall/:ids')
    async recall(@Param('ids') ids: string) {
        const intIds = this.toNumberIds(ids);
        await this.menuLevelService.recall(intIds);
        return { message: '已從回收列表中恢復' };
    }

    @ApiHeader({
        name: 'token',
        description: '臨時密鑰',
        required: true,
    })
    @ApiResponse({
        description: '从回收站删除',
        type: MenuMessageDV,
    })
    @ApiParam({
        name: 'ids',
        description: '权限id1,权限id2,权限id3',
    })
    @Delete('destroy/:ids')
    async destroy(@Param('ids') ids: string) {
        const intIds = this.toNumberIds(ids);
        await this.menuLevelService.destroy(intIds);
        return { message: '已刪除' };
    }
}
