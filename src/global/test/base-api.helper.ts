import { Authorization, AuthorizationConfig } from '../interfaces';

export function getMockAuthorization(): AuthorizationConfig {
    return {
        getAuthorization: (): Authorization => {
            return {
                accessToken: '00000000-1111-2222-3333-4444444444',
                userAccess: '==UserAccess'
            };
        },
        handleUnauthorizedAccess: () => Promise.resolve()
    };
}
