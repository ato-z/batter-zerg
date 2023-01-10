import { MenuModel } from '@database/menu.database';
import { Injectable } from '@nestjs/common';
import { StaffLevel } from '@src/enum';
import { date } from '@src/tool';
import { OP } from 'mysql-crud-core/enum';
import { MenuCreateDTO, MenuUpdataDTO } from './menu.dto';

@Injectable()
export class MenuService {
    private tree = new Map<StaffLevel, unknown>();

    constructor(private readonly menuModel: MenuModel) {}

    private withPath(path: string) {
        const newPath = path.replace(/^\s+|\s+$/g, '');
        return '/'.concat(newPath.replace(/^\/+|\/+$/g, ''));
    }

    /** 添加分类 */
    async add(data: MenuCreateDTO) {
        data.path = this.withPath(data.path);
        await this.menuModel.insert(data);
    }

    /** 編輯分類 */
    async edit(data: MenuUpdataDTO, menuId: number) {
        console.log(data);
        if (data.path) data.path = this.withPath(data.path);
        await this.menuModel.update(data, {
            where: { and: { id: menuId } },
        });
    }

    /** 刪除分類 */
    async del(menuIds: number[]) {
        await this.menuModel.update(
            {
                delete_date: date('y-m-d h:i:s'),
            },
            {
                where: {
                    and: {
                        id: [OP.IN, menuIds],
                    },
                },
            },
        );
    }

    async index(level: StaffLevel) {
        if (this.tree.has(level)) return this.tree.get(level);
        const tree = await this.getIndexByDb(level);
        this.tree.set(level, tree);
        return tree;
    }

    async upIndex(level: StaffLevel) {
        const tree = await this.getIndexByDb(level);
        this.tree.set(level, tree);
        return tree;
    }

    private async getIndexByDb(level: StaffLevel) {
        const result = await this.menuModel.selete({
            where: {
                and: { delete_date: null, level: [OP.ELT, level] },
            },
        });
        if (result === null) return [];
        const list = await Promise.all(result.map((item) => item.toJSON()));
        const tree = this.codeMenuTree(list);
        return tree;
    }

    private codeMenuTree(list: { pid: number; id: number }[]) {
        const tree = [];
        const treeMap = {};
        list.forEach((item) => {
            if (item.pid === 0) {
                const children = [];
                tree.push(item);
                treeMap[item.id] = children;
                return;
            }
            const children = treeMap[item.pid];
            if (children === undefined) return;
            children.push(item);
        });

        return tree.map((item) => ({
            ...item,
            children: treeMap[item.id] ?? [],
        }));
    }
}
