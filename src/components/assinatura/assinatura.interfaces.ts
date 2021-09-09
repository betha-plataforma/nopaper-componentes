
export interface AssinaturaProps {
    situacao: string;
}

export const situacaoDocumento = new Map<string, any>([
    ['ASSINADO', {
        css: 'mdi mdi-file-check tx__green',
        descricao: 'Documento assinado'
    }],
    ['PENDENTE_ASSINATURA', {
        css: 'mdi mdi-file-document-edit tx__yellow',
        descricao: 'Assinaturas não iniciadas'
    }],
    ['PARCIALMENTE_ASSINADO', {
        css: 'mdi mdi-file-document-edit tx__yellow',
        descricao: 'Aguardando assinaturas'
    }],
    ['PROBLEMA_ASSINATURA', {
        css: 'mdi mdi-file-alert tx__red',
        descricao: 'Problema na assinatura'
    }],
    ['ASSINATURA_RECUSADA', {
        css: 'mdi mdi-file-cancel tx__red',
        descricao: 'Assinatura recusada'
    }]
]);
