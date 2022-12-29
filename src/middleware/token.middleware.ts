import { HttpException } from '@nestjs/common';
import { TokenService } from '@src/modules/token.service';
import { type Request, type Response } from 'express';

/**
 * token校验中间件
 */
export default async (req: Request, res: Response, next: () => void) => {
    const { url } = req;
    try {
        if (
            !/^\/v\d+\/staff\/token/i.test(url) &&
            !/^\/v\d+\/staff\/login/i.test(url)
        ) {
            const { token } = req.headers as unknown as { token: string };
            TokenService.tokenMap.get(token);
        }
        next();
    } catch (err) {
        if (err instanceof HttpException) {
            res.statusCode = err.getStatus();
            res.send(err.getResponse());
        } else {
            res.statusCode = 500;
            res.send({
                message: '网络异常~',
            });
        }
    }
};
