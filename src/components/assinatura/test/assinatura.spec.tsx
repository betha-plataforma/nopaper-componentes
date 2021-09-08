import { newSpecPage, SpecPage } from '@stencil/core/testing';

import { Assinatura } from '../assinatura';

describe('nopaper-assinatura', () => {

    let page: SpecPage;

    beforeEach(async () => {
        page = await newSpecPage({ components: [ Assinatura ] });
    });

    it('renderiza light dom', async () => {
        // Arrange
        await page.setContent('<nopaper-assinatura></nopaper-assinatura>');

        // Act
        const icone: HTMLNopaperAssinaturaElement = page.doc.querySelector('nopaper-assinatura');
        icone.setAttribute('situacao', 'PENDENTE_ASSINATURA');
        await page.waitForChanges();

        // Assert
        expect(page.root).toEqualLightHtml(`
            <nopaper-assinatura situacao="PENDENTE_ASSINATURA">
                <div class="nopaper-assinatura">
                    <button class="btn btn-link">
                        <i class="mdi mdi-file-document-edit tx__yellow"></i>
                    </button>
                </div>
            </nopaper-assinatura>
        `);
    });

    it('renderiza status assinatura', async () => {
        // Arrange
        await page.setContent('<nopaper-assinatura></nopaper-assinatura>');

        // Act
        const assinatura: HTMLNopaperAssinaturaElement = page.doc.querySelector('nopaper-assinatura');
        assinatura.setAttribute('situacao', 'PENDENTE_ASSINATURA');
        await page.waitForChanges();

        // Assert
        expect(assinatura.situacao).toBe('PENDENTE_ASSINATURA');

        const iconElement = assinatura.querySelector('i');
        expect(iconElement.classList.contains('mdi-file-document-edit')).toBeTruthy();
    });

});
