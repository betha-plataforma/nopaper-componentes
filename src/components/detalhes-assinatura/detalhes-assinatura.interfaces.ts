import { AuthorizationConfig } from '../../global/interfaces';


export interface DetalhesAssinaturaProps {
    protocolo: string;
    authorization: AuthorizationConfig;
    assinaturaBaseUrl: string;
    usuariosBaseUrl: string;
    accessToken: string;
    userAccess: string;
    invalidProtocoloMessage: string;
}

export const situacaoAssinatura = new Map<string, any>([
    ['ASSINADO', {
        css: 'badge d-block badge-success',
        descricao: 'Assinatura realizada'
    }],
    ['AGUARDANDO_ACEITE', {
        css: 'badge d-block badge-warning',
        descricao: 'Aguardando assinante'
    }],
    ['PENDENTE', {
        css: 'badge d-block badge-warning',
        descricao: 'Aguardando assinante'
    }],
    ['AGUARDANDO_DEMAIS_ASSINATURAS', {
        css: 'badge d-block badge-secondary',
        descricao: 'Em fila de espera'
    }],
    ['ASSINATURA_RECUSADA', {
        css: 'badge d-block badge-danger',
        descricao: 'Assinatura recusada'
    }],
    ['CANCELADA', {
        css: 'badge d-block ',
        descricao: 'Processo cancelado'
    }],
    ['ERRO', {
        css: '',
        descricao: 'Erro na assinatura'
    }],
    ['ASSINATURA_EM_ANDAMENTO', {
        css: 'badge d-block ',
        descricao: 'Assinatura em andamento'
    }],
    ['EXPIRADA', {
        css: 'badge d-block badge-danger',
        descricao: 'Assinatura expirada'
    }]
]);
