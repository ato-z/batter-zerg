export class V1BaseCoontroller {
    static readonly baseUrl = 'v1/';

    static toPrefix = (prefix: string) => this.baseUrl + prefix;

    protected toNumberIds(idsString: string) {
        const ids = idsString
            .split(',')
            .filter((id) => +id)
            .map((id) => +id);
        return ids;
    }
}
