import { appConfig } from '@config/app';
import { staticConfig } from '@config/static';
import { StaffModel, type StaffBase } from '@database/staff.database';
import { Injectable } from '@nestjs/common';
import { TokenMissException } from '@src/Exceptions';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, join } from 'path';
import * as sha1 from 'sha1';
import { StaffService } from './staff/staff.service';

export type tokenProp = {
    id: number;
    level: number;
    nickname: string;
    name: string;
    password: string;
    expTime: number;
};

class TokenMap {
    get(tokenKey: string) {
        const { savePath } = this;
        try {
            const json = readFileSync(join(savePath, tokenKey), 'utf-8');
            const token = JSON.parse(json);
            return token;
        } catch {
            throw new TokenMissException();
        }
    }

    set(tokenKey: string, tokenData: tokenProp) {
        const { savePath } = this;
        writeFileSync(join(savePath, tokenKey), JSON.stringify(tokenData));
        return true;
    }

    get savePath() {
        return join(staticConfig.root, staticConfig.runtimeToken);
    }
}

@Injectable()
export class TokenService {
    constructor(
        private readonly staffModel: StaffModel,
        private readonly satffService: StaffService,
    ) {}

    static readonly tokenMap = new TokenMap();

    private get(tokenKey: string) {
        return TokenService.tokenMap.get(tokenKey);
    }

    create(staff: StaffBase) {
        const { id, level, nickname, name, password } = staff;
        const tokenKey = this.codeTokenKey(staff);
        const current = Date.now();
        const token: tokenProp = {
            id,
            level,
            nickname,
            name,
            password,
            expTime: appConfig.expTime + current,
        };
        TokenService.tokenMap.set(tokenKey, token);
        return tokenKey;
    }

    /**
     * 根据用户特征来返回一段token密钥
     * @param staff {StaffBase} 用户信息
     * @returns 一串不等长的密钥
     * ```
     * TokenService.codeTokenKey(staff) // tokenKey => 1as14as14aaeef11454646456462164
     * ```
     */
    codeTokenKey(staff: StaffBase) {
        const currnt = Date.now();
        return sha1(`${currnt}${staff.id}`);
    }

    /** 获取当前的用户信息 */
    async getByCurrentUser(tokenKey: string) {
        const { staffModel, satffService } = this;
        const token = this.get(tokenKey);
        const staff = await staffModel.find(token.id);
        satffService.checkStaff(staff, token.password);
        return staff;
    }
}
