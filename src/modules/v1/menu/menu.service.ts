import { MenuBase, MenuModel } from '@database/menu.database';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MenuService {
    private tree = null;

    constructor(private readonly menuModel: MenuModel) {}

    async index() {
        if (this.tree !== null) return this.tree;
        const tree = await this.getIndexByDb();
        this.tree = tree;
        return tree;
    }

    async upIndex() {
        const tree = await this.getIndexByDb();
        this.tree = tree;
        return tree;
    }

    private async getIndexByDb() {
        const result = await this.menuModel.selete({
            where: {
                and: { delete_date: null },
            },
        });
        if (result === null) return [];
        const tree = this.codeMenuTree(result.map((item) => item.data));
        return tree;
    }

    private codeMenuTree(list: MenuBase[]) {
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
