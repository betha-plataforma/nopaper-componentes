import { newE2EPage } from '@stencil/core/testing';

describe('nopaper-assinatura', () => {
    it('renders', async () => {
        const page = await newE2EPage();
        await page.setContent('<nopaper-assinatura></nopaper-assinatura>');
        const element = await page.find('nopaper-assinatura');
        expect(element).toHaveClass('hydrated');
    });
});
