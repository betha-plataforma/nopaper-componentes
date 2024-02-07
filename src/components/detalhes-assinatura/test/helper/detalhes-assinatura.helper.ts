export const PAYLOAD =
{
    content: [{
        id: '0000',
        urlDownloadFront: 'https://plataforma-assinador.test.betha.cloud/assinador/v1/api-front/documentos/0000/download-assinado',
        protocolo: '00000000-1111-2222-3333-4444444444',
        nomeArquivo: 'Lorem Ipsum',
        createdIn: '2021-08-01T15:05:00',
        secoesAssinaturas: [
            {
                assinantes: [{
                    usuario: 'lorem.ipsum',
                    situacaoAssinatura: {value: 'ASSINADO'},
                    dataSituacao: '2021-08-01T15:06:00'
                }]
            },
            {
                assinantes: [{
                    usuario: 'lorem.ipsum',
                    situacaoAssinatura: {value: 'AGUARDANDO_ACEITE'},
                    dataSituacao: '2021-08-01T15:06:00'
                }]
            },
            {
                assinantes: [{
                    usuario: 'lorem.ipsum',
                    situacaoAssinatura: {value: 'PENDENTE'},
                    dataSituacao: '2021-08-01T15:06:00'
                }]
            },
            {
                assinantes: [{
                    usuario: 'lorem.ipsum',
                    situacaoAssinatura: {value: 'AGUARDANDO_DEMAIS_ASSINATURAS'},
                    dataSituacao: '2021-08-01T15:06:00'
                }]
            },
            {
                assinantes: [{
                    usuario: 'lorem.ipsum',
                    situacaoAssinatura: {value: 'ASSINATURA_RECUSADA'},
                    dataSituacao: '2021-08-01T15:06:00'
                }]
            },
            {
                assinantes: [{
                    usuario: 'lorem.ipsum',
                    situacaoAssinatura: {value: 'CANCELADA'},
                    dataSituacao: '2021-08-01T15:06:00'
                }]
            },
            {
                assinantes: [{
                    usuario: 'lorem.ipsum',
                    situacaoAssinatura: {value: 'ERRO'},
                    dataSituacao: '2021-08-01T15:06:00'
                }]
            },
            {
                assinantes: [{
                    usuario: 'lorem.ipsum',
                    situacaoAssinatura: {value: 'ASSINATURA_EM_ANDAMENTO'},
                    dataSituacao: '2021-08-01T15:06:00'
                }]
            }
        ]
    }
    ]
};

export const PAYLOAD_ASSINATURAS_ARQUIVO =
  {
      content: [{
          id: '0000',
          urlDownloadFront: 'https://plataforma-assinador.test.betha.cloud/assinador/v1/api-front/documentos/0000/download-assinado',
          protocolo: '00000000-1111-2222-3333-4444444444',
          nomeArquivo: 'Lorem Ipsum',
          createdIn: '2021-08-01T15:05:00',
          arquivoAssinaturas: [
              {
                  assinante: 'ASSINANTE DOCUMENTO:00000001010101',
                  dataAssinatura: '2024-01-01T15:06:00',
                  hashValido: true,
                  certificadoExpirado: false,
              }
          ],
          secoesAssinaturas: [
              {
                  assinantes: [{
                      usuario: 'lorem.ipsum',
                      situacaoAssinatura: {value: 'ASSINADO'},
                      dataSituacao: '2021-08-01T15:06:00'
                  }]
              }
          ]
      }
      ]
  };

export const PAYLOAD_EMPY =
{
    content: [{
        protocolo: '00000000-1111-2222-3333-4444444444',
        nomeArquivo: 'Lorem Ipsum',
        createdIn: '2021-08-01T15:05:00',
        secoesAssinaturas: []
    }]
};
