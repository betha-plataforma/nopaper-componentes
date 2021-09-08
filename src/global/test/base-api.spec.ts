import { isValidAuthorizationConfig } from '../base-api';
import { getMockAuthorization } from './base-api.helper';

describe('base-api', () => {

    describe('authorization', () => {
        it('deve considerar authorization valido', () => {
            const authorization = getMockAuthorization();
            expect(isValidAuthorizationConfig(authorization)).toBeTruthy();
        });

        it('deve considerar auth config invalida 1', () => {
            expect(isValidAuthorizationConfig(null)).toBeFalsy();
            expect(isValidAuthorizationConfig(undefined)).toBeFalsy();
        });

        it('deve considerar auth config invalida 2', () => {
            const authorization = getMockAuthorization();
            authorization.getAuthorization = null;
            expect(isValidAuthorizationConfig(authorization)).toBeFalsy();
        });

        it('deve considerar auth config invalida 3', () => {
            const authorization = getMockAuthorization();
            authorization.handleUnauthorizedAccess = null;
            expect(isValidAuthorizationConfig(authorization)).toBeFalsy();
        });
    });

});
