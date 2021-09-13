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
                <span class="d-flex" title="Assinaturas não iniciadas. Visualize a lista dos assinantes">
                    <svg viewBox="0 0 24 24" width="16" height="16">
                        <path fill="#efbc3c" d="M6,2C4.89,2 4,2.89 4,4V20A2,2 0 0,0 6,22H10V20.09L12.09,18H6V16H14.09L16.09,14H6V12H18.09L20,10.09V8L14,2H6M13,3.5L18.5,9H13V3.5M20.15,13C20,13 19.86,13.05 19.75,13.16L18.73,14.18L20.82,16.26L21.84,15.25C22.05,15.03 22.05,14.67 21.84,14.46L20.54,13.16C20.43,13.05 20.29,13 20.15,13M18.14,14.77L12,20.92V23H14.08L20.23,16.85L18.14,14.77Z" />
                    </svg>
                </span>
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

        // const iconElement = assinatura.querySelector('i');
        // expect(iconElement.classList.contains('mdi-file-document-edit')).toBeTruthy();
        const svgElement = assinatura.querySelector('svg');
        expect(svgElement.style.display === 'block');
    });

});
