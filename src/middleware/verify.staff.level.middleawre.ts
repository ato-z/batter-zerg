import { appConfig } from '@config/app';
import {
    type MenuLevelBase,
    MenuLevelModel,
} from '@database/menu.level.database';
import { Inject, NestMiddleware } from '@nestjs/common';
import { StaffLevel, Visit } from '@src/enum';
import { ApiForbidden } from '@src/exceptions';
import { TokenService } from '@src/modules/token.service';
import type { Request, Response } from 'express';

export class VerifyStaffLevel implements NestMiddleware {
    private readonly menuLevelMap = new Map<string, MenuLevelBase>();
    private openApiWhiteList = appConfig.openApiWhiteList;

    constructor(
        @Inject(MenuLevelModel) private readonly menuLevelModel: MenuLevelModel,
        @Inject(TokenService) private readonly tokenService: TokenService,
    ) {
        this.initMenuLevelList();
    }

    use(req: Request, res: Response, next: () => void) {
        const { url, baseUrl, headers, method } = req;
        if (this.inWhiteList(url)) return next();
        const token = (headers?.token ?? '') as string;
        const model = this.deCodeModelByUrl(url);
        if (this.verify(token, model, method) === false)
            throw new ApiForbidden(`Cannot ${method} ${baseUrl}${url}`);
        next();
    }

    private inWhiteList(url: string) {
        const index = this.openApiWhiteList.findIndex((item) =>
            url.includes(item),
        );
        return index !== -1;
    }

    private verify(token: string, model: string, method: string) {
        if (this.tokenService.hasSuperAdmin(token)) return true;
        const tokenData = this.tokenService.tokenMap.get(token);
        const key = this.codeMapKey(model, tokenData.level);
        if (!this.menuLevelMap.has(key)) return false;
        const menuLevel = this.menuLevelMap.get(key);
        if (menuLevel[method.toLowerCase()] === Visit.RELEASE) return true;
        return false;
    }

    private deCodeModelByUrl(url: string) {
        const models = url.split('/');
        const model = models.find(
            (item) => item !== '' && !/^v\d+$/.test(item),
        );
        return model;
    }

    private codeMapKey(model: string, level: StaffLevel) {
        return `${model}-${level}`;
    }

    private async initMenuLevelList() {
        const list = await this.menuLevelModel.selete({
            where: {
                and: {
                    delete_date: null,
                },
            },
        });
        if (list === null) return;
        list.forEach((item) => {
            const data = item.data;
            const key = this.codeMapKey(data.model, data.level);
            this.menuLevelMap.set(key, data);
        });
    }
}
