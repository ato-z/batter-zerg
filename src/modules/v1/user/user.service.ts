import { UserAddressModel } from '@database/user.address.database';
import { UserModel } from '@database/user.database';
import { Injectable, NotFoundException } from '@nestjs/common';
import { filterEmpty } from '@src/tool';
import { OP } from 'mysql-crud-core/enum';
import { UserListParamDTO } from './user.dto';

type SelectOption = UserModel['selete'] extends (option: infer O) => unknown
    ? O
    : never;

@Injectable()
export class UserService {
    constructor(
        private readonly userModel: UserModel,
        private readonly userAddressModel: UserAddressModel,
    ) {}

    private codeListParam(
        query: UserListParamDTO,
        where?: SelectOption['where']['and'],
    ) {
        const filterQuery = filterEmpty(query);
        const option: SelectOption = {
            limit: [query.start, query.end],
            where: { and: {} },
            order: ['id', 'DESC'],
        };
        if (filterQuery.nickname !== undefined)
            option.where.and.nickname = `%${filterQuery.nickname}%`;
        if (filterQuery.open_id !== undefined)
            option.where.and.open_id = filterQuery.open_id;
        let create_date = null;
        if (filterQuery.start_date && filterQuery.end_date) {
            create_date = [
                OP.BETWEEN,
                [filterQuery.start_date, filterQuery.end_date],
            ];
        } else if (filterQuery.start_date) {
            create_date = [OP.EGT, filterQuery.start_date];
        } else if (query.end_date) {
            create_date = [OP.ELT, filterQuery.end_date];
        }
        option.where.and.create_date = create_date ?? [OP.NEQ, null];
        Object.assign(option.where.and, where);
        return option;
    }

    async list(query: UserListParamDTO) {
        const option = this.codeListParam(query);
        const list = await Promise.all(
            (
                await this.userModel.selete(option)
            )?.map((user) => {
                user.append('school', ({ schools_id }) =>
                    this.userModel.findSchoolByID(schools_id),
                );
                return user.toJSON();
            }) ?? [],
        );
        const total = await this.userModel.total({
            where: option.where,
            join: option.join,
        });
        return { list, total };
    }

    async simpleList(query: UserListParamDTO) {
        const option = this.codeListParam(query, { nickname: [OP.NEQ, null] });
        option.field = ['id', 'avatar', 'nickname'];
        const list = (await this.userModel.selete(option))?.map(
            (user) => user.data,
        );
        return list;
    }

    async detail(uid: number) {
        const user = await this.userModel.find(uid);
        if (user === null) throw new NotFoundException('当前用户不存在~');
        user.append('school', ({ schools_id }) =>
            this.userModel.findSchoolByID(schools_id),
        );

        user.append('address', async ({ id }) => {
            const address = await this.userAddressModel.selete({
                where: { and: { uid: id } },
            });
            return address.map((i) => i.data) ?? [];
        });

        return user.toJSON();
    }
}
