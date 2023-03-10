import { accessSync, mkdirSync } from 'fs';
import { Parser } from 'imagesize';

/**
 * 个位数填充0
 * @param {number} n 需要检验的字符
 * @returns 转化后的字符
 * ```
 * fillZero(1) // => 01
 * fillZero(10) // => 10
 * ```
 */
export const fillZero = (n: number | string): string => {
    const codeN = n.toString();
    if (codeN.length > 1) {
        return codeN;
    }
    return '0' + codeN;
};

/**
 * 特定格式时间字符串转实际时间
 * @param {string} dateString 需要格式的字符串，如: Y年m月d日 h时m分s秒
 * @param {Date}   _date        new Date()
 * @returns 格式化后的字符串: y-m-d H:i:s => 2022-02-02 10:00:00
 * ```
 * const datatime = date('Y年m月d日 h时m分s秒', new Date()) // => 2021年01月05日 10时10分10秒
 * ```
 */
export const date = (dateString: string, _date?: Date) => {
    const reg = /[y|m|d|h|i|s]/gi;
    const date = _date ?? new Date();
    dateString = dateString.replace(reg, (val): string => {
        val = val.toUpperCase();
        switch (val) {
            case 'Y':
                return date.getFullYear().toString();
            case 'M':
                return fillZero(date.getMonth() + 1);
            case 'D':
                return fillZero(date.getDate());
            case 'H':
                return fillZero(date.getHours());
            case 'I':
                return fillZero(date.getMinutes());
            case 'S':
                return fillZero(date.getSeconds());

            default:
                return '';
        }
    });
    return dateString;
};

/**
 * 确认路径是否存在，不存在则创建
 * @param path {string} 路径地址
 * ```
 * const path = '/a/b/c'
 * touchPath(path)
 * ```
 */
export const touchPath = (path: string) => {
    const diffPath: string[] = [];
    const decodePath: string[] = path.split('/');
    const popHandle = () => {
        try {
            const currentPath = decodePath.join('/');
            if (decodePath.length > 0) accessSync(currentPath);
        } catch {
            const diff = decodePath.pop();
            diffPath.push(diff);
            popHandle();
        }
    };
    popHandle();
    while (diffPath.length > 0) {
        const nextDir = diffPath.pop();
        decodePath.push(nextDir);
        const currentPath = decodePath.join('/');
        mkdirSync(currentPath);
    }
};

/**
 * 返回图像的大小
 * @param buffer 二进制数据
 */
export const getImageAttr = (
    buffer: Buffer,
): { format: string; width: number; height: number } => {
    const parser = Parser();
    const statu = parser.parse(buffer);
    if (Parser.DONE !== statu) return null;
    return parser.getResult();
};

/**
 * 過濾空選項
 * @param data {object}
 * @returns
 */
export const filterEmpty = <T extends object>(data: T) => {
    const keys = Object.keys(data);
    const withKeys = keys.filter((key) => {
        const val = data[key];
        if (val === 0) return true;
        return val;
    });
    return Object.fromEntries(
        withKeys.map((key) => [key, data[key]]),
    ) as Partial<T>;
};

/**
 * 选取对象的部分字段并返回一个所选取字段构成的新对象
 */
export const pickObject = <T extends object, K extends Array<keyof T>>(
    data: T,
    keys: K,
) => {
    return Object.fromEntries(keys.map((key) => [key, data[key]])) as Pick<
        T,
        K[number]
    >;
};
