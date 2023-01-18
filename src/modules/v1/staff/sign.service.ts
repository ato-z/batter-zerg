import { type StaffBase, StaffModel } from '@database/staff.database';
import { ImageModel } from '@database/image.database';
import {
    ApiException,
    ApiNotFoundException,
    SignMissException,
} from '@src/exceptions';
import { StaffStatusEnum } from '@src/enum';
import { HttpStatus, NotFoundException } from '@nestjs/common';
import { appConfig } from '@config/app';
import * as sha1 from 'sha1';

const { hash } = appConfig;

export class SignService {
    constructor(
        protected readonly model: StaffModel,
        protected readonly imageModel: ImageModel,
    ) {}

    /** 创建用户登录凭证 */
    async createSign(staff: StaffBase, userAgent: string) {
        const id = staff.id;
        const pass = staff.password.replace(/g/gi, '');
        const keyIndex = hash.charCodeAt(id % hash.length);
        const hashVal = this.charCodeVal(hash);
        const now = Date.now().toString(16);
        const sign = [
            sha1(pass + now + userAgent),
            now,
            (hashVal + id * keyIndex).toString(16),
            keyIndex.toString(16),
        ].join('g');
        return sign;
    }

    /** 解密登录密钥 */
    async decodeLoginSign(sign: string, userAgent: string) {
        if (sign === undefined) throw new SignMissException('非法访问');
        const codeSign = sign.split('g');
        if (codeSign.length !== 4) throw new SignMissException('非法秘钥');
        const [codePass, createTime, codeId, keyIndex] = codeSign;

        // 校验是否已过有效期, config.signTime为0不判断有效期
        const _createTime = parseInt('0x' + createTime);
        if (
            appConfig.signTime !== 0 &&
            _createTime + appConfig.signTime < Date.now()
        ) {
            throw new SignMissException('登录过期');
        }
        // 还原用户id
        const _codeId = parseInt('0x' + codeId);
        const _keyIndex = parseInt('0x' + keyIndex);
        const hashVal = this.charCodeVal(hash);
        const uid = (_codeId - hashVal) / _keyIndex;
        // 对用户身份进行校验
        const staff = await this.model.get({ id: uid });
        if (staff === null) throw new ApiNotFoundException(`账户不存在`);
        const staffData = staff.data;
        const password = staffData?.password?.replace(/g/gi, '');
        const checkPassword = sha1(password + createTime + userAgent);
        if (checkPassword !== codePass) throw new SignMissException('非法秘钥');
        // 检验用户合法性
        this.checkStaff(staffData, staffData.password);
        return staffData;
    }

    /** 检验账号是否可用 */
    protected checkStaff(
        staff: StaffBase | null,
        checkPassword: string,
    ): staff is StaffBase {
        if (staff === null) throw new ApiNotFoundException(`账户不存在`);
        if (staff.delete_date) throw new ApiNotFoundException(`账户已删除`);
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
        const codePassworld = this.codePassworld(name, password);
        const staff = await this.model.get({
            name: name,
        });
        if (staff === null) throw new NotFoundException('當前員工賬號不存在~');
        this.checkStaff(staff.data, codePassworld);

        return staff.data;
    }

    /** 对每个字符的ASCII码相加并返回 */
    private charCodeVal(str: string): number {
        return str
            .split('')
            .map((str: string) => {
                return str.charCodeAt(0);
            })
            .reduce((prev: number, curr: number) => prev + curr);
    }

    /** 傳入用戶名 + 密碼返回一段加密的密碼 */
    protected codePassworld(name: string, password: string) {
        return sha1(hash + name + password);
    }
}
