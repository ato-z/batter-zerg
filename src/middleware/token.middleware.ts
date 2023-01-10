import { HttpException } from '@nestjs/common';
import { TokenService } from '@src/modules/token.service';
import { type Request, type Response } from 'express';

/**
 * token校验中间件
 */
export class TokenMiddleawre {
    constructor(private readonly tokenService: TokenService) {}

    use(req: Request, res: Response, next: () => void) {
        try {
            const { token } = req.headers as unknown as { token: string };
            this.tokenService.tokenMap.get(token);
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
    }
}
