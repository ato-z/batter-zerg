export const appConfig = {
    /** 开启所在的端口 */
    runPort: 3000,
    /** 上线使用0.0.0.0 */
    runIp: '0.0.0.0',
    /** 使用跨域 */
    crossDomain: true,
    /** 发生异常时是否抛出, 不抛出写入日志 */
    debug: false,
    /** token有效期 */
    tokenExTime: 7200,
    /** cache缓存时间粒度, 1表示1天 7表示7天 */
    cacheSize: 7,
    /** 是否开启缓存 */
    cacheOpen: false,
    /** 密码加盐 */
    hash: 'wNB2+c#%',
    /** 用户登录密钥有效期， 登录密钥可换取token。 单位毫秒 */
    // signTime: 0 // 0为永久有效， 除非用户更换密码
    signTime: 30 * 24 * 3600 * 1000, // 30天有效
    /** token有效期 */
    expTime: 7200,
    /** 图片上传大小限制 */
    maxUploadImage: 5 * 1024 * 1024, // 5M
    /** 圖像上傳至服務器的默認色碼 */
    themeImageColor: '121212',
    /** swagger文檔配置 */
    swagger: {
        title: '易物後端api',
        des: '易物後端api説明文檔。獲取文檔配置文件， 請 <a href="/docs-json" target="zerg_api">點擊這裏</a>',
        /** 當前主aip版本 */
        version: 'v1',
    },
    /** 后台发布物品时的默认用户id */
    postGoodsUID: 1,
    /** 開放接口白名單 */
    openApiWhiteList: [
        'staff/login',
        'staff/token',
        'staff/repassword',
        'staff/edit',
        'staff/get',
        'staff/prop',
        'upload/image',
        'menu/get',
    ],
};
