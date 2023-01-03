import {
    ArgumentMetadata,
    BadRequestException,
    ValidationPipe,
    ValidationPipeOptions,
} from '@nestjs/common';
import { ApiException } from './exceptions';

export class AppValidationPipe extends ValidationPipe {
    constructor(options?: ValidationPipeOptions) {
        super(options);
    }

    async transform(value: unknown, metadata: ArgumentMetadata) {
        try {
            const result = await super.transform(value, metadata);
            return result;
        } catch (err: unknown) {
            if (err instanceof BadRequestException) {
                const response = err.getResponse() as unknown as
                    | string
                    | { message: string[]; error: string; statusCode: number };
                const message =
                    typeof response === 'string'
                        ? response
                        : response.message[0];
                throw new ApiException(message, 400);
            }
            throw err;
        }
    }
}
