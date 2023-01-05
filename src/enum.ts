export enum StaffStatusEnum {
    // 离职
    DIMISSINO = -1,

    // 新创建
    CREATEED = 0,

    // 正常使用
    PUBLIC = 1,
}

export enum ImageFrom {
    // 本地
    LOCAL = 1,
}

export enum StaffLevel {
    // 业务员
    SALESMAN = 8,

    // 主管
    LEADER = 16,

    // 管理员
    ADMIN = 32,

    // 超级管理员
    SUPER_ADMIN = 255,
}

export enum GoodsSwitchType {
    // 交換
    ALTERNATE = 1,
    // 免費
    FREE = 2,
}

export enum GoodsStatus {
    // 下架
    OUT = -1,

    // 新創建，需審核上綫
    CREATE = 0,

    // 上架中
    ONLINE = 1,
}
