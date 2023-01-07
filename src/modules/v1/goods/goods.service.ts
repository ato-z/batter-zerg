import { appConfig } from '@config/app';
import { GoodsModel } from '@database/goods.database';
import { GoodsLikeBase, GoodsLikeModel } from '@database/goods.llike.database';
import {
    GoodsObserveBase,
    GoodsObserveModel,
} from '@database/goods.observe.database';
import { GoodsTagModel } from '@database/goods.tag.database';
import { SimpleUeseBase, UserModel } from '@database/user.database';
import { Injectable } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GoodsObserveStatus } from '@src/enum';
import { ApiException } from '@src/exceptions';
import { date, filterEmpty } from '@src/tool';
import { OP } from 'mysql-crud-core/enum';
import { GoodsCateService } from './goods.cate.service';
import { GoodsCreateDTO, GoodsListParamDTO, GoodsUpdateDTO } from './goods.dto';

const { postGoodsUID } = appConfig;

export type SelectGoodsOption = GoodsModel['selete'] extends (
    o: infer O,
) => unknown
    ? O
    : never;

@Injectable()
export class GoodsService {
    constructor(
        private readonly goodsCateSecvice: GoodsCateService,
        private readonly goodsModel: GoodsModel,
        private readonly goodsLikeModel: GoodsLikeModel,
        private readonly goodsObserve: GoodsObserveModel,
        private readonly goodsTagModel: GoodsTagModel,
        private readonly userModel: UserModel,
    ) {}

    /** 传入query查询参数，返回列表的查询参数 */
    private async codeListParam(query: GoodsListParamDTO) {
        const filterQuery = filterEmpty(query);
        const option: SelectGoodsOption = {
            limit: [filterQuery.start, filterQuery.end],
            where: { and: {} },
        };
        if (filterQuery.cate_id !== undefined)
            option.where.and.cate_id = filterQuery.cate_id;
        if (filterQuery.status !== undefined)
            option.where.and.status = filterQuery.start;
        if (filterQuery.tags !== undefined) {
            const tags = await this.goodsTagModel.get({
                name: filterQuery.tags,
            });
            if (tags === null) throw new ApiException('tags 不存在');
            option.where.and.tags = [OP.LIKE, `%,${tags.data.id},%`];
        }
        if (filterQuery.title !== undefined)
            option.where.and.title = `%${filterQuery.title}%`;
        if (filterQuery.type !== undefined)
            option.where.and.type = filterQuery.type;
        if (filterQuery.uid !== undefined)
            option.where.and.uid = filterQuery.uid;

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
        if (create_date !== null) option.where.and.create_date = create_date;
        return option;
    }

    /** 获取列表 */
    async list(
        query: GoodsListParamDTO,
        where: SelectGoodsOption['where']['and'],
    ) {
        const option = await this.codeListParam(query);
        Object.assign(option.where.and, where);
        option.field = [
            'id',
            'uid',
            'cate_id',
            'title',
            'cover',
            'message',
            'type',
            'status',
            'create_date',
            'delete_date',
            'tags',
        ];
        const list = await this.goodsModel.selete(option);
        const userMap = await this.getSimpleUserMap(list.map((i) => i.data));
        const listData = await Promise.all(
            list.map((item) => {
                item.append('user', (data) => userMap[data.uid]);
                item.hidden(['cate_id', 'uid']);
                const result = item.toJSON();
                return result;
            }),
        );
        const total = await this.goodsModel.total(option);
        return {
            total,
            list: listData,
        };
    }

    /** 新增物品 */
    async add(data: GoodsCreateDTO) {
        const codeData = Object.assign({ uid: postGoodsUID }, data);
        if (data.cate_id === undefined) codeData.cate_id = 0;
        await this.goodsModel.insert(codeData);
    }

    /** 编辑物品信息 */
    async edit(goodsId: number, updata: GoodsUpdateDTO) {
        const codeData = filterEmpty(updata);
        if (Object.keys(codeData).length === 0)
            throw new ApiException('無更新');
        await this.goodsModel.update(codeData, {
            where: { and: { id: goodsId } },
        });
    }

