export class V1BaseCoontroller {
    static readonly baseUrl = 'v1/';

    static toPrefix = (prefix: string) => this.baseUrl + prefix;
}
