// @ts-nocheck
export function setupAuthorization() {
    window.authorization = {
        getAuthorization: () => {
            return {
                accessToken: window.__tests?.authorization?.accessToken || '00000000-1111-2222-3333-4444444444',
                userAccess: window.__tests?.authorization?.userId || '==UserAccess'
            };
        },
        handleUnauthorizedAccess: () => {
            return new Promise(resolve => setTimeout(resolve, 300));
        }
    };
}
