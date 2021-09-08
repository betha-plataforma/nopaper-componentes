import { newE2EPage } from '@stencil/core/testing';

describe('nopaper-detalhes-assinatura', () => {
    it('renders', async () => {
        const page = await newE2EPage();
        await page.setContent('<nopaper-detalhes-assinatura></nopaper-detalhes-assinatura>');
        const element = await page.find('nopaper-detalhes-assinatura');
        expect(element).toHaveClass('hydrated');
    });
});
