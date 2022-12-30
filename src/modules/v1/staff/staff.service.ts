import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { appConfig } from '@config/app';
import * as sha1 from 'sha1';
import { type StaffBase, StaffModel } from '@database/staff.database';
import { StaffLevel, StaffStatusEnum } from '@src/enum';
import { ApiNotFoundException, ApiException } from '@src/exceptions';
import { StaffCreateDTO } from './staff.dto';
import { ImageModel } from '@database/image.databser';
const { hash } = appConfig;

export type StaffSelect = StaffModel['selete'] extends (
    query: infer R,
) => unknown
    ? R
    : any;
@Injectable()
export class StaffService {
    constructor(
        private readonly model: StaffModel,
        private readonly imageModel: ImageModel,
    ) {}

    /** 返回员工列表 */
    async list(option: StaffSelect) {
        const list = await this.model.selete(option);
        if (list === null) return [];
        const result = await Promise.all(list.map((item) => item.toJSON()));
        return result;
    }

    async createStaff(data: StaffCreateDTO) {
        const { name, password, rePassword, nickname, level, cover } = data;
        if (password !== rePassword)
            throw new ApiException('兩次輸入密碼不一致');

        const img = await this.imageModel.find(cover);
        if (img === null) throw new ApiException('非法的圖像id');
        this.checkoutLevel(level);
        await this.onlyName(name);

        /** 组装员工数据 */
        const codePass = StaffService.codePassworld(name, password);
        const status = StaffStatusEnum.CREATEED;
        const newStaff = {
            name,
            password: codePass,
            nickname,
            level,
            cover,
            status,
        };
        await this.model.insert(newStaff);
    }

    /** 檢查昵稱唯一性 */
    private async onlyName(name: string) {
        const staff = await this.model.get({
            name: name,
        });
        if (staff !== null)
            throw new ApiException(`${name} 已被占用，換個試試吧`);
    }

    /** 检测 level 值是否合法 */
    private checkoutLevel(level: number) {
        if (
            ![
                StaffLevel.ADMIN,
                StaffLevel.LEADER,
                StaffLevel.SALESMAN,
            ].includes(level)
        )
            throw new ApiException('意外的level值');
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

    /** 检验账号是否可用 */
    checkStaff(
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
        if (sign === undefined)
            throw new ApiException('非法访问', HttpStatus.FORBIDDEN);
        const codeSign = sign.split('g');
        if (codeSign.length !== 4)
            throw new ApiException('非法秘钥', HttpStatus.FORBIDDEN);
        const [codePass, createTime, codeId, keyIndex] = codeSign;

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
        const checkPassword = sha1(staffData.password + createTime + userAgent);
        if (checkPassword !== codePass)
            throw new ApiException('非法秘钥', HttpStatus.FORBIDDEN);
        // 检验用户合法性
        this.checkStaff(staffData, staffData.password);
        return staffData;
    }

    /** 通过员工id返回员工信息 */
    async getStaffByID(staffID: number) {
        const staff = await this.model.find(staffID);
        if (staff === null) throw new NotFoundException('當前員工不存在');
        staff.hidden('password');
        return staff;
    }

    /** 根據傳入的 level 返回一組可供切換的 新level */
    async getSwitchByLevel(level: number) {
        const list = this.staffLevel().filter((item) => item.value < level);
        return list;
    }

    /** 返回一組員工權限列表 */
    staffLevel() {
        return [
            {
                title: '业务员',
                value: StaffLevel.SALESMAN,
            },
            {
                title: '主管',
                value: StaffLevel.LEADER,
            },
            {
                title: '管理员',
                value: StaffLevel.ADMIN,
            },
            {
                title: '超级管理员',
                value: StaffLevel.SUPER_ADMIN,
            },
        ];
    }

    /** 返回一組員工狀態 */
    staffStatus() {
        return [
            {
                title: '離職',
                value: StaffStatusEnum.DIMISSINO,
            },
            {
                title: '審核中',
                value: StaffStatusEnum.CREATEED,
            },
            {
                title: '正常',
                value: StaffStatusEnum.PUBLIC,
            },
        ];
    }
}
