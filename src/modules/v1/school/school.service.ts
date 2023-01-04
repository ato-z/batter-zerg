import { SchoolModel } from '@database/school.database';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ApiException } from '@src/exceptions';
import { date } from '@src/tool';
import { OP } from 'mysql-crud-core/enum';
import { SchoolCreateDTO, SchoolUpdateDTO } from './scholl.dto';

type SchoolSelect<Q extends SchoolModel['selete']> = Q extends (
    query: infer R,
) => unknown
    ? R
    : any;

@Injectable()
export class SchoolService {
    constructor(private readonly schoolModel: SchoolModel) {}

    /** 物理销毁数据 */
    async destroy(...schoolIds: number[]) {
        const { schoolModel } = this;

        await schoolModel._delete({
            where: {
                and: schoolIds
                    ? {
                          id: [OP.IN, schoolIds],
                          delete_date: [OP.NEQ, null],
                      }
                    : { delete_date: [OP.NEQ, null] },
            },
        });
        return true;
    }

    /** 返回列表 */
    async list(query: SchoolSelect<SchoolModel['selete']>) {
        const list = await this.schoolModel.selete(query);
        if (list === null) return { total: 0, list: [] };
        const listData = await Promise.all(
            list.map((item) => item.hidden(['delete_date']).toJSON()),
        );
        const total = await this.schoolModel.total({
            where: query.where,
            join: query.join,
        });
        return {
            list: listData,
            total,
        };
    }

    /** 復原學校 */
    async recall(...schoolIds: number[]) {
        const { schoolModel } = this;
        // 查詢出需要復原的學校信息
        const schools = await schoolModel.selete({
            where: {
                and: { id: [OP.IN, schoolIds], delete_date: [OP.NEQ, null] },
            },
        });
        // 不存在不進行復原操作
        if (schools === null) return -1;
        const schoolDatas = await Promise.all(
            schools.map((school) => school.toJSON()),
        );
        // 學校是否已存在普通列表中
        const schoolExistNames = await schoolModel.selete({
            where: {
                and: {
                    name: [OP.IN, schoolDatas.map((item) => item.name)],
                    delete_date: null,
                },
            },
        });
        // 如果學校名已存在則不復原
        const updateIds = [];
        let state = 1;
        if (schoolExistNames !== null) {
            const schoolExistDatas = await Promise.all(
                schoolExistNames.map((school) => school.toJSON()),
            );
            const schoolExistNameS = schoolExistDatas.map((item) => item.name);
            const diffIDs = schoolDatas
                .filter((item) => !schoolExistNameS.includes(item.name))
                .map((item) => item.id);
            updateIds.push(...diffIDs);
            state = 0;
        } else {
            // 正常傳入的學校id全復原
            updateIds.push(schoolDatas.map((item) => item.id));
        }

        // 無操作
        if (updateIds.length === 0) return -1;

        // 數據庫更新
        await schoolModel.update(
            {
                delete_date: null,
            },
            { where: { and: { id: [OP.IN, updateIds] } } },
        );

        return state;
    }

    /** 刪除學校 */
    async del(...schoolIds: number[]) {
        const { schoolModel } = this;
        await schoolModel.update(
            {
                delete_date: date('Y-M-D H:I:S'),
            },
            {
                where: {
                    and: { id: [OP.IN, schoolIds] },
                },
            },
        );

        return true;
    }

    /** 更新學校 */
    async update(body: SchoolUpdateDTO, schoolId: number) {
        const { schoolModel } = this;
        const school = await this.findSchoolById(schoolId);
        if (school === null) throw new NotFoundException('當前學校不存在');
        // 如果更新了name需要判斷， name是否重複
        if (body.name) {
            const schoolName = await schoolModel.get({
                name: body.name,
                delete_date: null,
                id: [OP.NEQ, schoolId],
            });
            if (schoolName !== null) throw new ApiException('學校名已存在~');
        }
        await schoolModel.update(body, {
            where: {
                and: { id: schoolId },
            },
        });
        return true;
    }

    /** 创建學校 */
    async create(body: SchoolCreateDTO) {
        const school = await this.findSchoolByName(body.name);
        if (school !== null)
            throw new ApiException('當前學校已存在，請勿重複添加');

        await this.schoolModel.insert(body);

        const newScholl = await this.findSchoolByName(body.name);
        newScholl.hidden(['delete_date']);
        return newScholl.toJSON();
    }

    /** 通过學校名查找 */
    async findSchoolByName(name: string) {
        const school = await this.schoolModel.get({
            name,
            delete_date: null,
        });
        return school;
    }

    /** 通过學校id查找 */
    async findSchoolById(id: number) {
        const school = await this.schoolModel.get({
            id,
            delete_date: null,
        });
        return school;
    }

    /** 通過id查詢, 不限制刪除狀態 */
    async findSchool(id: number) {
        const school = await this.schoolModel.find(id);
        return school;
    }
}
