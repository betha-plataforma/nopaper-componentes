import { BaseAPI } from '../../global/base-api';
import { AuthorizationConfig } from '../../global/interfaces';
// import { PAYLOAD } from './test/helper/detalhes-assinatura.helper';

export class DetalhesAssinaturaService {

    // @ts-ignore
    private baseApi: BaseAPI;

    constructor(authorization: AuthorizationConfig, assinadorBaseUrl: string) {
        this.baseApi = new BaseAPI(authorization.getAuthorization(), authorization.handleUnauthorizedAccess, assinadorBaseUrl);
    }

    async getByProtocolo(protocolo): Promise<any> {
        return this.baseApi.request('GET', `api/documentos/all?filter=protocolo='${ protocolo }'&offset=0&limit=1`);
        // return Promise.resolve({
        //     ok: true,
        //     protocolo,
        //     json: () => Promise.resolve(PAYLOAD)
        // });
    }

}