    /** 獲取物品信息 */
    async data(goodsId: number) {
        const good = await this.goodsModel.find(goodsId);
        good.append('post_user', (data) => this.getUDataByUID(data.uid));
        good.append('cate', (data) => {
            if (data.cate_id === 0) return null;
            return this.goodsCateSecvice.find(data.cate_id);
        });
        const likes = await this.getLikesByGoodsID(goodsId);
        const observe = await this.getObserveByGoodsID(goodsId);
        const codeLikesAndObserve = await this.codeLikesAndObserve(
            likes,
            observe,
        );
        good.append('likes', () => codeLikesAndObserve.likes);
        good.append('observes', () => codeLikesAndObserve.observes);
        good.hidden(['uid', 'delete_date']);
        const goodData = await good.toJSON();
        return goodData;
    }

    /** 放入回收列表 */
    async del(...goodsIds: number[]) {
        await this.goodsModel.update(
            {
                delete_date: date('y-m-d h:i:s'),
            },
            {
                where: {
                    and: { id: [OP.IN, goodsIds], delete_date: null },
                },
            },
        );
    }

    /** 从回收列表复原 */
    async recall(...goodsIds: number[]) {
        await this.goodsModel.update(
            {
                delete_date: null,
            },
            {
                where: {
                    and: { id: [OP.IN, goodsIds], delete_date: [OP.NEQ, null] },
                },
            },
        );
    }

    /** 从回收列表中删除 */
    async destroy(...goodsIds: number[]) {
        await this.goodsModel._delete({
            where: {
                and: { id: [OP.IN, goodsIds], delete_date: [OP.NEQ, null] },
            },
        });
    }

    /** 查找用户的信息 */
    private async getUDataByUID(uid: number) {
        const user = await this.userModel.find(uid);
        if (user === null) return null;
        user.append('school', ({ schools_id }) =>
            this.userModel.findSchoolByID(schools_id),
        );
        return user.toJSON();
    }

    /** 查询物品的点赞信息 */
    private async getLikesByGoodsID(goodsId: number) {
        const likes = await this.goodsLikeModel.selete({
            where: {
                and: { goods_id: goodsId, delete_date: null },
            },
            field: ['uid', 'create_date'],
        });
        if (likes === null) return [];
        return likes.map((item) => item.data);
    }

    /** 查詢物品的評論信息 */
    private async getObserveByGoodsID(goodsId: number) {
        const chats = await this.goodsObserve.selete({
            where: {
                and: {
                    goods_id: goodsId,
                    status: GoodsObserveStatus.ONLINE,
                    delete_date: null,
                },
            },
            field: ['id', 'content', 'uid', 'from_id', 'create_date'],
        });
        if (chats === null) return [];
        return chats.map((item) => item.data);
    }

    /** 批量獲取評論以及評論中的用戶信息 */
    private async getSimpleUserMap(list: Array<{ uid: number }>) {
        const uidSet = new Set<string | number>(list.map((i) => i.uid));
        const uids = [...uidSet];
        const users = (await Promise.all(
            (
                await this.userModel.selete({
                    where: {
                        and: { id: [OP.IN, uids] },
                    },
                    field: ['id', 'nickname', 'avatar'],
                })
            ).map((user) => {
                return user.toJSON();
            }),
        )) as unknown as SimpleUeseBase[];

        const userMap: Record<number | string, SimpleUeseBase> = {};
        users.forEach((user) => {
            userMap[user.id] = user;
        });
        return userMap;
    }
    private async codeLikesAndObserve(
        likes: GoodsLikeBase[],
        observes: GoodsObserveBase[],
    ) {
        const userMap = await this.getSimpleUserMap([...likes, ...observes]);
        const observeMap = {};
        observes.forEach(
            (ob) =>
                (observeMap[ob.id] = {
                    id: ob.id,
                    user: userMap[ob.uid],
                    content: ob.content,
                    from_user: undefined,
                    create_date: ob.create_date,
                }),
        );
        return {
            likes: likes.map((like) => ({
                id: like.id,
                user: userMap[like.uid],
                create_date: like.create_date,
            })),
            observes: observes.map((ob) => {
                const observe = observeMap[ob.id];
                if (ob.from_id !== undefined)
                    observe.from_user = observeMap[ob.from_id];
                return observe;
            }),
        };
    }
}
