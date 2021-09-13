
export interface AssinaturaProps {
    situacao: string;
}

export const situacaoDocumento = new Map<string, any>([
    ['ASSINADO', {
        css: 'mdi mdi-file-check tx__green',
        svg: `
            <svg viewBox="0 0 24 24" width="16" height="16">
                <path fill="#54a668" d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M11.2,18.46L15.95,13.71L14.78,12.3L11.2,15.88L9.61,14.3L8.45,15.46L11.2,18.46Z" />
            </svg>
        `,
        descricao: 'Documento assinado'
    }],
    ['PENDENTE_ASSINATURA', {
        css: 'mdi mdi-file-document-edit tx__yellow',
        svg: `
            <svg viewBox="0 0 24 24" width="16" height="16">
                <path fill="#efbc3c" d="M6,2C4.89,2 4,2.89 4,4V20A2,2 0 0,0 6,22H10V20.09L12.09,18H6V16H14.09L16.09,14H6V12H18.09L20,10.09V8L14,2H6M13,3.5L18.5,9H13V3.5M20.15,13C20,13 19.86,13.05 19.75,13.16L18.73,14.18L20.82,16.26L21.84,15.25C22.05,15.03 22.05,14.67 21.84,14.46L20.54,13.16C20.43,13.05 20.29,13 20.15,13M18.14,14.77L12,20.92V23H14.08L20.23,16.85L18.14,14.77Z" />
            </svg>
        `,
        descricao: 'Assinaturas não iniciadas'
    }],
    ['PARCIALMENTE_ASSINADO', {
        css: 'mdi mdi-file-document-edit tx__yellow',
        svg: `
            <svg viewBox="0 0 24 24" width="16" height="16">
                <path fill="#efbc3c" d="M6,2C4.89,2 4,2.89 4,4V20A2,2 0 0,0 6,22H10V20.09L12.09,18H6V16H14.09L16.09,14H6V12H18.09L20,10.09V8L14,2H6M13,3.5L18.5,9H13V3.5M20.15,13C20,13 19.86,13.05 19.75,13.16L18.73,14.18L20.82,16.26L21.84,15.25C22.05,15.03 22.05,14.67 21.84,14.46L20.54,13.16C20.43,13.05 20.29,13 20.15,13M18.14,14.77L12,20.92V23H14.08L20.23,16.85L18.14,14.77Z" />
            </svg>
        `,
        descricao: 'Aguardando assinaturas'
    }],
    ['PROBLEMA_ASSINATURA', {
        css: 'mdi mdi-file-alert tx__red',
        svg: `
            <svg viewBox="0 0 24 24" width="16" height="16">
                <path fill="#d64038" d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2M9 19H7V17H9M9 15H7V9H9M13 9V3.5L18.5 9H13Z" />
            </svg>
        `,
        descricao: 'Problema na assinatura'
    }],
    ['ASSINATURA_RECUSADA', {
        css: 'mdi mdi-file-cancel tx__red',
        svg: `
            <svg viewBox="0 0 24 24" width="16" height="16">
                <path fill="#d64038" d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M10.5,11C8,11 6,13 6,15.5C6,18 8,20 10.5,20C13,20 15,18 15,15.5C15,13 13,11 10.5,11M10.5,12.5A3,3 0 0,1 13.5,15.5C13.5,16.06 13.35,16.58 13.08,17L9,12.92C9.42,12.65 9.94,12.5 10.5,12.5M7.5,15.5C7.5,14.94 7.65,14.42 7.92,14L12,18.08C11.58,18.35 11.06,18.5 10.5,18.5A3,3 0 0,1 7.5,15.5Z" />
            </svg>
        `,
        descricao: 'Assinatura recusada'
    }]
]);
