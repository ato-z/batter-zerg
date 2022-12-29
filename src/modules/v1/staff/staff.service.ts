import { HttpStatus, Injectable } from '@nestjs/common';
import { appConfig } from '@config/app';
import * as sha1 from 'sha1';
import { type StaffBase, StaffModel } from '@database/staff.database';
import { StaffStatusEnum } from '@src/enum';
import { ApiNotFoundException, ApiException } from '@src/exceptions';
const { hash } = appConfig;

@Injectable()
export class StaffService {
    constructor(private readonly model: StaffModel) {}

    /**
     * 对每个字符的ASCII码相加并返回
     * @param str {string} 字符串
     * @returns str字符串每个字符串的ASCII码相加后的结果
     * ```
     * StaffService.charCodeVal('ab')// a + b => 97 + 98 => 195
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
    checkStaff(
        staff: StaffBase | null,
        checkPassword: string,
    ): staff is StaffBase {
        if (staff === null) throw new ApiNotFoundException(`账户不存在`);
        if (staff.delete_date !== null)
            throw new ApiNotFoundException(`账户已删除`);
        if (staff.status === StaffStatusEnum.DIMISSINO)
            throw new ApiException(`账户已禁用`, HttpStatus.FORBIDDEN);
        if (staff.status === StaffStatusEnum.CREATEED)
            throw new ApiException(
                `请联系管理员开通账号`,
                HttpStatus.UNAUTHORIZED,
            );
        if (checkPassword !== staff.password)
            throw new ApiException('密码错误！', HttpStatus.UNAUTHORIZED);

        return true;
    }

    /** 賬號密碼登錄 */
    async login(name: string, password: string) {
        const codePassworld = StaffService.codePassworld(name, password);
        const staff = await this.model.get({
            name: name,
        });
        const staffData = await staff.toJSON();
        this.checkStaff(staffData, codePassworld);

        return staffData;
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

    /**
     * 解密登录密钥
     */
    async decodeLoginSign(sign: string) {
        if (sign === undefined)
            throw new ApiException('非法访问', HttpStatus.FORBIDDEN);
        const codeSign = sign.split('g');
        if (codeSign.length !== 4)
            throw new ApiException('非法秘钥', HttpStatus.FORBIDDEN);
        const [pass, createTime, codeId, keyIndex] = codeSign;

        // 校验是否已过有效期, config.signTime为0不判断有效期
        const _createTime = parseInt('0x' + createTime);
        if (
            appConfig.signTime !== 0 &&
            _createTime + appConfig.signTime < Date.now()
        ) {
            throw new ApiException('登录过期', HttpStatus.FORBIDDEN);
        }
        // 还原用户id
        const _codeId = parseInt('0x' + codeId);
        const _keyIndex = parseInt('0x' + keyIndex);
        const hashVal = this.charCodeVal(hash);
        const uid = (_codeId - hashVal) / _keyIndex;
        // 对用户身份进行校验
        const staff = await this.model.get({ id: uid });
        const staffData = await staff.toJSON();
        // 检验用户合法性
        this.checkStaff(staffData, pass);
        return staffData;
    }
}
