import { newSpecPage, SpecPage } from '@stencil/core/testing';

import {
    setBethaEnvs,
    setFetchMockData,
    setFetchMockStatus,
    setupFetchMock,
    setupTestingEnvs
} from '../../../../test/utils/spec.helper';
import { getMockAuthorization } from '../../../global/test/base-api.helper';
import { DetalhesAssinatura } from '../detalhes-assinatura';
import { PAYLOAD, PAYLOAD_ASSINATURAS_ARQUIVO, PAYLOAD_EMPY } from './helper/detalhes-assinatura.helper';

describe('nopaper-detalhes-assinatura', () => {

    let page: SpecPage;

    const ENVJS = {
        suite: {
            'assinador': { v1: { host: 'https://plataforma-assinador.test.betha.cloud/assinador/v1' } },
            'usuarios': { v1: { host: 'https://plataforma-usuarios.test.betha.cloud/usuarios/v0.1' } },
            'assinador-ui': { ferramenta: { host: 'https://assinador.test.plataforma.betha.cloud' } }
        }
    };

    beforeEach(async () => {
        setBethaEnvs(ENVJS);
        setupTestingEnvs();

        setupFetchMock();
        setFetchMockData({ content: [] });

        page = await newSpecPage({ components: [ DetalhesAssinatura ] });
    });

    it('renderiza lightdom', async () => {
        // Arrange
        await page.setContent('<nopaper-detalhes-assinatura></nopaper-detalhes-assinatura>');

        // Act
        await page.waitForChanges();

        // Assert
        expect(page.root).not.toBeNull();
    });

    it('exibe texto de indisponibilidade se authorization não for informado', async () => {
        // Act
        await page.setContent('<nopaper-detalhes-assinatura></nopaper-detalhes-assinatura>');

        // Assert
        const detalhesAssinaturaElement: HTMLNopaperDetalhesAssinaturaElement = page.body.querySelector('nopaper-detalhes-assinatura');
        expect(detalhesAssinaturaElement.authorization).toBeUndefined();
        expect(detalhesAssinaturaElement.shadowRoot.textContent).toMatch(/O serviço de assinaturas está temporariamente indisponível/);
    });

    it('exibe texto de indisponibilidade se endereco da api não for informado', async () => {
        // Act
        await page.setContent('<nopaper-detalhes-assinatura></nopaper-detalhes-assinatura>');

        // Assert
        const detalhesAssinaturaElement: HTMLNopaperDetalhesAssinaturaElement = page.body.querySelector('nopaper-detalhes-assinatura');
        expect(detalhesAssinaturaElement.assinaturaBaseUrl).toBeUndefined();
        expect(detalhesAssinaturaElement.usuariosBaseUrl).toBeUndefined();
        expect(detalhesAssinaturaElement.shadowRoot.textContent).toMatch(/O serviço de assinaturas está temporariamente indisponívelQuando o serviço for restabelecido, a sua aplicação voltará a funcionar normalmente/);
    });

    it('exibe texto de indisponibilidade caso ocorra erro na requisição', async () => {
        // Arrange
        await page.setContent('<nopaper-detalhes-assinatura></nopaper-detalhes-assinatura>');
        const detalhesAssinaturaElement: HTMLNopaperDetalhesAssinaturaElement = page.body.querySelector('nopaper-detalhes-assinatura');

        // Act
        setFetchMockStatus(500);
        setFetchMockData({ detail: { message: 'Erro interno no servidor' } });

        detalhesAssinaturaElement.authorization = getMockAuthorization();
        // A troca de protocolo serve como gatilho para buscar novamente os registros
        detalhesAssinaturaElement.protocolo = '67931ef5-da63-477f-8d92-fd671c3447c0';

        await page.waitForChanges();

        // Assert
        expect(detalhesAssinaturaElement.authorization).toBeDefined();
        expect(detalhesAssinaturaElement.shadowRoot.textContent).toMatch(/O serviço de assinaturas está temporariamente indisponível/);
    });

    it('nao exibe texto de indisponibilidade caso authorization e endereco da api estiverem informados', async () => {
        // Arrange
        setFetchMockData(PAYLOAD);

        // Act
        await page.setContent('<nopaper-detalhes-assinatura></nopaper-detalhes-assinatura>');

        let detalhesAssinaturaElement: HTMLNopaperDetalhesAssinaturaElement = page.body.querySelector('nopaper-detalhes-assinatura');
        detalhesAssinaturaElement.authorization = getMockAuthorization();
        detalhesAssinaturaElement.protocolo = '67931ef5-da63-477f-8d92-fd671c3447c0';
        await page.waitForChanges();

        // Assert
        detalhesAssinaturaElement = page.body.querySelector('nopaper-detalhes-assinatura');
        expect(detalhesAssinaturaElement.authorization).toBeDefined();
        expect(detalhesAssinaturaElement.shadowRoot.textContent).not.toMatch(/O serviço de assinaturas está temporariamente indisponívelO serviço de assinaturas está temporariamente indisponívelQuando o serviço for restabelecido, a sua aplicação voltará a funcionar normalmente/);
    });

    it('exibe texto de assinatura não encontrada para o protocolo', async () => {
        // Act
        await page.setContent('<nopaper-detalhes-assinatura></nopaper-detalhes-assinatura>');
        const detalhesAssinaturaElement: HTMLNopaperDetalhesAssinaturaElement = page.body.querySelector('nopaper-detalhes-assinatura');

        detalhesAssinaturaElement.authorization = getMockAuthorization();
        detalhesAssinaturaElement.protocolo = '67931ef5-da63-477f-8d92-fd671c3447c0';
        await page.waitForChanges();

        // Assert
        expect(detalhesAssinaturaElement.authorization).toBeDefined();
        expect(detalhesAssinaturaElement.shadowRoot.textContent).toMatch(/Não foi encontrado documento para o protocolo/);
    });

    it('exibe texto de protocolo inválido', async () => {
        // Act
        await page.setContent('<nopaper-detalhes-assinatura></nopaper-detalhes-assinatura>');
        const detalhesAssinaturaElement: HTMLNopaperDetalhesAssinaturaElement = page.body.querySelector('nopaper-detalhes-assinatura');

        detalhesAssinaturaElement.authorization = getMockAuthorization();
        detalhesAssinaturaElement.protocolo = 'uuidv4';
        await page.waitForChanges();

        // Assert
        expect(detalhesAssinaturaElement.authorization).toBeDefined();
        expect(detalhesAssinaturaElement.protocolo).toBeDefined();
        expect(detalhesAssinaturaElement.shadowRoot.textContent).toMatch(/Protocolo de assinatura inválido/);
    });

    it('fallback para authorization config', async () => {
        // Act
        await page.setContent(`
            <nopaper-detalhes-assinatura 
                access-token="${getMockAuthorization().getAuthorization().accessToken}" 
                user-access="${getMockAuthorization().getAuthorization().userAccess}"
                protocolo="67931ef5-da63-477f-8d92-fd671c3447c0">
            </nopaper-detalhes-assinatura>`);
        const detalhesAssinaturaElement: HTMLNopaperDetalhesAssinaturaElement = page.body.querySelector('nopaper-detalhes-assinatura');

        // Assert
        expect(detalhesAssinaturaElement.accessToken).toBeDefined();
        expect(detalhesAssinaturaElement.userAccess).toBeDefined();
        expect(detalhesAssinaturaElement.protocolo).toBeDefined();
        expect(detalhesAssinaturaElement.shadowRoot.textContent).toMatch(/Não foi encontrado documento para o protocolo 67931ef5-da63-477f-8d92-fd671c3447c0./);
    });

    it('exibe seções de assinatura', async () => {
        // Arrange
        setFetchMockData(PAYLOAD);

        // Act
        await page.setContent('<nopaper-detalhes-assinatura></nopaper-detalhes-assinatura>');

        let detalhesAssinaturaElement: HTMLNopaperDetalhesAssinaturaElement = page.body.querySelector('nopaper-detalhes-assinatura');
        detalhesAssinaturaElement.authorization = getMockAuthorization();
        detalhesAssinaturaElement.protocolo = '67931ef5-da63-477f-8d92-fd671c3447c0';
        await page.waitForChanges();

        // Assert
        detalhesAssinaturaElement = page.body.querySelector('nopaper-detalhes-assinatura');
        expect(detalhesAssinaturaElement.shadowRoot.querySelector('small').textContent)
            .toMatch('Enviado em 01/08/2021 às 15:05');
        expect(detalhesAssinaturaElement.shadowRoot.querySelector('a').textContent)
            .toMatch('Lorem Ipsum');
        expect(detalhesAssinaturaElement.shadowRoot.querySelector('table tr td:nth-child(2)').textContent)
            .toMatch('lorem.ipsum');
        expect(detalhesAssinaturaElement.shadowRoot.querySelector('table tr td:nth-child(3)').textContent)
            .toEqualText('01/08/2021 às 15:06:00');
        expect(detalhesAssinaturaElement.shadowRoot.querySelector('table tr td:nth-child(4)').textContent)
            .toMatch('Assinatura realizada');
    });

    it('exibe mensagem de seções de assinatura vazia', async () => {
        // Arrange
        setFetchMockData(PAYLOAD_EMPY);

        // Act
        await page.setContent('<nopaper-detalhes-assinatura></nopaper-detalhes-assinatura>');

        let detalhesAssinaturaElement: HTMLNopaperDetalhesAssinaturaElement = page.body.querySelector('nopaper-detalhes-assinatura');
        detalhesAssinaturaElement.authorization = getMockAuthorization();
        detalhesAssinaturaElement.protocolo = '67931ef5-da63-477f-8d92-fd671c3447c0';
        await page.waitForChanges();

        // Assert
        detalhesAssinaturaElement = page.body.querySelector('nopaper-detalhes-assinatura');
        expect(detalhesAssinaturaElement.shadowRoot.querySelector('.row:nth-child(3)').textContent)
            .toMatch('Não existem seções de assinatura');
    });

    it('exibe link para o documento', async () => {
        // Arrange
        setFetchMockData(PAYLOAD);

        // Act
        await page.setContent('<nopaper-detalhes-assinatura></nopaper-detalhes-assinatura>');

        let detalhesAssinaturaElement: HTMLNopaperDetalhesAssinaturaElement = page.body.querySelector('nopaper-detalhes-assinatura');
        detalhesAssinaturaElement.authorization = getMockAuthorization();
        detalhesAssinaturaElement.protocolo = '67931ef5-da63-477f-8d92-fd671c3447c0';
        await page.waitForChanges();

        // Assert
        expect(detalhesAssinaturaElement.shadowRoot.querySelector('a').href)
            .toEqualText('https://plataforma-assinador.test.betha.cloud/assinador/v1/api-front/documentos/0000/download-assinado?access_token=00000000-1111-2222-3333-4444444444');
    });

    it('exibe link para o assinador', async () => {
        // Arrange
        setFetchMockData(PAYLOAD);

        // Act
        await page.setContent('<nopaper-detalhes-assinatura></nopaper-detalhes-assinatura>');

        let detalhesAssinaturaElement: HTMLNopaperDetalhesAssinaturaElement = page.body.querySelector('nopaper-detalhes-assinatura');
        detalhesAssinaturaElement.linkAssinador = true;
        detalhesAssinaturaElement.exibirLinkPara = 'lorem.ipsum';
        detalhesAssinaturaElement.authorization = getMockAuthorization();
        detalhesAssinaturaElement.protocolo = '67931ef5-da63-477f-8d92-fd671c3447c0';
        await page.waitForChanges();

        // Assert
        expect(detalhesAssinaturaElement.shadowRoot.querySelector('a').href)
            .toEqualText('https://assinador.test.plataforma.betha.cloud/#/informacoes/documento/0000');
    });

    it('Deve mostrar bloco com assinaturas do arquivo abaixo do nome com link para o assinador', async () => {
        // Arrange
        setFetchMockData(PAYLOAD_ASSINATURAS_ARQUIVO);

        //Act
        await page.setContent('<nopaper-detalhes-assinatura></nopaper-detalhes-assinatura>');

        let detalhesAssinaturaElement: HTMLNopaperDetalhesAssinaturaElement = page.body.querySelector('nopaper-detalhes-assinatura');
        detalhesAssinaturaElement.linkAssinador = true;
        detalhesAssinaturaElement.exibirLinkPara = 'lorem.ipsum';
        detalhesAssinaturaElement.authorization = getMockAuthorization();
        detalhesAssinaturaElement.protocolo = '67931ef5-da63-477f-8d92-fd671c3447c0';
        await page.waitForChanges();

        // Assert
        expect(detalhesAssinaturaElement.shadowRoot.querySelector('a').href)
          .toEqualText('https://assinador.test.plataforma.betha.cloud/#/informacoes/documento/0000');


        let arquivoAssinaturas = detalhesAssinaturaElement.shadowRoot.getElementById('arquivoAssinaturasSectionId');
        expect(arquivoAssinaturas).toBeTruthy()
        expect(arquivoAssinaturas.textContent).toContain('ASSINANTE DOCUMENTO:00000001010101');
    });

    it('Deve mostrar bloco com assinaturas do arquivo abaixo do nome com link para o documento', async () => {
        // Arrange
        setFetchMockData(PAYLOAD_ASSINATURAS_ARQUIVO);

        //Act
        await page.setContent('<nopaper-detalhes-assinatura></nopaper-detalhes-assinatura>');

        let detalhesAssinaturaElement: HTMLNopaperDetalhesAssinaturaElement = page.body.querySelector('nopaper-detalhes-assinatura');
        detalhesAssinaturaElement.linkAssinador = false;
        detalhesAssinaturaElement.exibirLinkPara = 'lorem.ipsum';
        detalhesAssinaturaElement.authorization = getMockAuthorization();
        detalhesAssinaturaElement.protocolo = '67931ef5-da63-477f-8d92-fd671c3447c0';
        await page.waitForChanges();

        // Assert
        expect(detalhesAssinaturaElement.shadowRoot.querySelector('a').href)
          .toEqualText('https://plataforma-assinador.test.betha.cloud/assinador/v1/api-front/documentos/0000/download-assinado?access_token=00000000-1111-2222-3333-4444444444');


        let arquivoAssinaturas = detalhesAssinaturaElement.shadowRoot.getElementById('arquivoAssinaturasSectionId');
        expect(arquivoAssinaturas).toBeTruthy()
        expect(arquivoAssinaturas.textContent).toContain('ASSINANTE DOCUMENTO:00000001010101');
    });

    it('copia link para o assinador para a área de transferência', async () => {
        // Arrange
        setFetchMockData(PAYLOAD);
        Object.assign(navigator, {
            clipboard: {
                writeText: jest.fn(),
            },
        });

        // Act
        await page.setContent('<nopaper-detalhes-assinatura></nopaper-detalhes-assinatura>');

        let detalhesAssinaturaElement: HTMLNopaperDetalhesAssinaturaElement = page.body.querySelector('nopaper-detalhes-assinatura');
        detalhesAssinaturaElement.linkAssinador = true;
        detalhesAssinaturaElement.authorization = getMockAuthorization();
        detalhesAssinaturaElement.protocolo = '67931ef5-da63-477f-8d92-fd671c3447c0';
        await page.waitForChanges();

        // Assert
        const copyButton = detalhesAssinaturaElement.shadowRoot.querySelector('div.link-documento__copy-button div') as HTMLButtonElement;
        await copyButton.click();
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://assinador.test.plataforma.betha.cloud/#/informacoes/documento/0000');
    });

    it('variante atalhos exibe o card de download e os atalhos "Abrir no Assinador" e "Copiar link"; não-PDF não tem tag', async () => {
        // Arrange
        setFetchMockData(PAYLOAD);

        await page.setContent('<nopaper-detalhes-assinatura></nopaper-detalhes-assinatura>');
        let detalhesAssinaturaElement: HTMLNopaperDetalhesAssinaturaElement = page.body.querySelector('nopaper-detalhes-assinatura');
        detalhesAssinaturaElement.linkAssinador = true;
        detalhesAssinaturaElement.varianteLinkAssinador = 'atalhos';
        detalhesAssinaturaElement.exibirLinkPara = 'lorem.ipsum';
        detalhesAssinaturaElement.authorization = getMockAuthorization();
        detalhesAssinaturaElement.protocolo = '67931ef5-da63-477f-8d92-fd671c3447c0';
        await page.waitForChanges();

        // Assert
        detalhesAssinaturaElement = page.body.querySelector('nopaper-detalhes-assinatura');
        const texto = detalhesAssinaturaElement.shadowRoot.textContent;
        expect(texto).toMatch('Detalhes do processo de assinatura');
        expect(texto).toMatch('Abrir no Assinador');
        expect(texto).toMatch('Copiar link');
        expect(detalhesAssinaturaElement.shadowRoot.querySelector('.link-assinador-atalhos a').getAttribute('href'))
            .toEqualText('https://assinador.test.plataforma.betha.cloud/#/informacoes/documento/0000');
        const linkDocumento = detalhesAssinaturaElement.shadowRoot.querySelector('.card a');
        expect(linkDocumento.textContent).toMatch('Lorem Ipsum');
        // Documento sem tipo (não-PDF): mantém o urlDownloadFront e não exibe tag
        expect(linkDocumento.getAttribute('href'))
            .toEqualText('https://plataforma-assinador.test.betha.cloud/assinador/v1/api-front/documentos/0000/download-assinado?access_token=00000000-1111-2222-3333-4444444444');
        expect(detalhesAssinaturaElement.shadowRoot.querySelector('.tag-tipo-download')).toBeNull();
    });

    it('PDF assinado: link do arquivo baixa o documento assinado e exibe a tag "Assinado"', async () => {
        // Arrange — backend manda copia-impressao para assinado+PDF; o componente troca para download-assinado
        const PAYLOAD_PDF_ASSINADO = JSON.parse(JSON.stringify(PAYLOAD));
        PAYLOAD_PDF_ASSINADO.content[0].tipo = 'PDF';
        PAYLOAD_PDF_ASSINADO.content[0].situacao = { value: 'ASSINADO' };
        PAYLOAD_PDF_ASSINADO.content[0].urlDownloadFront =
            'https://plataforma-assinador.test.betha.cloud/assinador/v1/api-front/documentos/0000/download-copia-impressao';
        setFetchMockData(PAYLOAD_PDF_ASSINADO);

        await page.setContent('<nopaper-detalhes-assinatura></nopaper-detalhes-assinatura>');
        const detalhesAssinaturaElement: HTMLNopaperDetalhesAssinaturaElement = page.body.querySelector('nopaper-detalhes-assinatura');
        detalhesAssinaturaElement.linkAssinador = true;
        detalhesAssinaturaElement.varianteLinkAssinador = 'atalhos';
        detalhesAssinaturaElement.exibirLinkPara = 'lorem.ipsum';
        detalhesAssinaturaElement.authorization = getMockAuthorization();
        detalhesAssinaturaElement.protocolo = '67931ef5-da63-477f-8d92-fd671c3447c0';
        await page.waitForChanges();

        // Assert
        expect(detalhesAssinaturaElement.shadowRoot.querySelector('.tag-tipo-download').textContent)
            .toEqualText('Assinado');
        expect(detalhesAssinaturaElement.shadowRoot.querySelector('.card a').getAttribute('href'))
            .toEqualText('https://plataforma-assinador.test.betha.cloud/assinador/v1/api-front/documentos/0000/download-assinado?access_token=00000000-1111-2222-3333-4444444444&disableDownload=true');
    });

    it('PDF não assinado: link do arquivo baixa a cópia de impressão e exibe a tag "Cópia para impressão"', async () => {
        // Arrange — backend manda download-assinado enquanto não assinado; o componente troca para copia-impressao
        const PAYLOAD_PDF_EM_ANDAMENTO = JSON.parse(JSON.stringify(PAYLOAD));
        PAYLOAD_PDF_EM_ANDAMENTO.content[0].tipo = 'PDF';
        PAYLOAD_PDF_EM_ANDAMENTO.content[0].situacao = { value: 'AGUARDANDO_ACEITE' };
        setFetchMockData(PAYLOAD_PDF_EM_ANDAMENTO);

        await page.setContent('<nopaper-detalhes-assinatura></nopaper-detalhes-assinatura>');
        const detalhesAssinaturaElement: HTMLNopaperDetalhesAssinaturaElement = page.body.querySelector('nopaper-detalhes-assinatura');
        detalhesAssinaturaElement.linkAssinador = true;
        detalhesAssinaturaElement.varianteLinkAssinador = 'atalhos';
        detalhesAssinaturaElement.exibirLinkPara = 'lorem.ipsum';
        detalhesAssinaturaElement.authorization = getMockAuthorization();
        detalhesAssinaturaElement.protocolo = '67931ef5-da63-477f-8d92-fd671c3447c0';
        await page.waitForChanges();

        // Assert
        expect(detalhesAssinaturaElement.shadowRoot.querySelector('.tag-tipo-download').textContent)
            .toEqualText('Cópia para impressão');
        expect(detalhesAssinaturaElement.shadowRoot.querySelector('.card a').getAttribute('href'))
            .toEqualText('https://plataforma-assinador.test.betha.cloud/assinador/v1/api-front/documentos/0000/download-copia-impressao?access_token=00000000-1111-2222-3333-4444444444&disableDownload=true');
    });

    it('variante atalhos copia o link para o Assinador ao clicar em "Copiar link"', async () => {
        // Arrange
        setFetchMockData(PAYLOAD);
        Object.assign(navigator, {
            clipboard: {
                writeText: jest.fn(),
            },
        });

        await page.setContent('<nopaper-detalhes-assinatura></nopaper-detalhes-assinatura>');
        const detalhesAssinaturaElement: HTMLNopaperDetalhesAssinaturaElement = page.body.querySelector('nopaper-detalhes-assinatura');
        detalhesAssinaturaElement.linkAssinador = true;
        detalhesAssinaturaElement.varianteLinkAssinador = 'atalhos';
        detalhesAssinaturaElement.exibirLinkPara = 'lorem.ipsum';
        detalhesAssinaturaElement.authorization = getMockAuthorization();
        detalhesAssinaturaElement.protocolo = '67931ef5-da63-477f-8d92-fd671c3447c0';
        await page.waitForChanges();

        // Act
        const copyButton = detalhesAssinaturaElement.shadowRoot
            .querySelector('.link-assinador-atalhos button') as HTMLButtonElement;
        await copyButton.click();

        // Assert
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://assinador.test.plataforma.betha.cloud/#/informacoes/documento/0000');
    });

    it('variante atalhos NÃO exibe os atalhos para quem não é participante, mas mantém o card de download', async () => {
        // Arrange
        setFetchMockData(PAYLOAD);

        await page.setContent('<nopaper-detalhes-assinatura></nopaper-detalhes-assinatura>');
        const detalhesAssinaturaElement: HTMLNopaperDetalhesAssinaturaElement = page.body.querySelector('nopaper-detalhes-assinatura');
        detalhesAssinaturaElement.linkAssinador = true;
        detalhesAssinaturaElement.varianteLinkAssinador = 'atalhos';
        detalhesAssinaturaElement.exibirLinkPara = 'outro.usuario';
        detalhesAssinaturaElement.authorization = getMockAuthorization();
        detalhesAssinaturaElement.protocolo = '67931ef5-da63-477f-8d92-fd671c3447c0';
        await page.waitForChanges();

        // Assert
        expect(detalhesAssinaturaElement.shadowRoot.querySelector('.link-assinador-atalhos')).toBeNull();
        expect(detalhesAssinaturaElement.shadowRoot.querySelector('.card a').textContent).toMatch('Lorem Ipsum');
    });

    it('variante atalhos exibe as assinaturas do arquivo uma única vez', async () => {
        // Arrange
        setFetchMockData(PAYLOAD_ASSINATURAS_ARQUIVO);

        await page.setContent('<nopaper-detalhes-assinatura></nopaper-detalhes-assinatura>');
        const detalhesAssinaturaElement: HTMLNopaperDetalhesAssinaturaElement = page.body.querySelector('nopaper-detalhes-assinatura');
        detalhesAssinaturaElement.linkAssinador = true;
        detalhesAssinaturaElement.varianteLinkAssinador = 'atalhos';
        detalhesAssinaturaElement.exibirLinkPara = 'lorem.ipsum';
        detalhesAssinaturaElement.authorization = getMockAuthorization();
        detalhesAssinaturaElement.protocolo = '67931ef5-da63-477f-8d92-fd671c3447c0';
        await page.waitForChanges();

        // Assert
        const assinaturasArquivo = detalhesAssinaturaElement.shadowRoot.querySelectorAll('#arquivoAssinaturasSectionId');
        expect(assinaturasArquivo.length).toBe(1);
        expect(assinaturasArquivo[0].textContent).toContain('ASSINANTE DOCUMENTO:00000001010101');
    });

    it('variante default (arquivo) preserva "Lista de assinantes" e o card do nome do arquivo', async () => {
        // Arrange
        setFetchMockData(PAYLOAD);

        await page.setContent('<nopaper-detalhes-assinatura></nopaper-detalhes-assinatura>');
        const detalhesAssinaturaElement: HTMLNopaperDetalhesAssinaturaElement = page.body.querySelector('nopaper-detalhes-assinatura');
        detalhesAssinaturaElement.linkAssinador = true;
        detalhesAssinaturaElement.exibirLinkPara = 'lorem.ipsum';
        detalhesAssinaturaElement.authorization = getMockAuthorization();
        detalhesAssinaturaElement.protocolo = '67931ef5-da63-477f-8d92-fd671c3447c0';
        await page.waitForChanges();

        // Assert
        expect(detalhesAssinaturaElement.shadowRoot.textContent).toMatch('Lista de assinantes');
        expect(detalhesAssinaturaElement.shadowRoot.querySelector('.link-assinador-atalhos')).toBeNull();
        expect(detalhesAssinaturaElement.shadowRoot.querySelector('a').textContent).toMatch('Lorem Ipsum');
    });

});
