import { Injectable } from '@nestjs/common';
import { appConfig } from '@config/app';
import * as sha1 from 'sha1';
import { type StaffBase, StaffModel } from '@database/staff.database';
import { NotFoundException, HttpException } from '@nestjs/common';
import { StaffStatusEnum } from '@src/enum';
const { hash } = appConfig;

@Injectable()
export class StaffService {
    constructor(private readonly model: StaffModel) {}

    /**
     * 对每个字符的ASCII码相加并返回
     * @param str {string} 字符串
     * @returns str字符串每个字符串的ASCII码相加后的结果
     * ```
     * ServiceUser.charCodeVal('ab')// a + b => 97 + 98 => 195
     * ```
     */
    private charCodeVal(str: string): number {
        return str
            .split('')
            .map((str: string) => {
                return str.charCodeAt(0);
            })
            .reduce((prev: number, curr: number) => prev + curr);
    }

    /** 检验账号是否可用 */
    private checkStaff(
        staff: StaffBase | null,
        checkPassword: string,
    ): staff is StaffBase {
        if (staff === null) throw new NotFoundException(`${name} 不存在~`);
        if (staff.status === StaffStatusEnum.DIMISSINO)
            throw new HttpException(`账户已禁用`, 403);
        if (staff.status === StaffStatusEnum.CREATEED)
            throw new HttpException(`请联系管理员开通账号`, 403);

        if (checkPassword !== staff.password)
            throw new HttpException('密码错误！', 403);

        return true;
    }

    /** 賬號密碼登錄 */
    async login(name: string, password: string) {
        const codePassworld = StaffService.codePassworld(name, password);
        const staff = await this.model.get({
            name: name,
        });
        this.checkStaff(staff, codePassworld);

        return staff;
    }
    /** 傳入用戶名 + 密碼返回一段加密的密碼 */
    static codePassworld(name: string, password: string) {
        return sha1(hash + name + password);
    }

    /** 创建用户登录凭证 */
    async createSign(staff: StaffBase) {
        const id = staff.id;
        const pass = staff.password.replace(/g/gi, '');
        const keyIndex = hash.charCodeAt(id % hash.length);
        const hashVal = this.charCodeVal(hash);
        const sign = [
            pass,
            Date.now().toString(16),
            (hashVal + id * keyIndex).toString(16),
            keyIndex.toString(16),
        ].join('g');
        return sign;
    }
}
