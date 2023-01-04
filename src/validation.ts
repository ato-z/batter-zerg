import {
    ArgumentMetadata,
    BadRequestException,
    ValidationPipe,
    ValidationPipeOptions,
} from '@nestjs/common';
import { ApiException } from './exceptions';

function queryTransform<T extends object>(query: T) {
    const entries: Array<[string, unknown]> = [];
    for (const key in query) {
        if (!Object.hasOwn(query, key)) continue;
        const val: unknown = query[key];
        entries.push([
            key,
            /^\d+$/.test(val as string) ? +query[key] : query[key],
        ]);
    }
    return Object.fromEntries(entries);
}

export class AppValidationPipe extends ValidationPipe {
    constructor(options?: ValidationPipeOptions) {
        super(options);
    }

    async transform(value: object, metadata: ArgumentMetadata) {
        try {
            const transformData =
                metadata.type === 'query' ? queryTransform(value) : value;
            const result = await super.transform(transformData, metadata);
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
