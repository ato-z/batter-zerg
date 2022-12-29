import { HttpException, HttpStatus } from '@nestjs/common';

export class ApiException extends HttpException {
    constructor(message: string, status = 400, errorCode = 1000) {
        super(
            {
                message,
                errorCode,
            },
            status,
        );
    }
}

export class ApiNotFoundException extends ApiException {
    constructor(message: string) {
        super(message, HttpStatus.NOT_FOUND, 1001);
    }
}

export class SignMissException extends ApiException {
    constructor(message = '非法sign') {
        super(message, HttpStatus.FORBIDDEN, 2001);
    }
}

export class TokenMissException extends ApiException {
    constructor(message = '非法token') {
        super(message, HttpStatus.FORBIDDEN, 2002);
    }
}
