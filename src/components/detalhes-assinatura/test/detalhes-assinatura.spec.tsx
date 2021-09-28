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
import { PAYLOAD, PAYLOAD_EMPY } from './helper/detalhes-assinatura.helper';

describe('nopaper-detalhes-assinatura', () => {

    let page: SpecPage;

    const ENVJS = {
        suite: {
            'assinador': { v1: { host: 'https://plataforma-assinador.test.betha.cloud/assinador/v1' } },
            'usuarios': { v1: { host: 'https://plataforma-usuarios.test.betha.cloud/usuarios/v0.1' } }
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
            .toMatch('01/08/2021às 15:06:00');
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

});
