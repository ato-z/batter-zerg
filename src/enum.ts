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

    // 七牛云
    QINIU = 2,
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

    // 正在交换中
    EXCHANGE = 2,

    // 交易结束
    OVER = 3,
}

export enum GoodsObserveStatus {
    // 新評論， 不可見
    CREATE = 0,

    // 可見
    ONLINE = 1,
}

export enum Gender {
    // 未知
    UNKONW = 0,

    // 男
    MAN = 1,

    // 女
    WOMAN = 2,
}

export enum GoodsOrderState {
    // 0发起订单
    CREATE = 0,

    // 1双方统一意见 ,交換中
    EXCHANGE = 1,

    // 2交换成功
    SUCCESS = 2,

    // 3交换失败
    ERROR = 3,
}

export enum Visit {
    // 禁止
    BAN = 0,

    // 放行
    RELEASE = 1,
}

// 0输入框 1switch切換 2文本域 3下拉菜单 4圖片上傳
export enum ConfigType {
    INPUT = 0,

    SWITCH = 1,

    TEXTAREA = 2,

    SELECT = 3,

    UPLOAD_IMG = 4,
}
