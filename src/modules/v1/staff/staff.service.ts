import { Injectable, NotFoundException } from '@nestjs/common';
import { ImageModel } from '@database/image.databser';
import { type StaffBase, StaffModel } from '@database/staff.database';
import { StaffLevel, StaffStatusEnum } from '@src/enum';
import { ApiException } from '@src/exceptions';
import {
    StaffCreateDTO,
    StaffRePasswordDTO,
    StaffUpdateDTO,
} from './staff.dto';
import { SignService } from './sign.service';
import { OP } from 'mysql-crud-core/enum';
import { date } from '@src/tool';

export type StaffSelect = StaffModel['selete'] extends (
    query: infer R,
) => unknown
    ? R
    : any;

@Injectable()
export class StaffService extends SignService {
    constructor(model: StaffModel, imageModel: ImageModel) {
        super(model, imageModel);
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

    /** 軟刪除員工 */
    async del(...staffIds: number[]) {
        await this.model.update(
            {
                delete_date: date('y-m-d h:i:s'),
            },
            {
                where: {
                    and: { id: [OP.IN, staffIds], delete_date: null },
                },
            },
        );
    }

    /** 軟刪除員工 */
    async destroy(...staffIds: number[]) {
        await this.model._delete({
            where: {
                and: { id: [OP.IN, staffIds], delete_date: [OP.NEQ, null] },
            },
        });
    }

    /** 復原被刪除的員工信息 */
    async recall(...staffIds: number[]) {
        await this.model.update(
            {
                delete_date: null,
            },
            {
                where: {
                    and: { id: [OP.IN, staffIds], delete_date: [OP.NEQ, null] },
                },
            },
        );
    }

    /** 返回员工列表 */
    async list(option: StaffSelect) {
        const list = await this.model.selete(option);
        if (list === null) return [];
        const result = await Promise.all(
            list.map((item) => {
                item.hidden(['password']);
                return item.toJSON();
            }),
        );
        return result;
    }

    /** 创建员工 */
    async createStaff(data: StaffCreateDTO) {
        const { name, password, rePassword, nickname, level, cover } = data;
        if (password !== rePassword)
            throw new ApiException('兩次輸入密碼不一致');

        const img = await this.imageModel.find(cover);
        if (img === null) throw new ApiException('非法的圖像id');
        this.checkoutLevel(level);
        await this.onlyName(name);

        /** 组装员工数据 */
        const codePass = this.codePassworld(name, password);
        const status = data.status ?? StaffStatusEnum.CREATEED;
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

    /** 修改员工信息 */
    async updataStaff(
        targetStaff: StaffBase,
        currentStaff: StaffBase,
        data: StaffUpdateDTO | StaffRePasswordDTO,
    ) {
        const updata = {};
        // 如果修改了密码
        if (data instanceof StaffRePasswordDTO) {
            Object.assign(updata, {
                password: this.codePassworld(targetStaff.name, data.password),
            });
        } else {
            if (data.name && targetStaff.name !== data.name)
                await this.onlyName(data.name);

            if (data.level && data.level >= currentStaff.level)
                throw new ApiException('您暫無權權限修改level');

            Object.assign(updata, data);
        }

        await this.model.update(updata, {
            where: { and: { id: targetStaff.id } },
        });
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

    /** 檢查昵稱唯一性 */
    protected async onlyName(name: string) {
        const staff = await this.model.get({
            name: name,
        });
        if (staff !== null)
            throw new ApiException(`${name} 已被占用，換個試試吧`);
    }

    /** 检测 level 值是否合法 */
    protected checkoutLevel(level: number) {
        if (
            ![
                StaffLevel.ADMIN,
                StaffLevel.LEADER,
                StaffLevel.SALESMAN,
            ].includes(level)
        )
            throw new ApiException('意外的level值');
    }
}
