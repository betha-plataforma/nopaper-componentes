import { newSpecPage, SpecPage } from '@stencil/core/testing';

import {
    setBethaEnvs,
    setFetchMockData,
    setupFetchMock,
    setupTestingEnvs
} from '../../../test/utils/spec.helper';
import {
    DocumentosNaturezaPastaLink
} from './documentos-natureza-pasta-link';

describe('nopaper-documentos-natureza-pasta-link', () => {

    let page: SpecPage;

    const ENVJS = {
        suite: {
            'documentos': { 'ui/v1': { host: 'https://documentos.test.plataforma.betha.cloud/' } }
        }
    };

    beforeEach(async () => {
        setBethaEnvs(ENVJS);
        setupTestingEnvs();

        setupFetchMock();
        setFetchMockData({ content: [] });

        page = await newSpecPage({ components: [ DocumentosNaturezaPastaLink ] });
    });

    it('verificar renderização', async () => {
        // Arrange
        await page.setContent('<nopaper-documentos-natureza-pasta-link></nopaper-documentos-natureza-pasta-link>');

        // Act
        await page.waitForChanges();

        // Assert
        expect(page.root).not.toBeNull();
    });

});
