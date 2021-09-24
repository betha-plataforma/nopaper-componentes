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
import { PAYLOAD } from './helper/detalhes-assinatura.helper';

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
        expect(detalhesAssinaturaElement.shadowRoot.textContent).toMatch(/O serviço de assinaturas está temporariamente indisponível/);
    });

    it('exibe texto de indisponibilidade caso ocorra erro na requisição', async () => {
        // Arrange
        await page.setContent('<nopaper-detalhes-assinatura></nopaper-detalhes-assinatura>');
        const detalhesAssinaturaElement: HTMLNopaperDetalhesAssinaturaElement = page.body.querySelector('nopaper-detalhes-assinatura');

        // Act
        setFetchMockStatus(500);
        setFetchMockData({ detail: { message: 'Erro interno no servidor' } });

        // A troca de authorization serve como gatilho para buscar novamente os registros
        detalhesAssinaturaElement.authorization = getMockAuthorization();

        await page.waitForChanges();

        // Assert
        expect(detalhesAssinaturaElement.authorization).toBeDefined();
        expect(detalhesAssinaturaElement.shadowRoot.textContent).toMatch(/O serviço de assinaturas está temporariamente indisponível/);
    });

    it('nao exibe texto de indisponibilidade caso authorization e endereco da api estiverem informados', async () => {
        // Arrange
        setFetchMockData(PAYLOAD);

        // Act
        await page.setContent(`
            <nopaper-detalhes-assinatura protocolo="67931ef5-da63-477f-8d92-fd671c3447c0"
                                         assinatura-base-url="https://assinaturas.com"
                                         usuarios-base-url="https://usuarios.com">
            </nopaper-detalhes-assinatura>
        `);

        let detalhesAssinaturaElement: HTMLNopaperDetalhesAssinaturaElement = page.body.querySelector('nopaper-detalhes-assinatura');
        detalhesAssinaturaElement.authorization = getMockAuthorization();
        await page.waitForChanges();

        // Assert
        detalhesAssinaturaElement = page.body.querySelector('nopaper-detalhes-assinatura');
        expect(detalhesAssinaturaElement.authorization).toBeDefined();
        expect(detalhesAssinaturaElement.assinaturaBaseUrl).toBeDefined();
        expect(detalhesAssinaturaElement.usuariosBaseUrl).toBeDefined();
        expect(detalhesAssinaturaElement.shadowRoot.textContent).not.toMatch(/O serviço de assinaturas está temporariamente indisponível/);
    });

    it('exibe texto de assinatura não encontrada para o protocolo', async () => {
        // Act
        await page.setContent(`
            <nopaper-detalhes-assinatura protocolo="67931ef5-da63-477f-8d92-fd671c3447c0">
            </nopaper-detalhes-assinatura>
        `);
        const detalhesAssinaturaElement: HTMLNopaperDetalhesAssinaturaElement = page.body.querySelector('nopaper-detalhes-assinatura');

        detalhesAssinaturaElement.authorization = getMockAuthorization();
        await page.waitForChanges();

        // Assert
        expect(detalhesAssinaturaElement.authorization).toBeDefined();
        expect(detalhesAssinaturaElement.shadowRoot.textContent).toMatch(/Não foi encontrado documento para o protocolo/);
    });

    it('exibe texto de protocolo inválido', async () => {
        // Act
        await page.setContent(`
            <nopaper-detalhes-assinatura protocolo="">
            </nopaper-detalhes-assinatura>
        `);
        const detalhesAssinaturaElement: HTMLNopaperDetalhesAssinaturaElement = page.body.querySelector('nopaper-detalhes-assinatura');

        detalhesAssinaturaElement.authorization = getMockAuthorization();
        await page.waitForChanges();

        // Assert
        expect(detalhesAssinaturaElement.authorization).toBeDefined();
        expect(detalhesAssinaturaElement.shadowRoot.textContent).toMatch(/Protocolo de assinatura inválido/);
    });

});
