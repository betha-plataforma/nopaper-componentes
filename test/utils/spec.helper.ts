/**
 * Configura uma variável global a ser utilizada para armazenar variáveis mockadas entre cenários de testes
 */
export function setupTestingEnvs() {
  // @ts-ignore
  setGlobalOrWindowProperty(global, '___testing', {});
}

/**
 * Configura um mock para possibilitar interceptar a Web API do "fetch", definindo conteúdo e status de requests.
 *
 * Para obter/definir valores de status e dados da resposta @see setFetchMockStatus e @see setFetchMockData
 */
export function setupFetchMock() {

  // @ts-ignore
  global.___testing.fetch = {};

  const mock = jest.fn().mockImplementation(() => {
    return Promise.resolve({
      status: getFetchMockStatus(),
      ok: getFetchMockStatus() === 200,
      json: () => Promise.resolve(getFetchMockData())
    });
  });

  // @ts-ignore
  setGlobalOrWindowProperty(global, 'fetch', mock);

  return mock;
}

/**
 * Define valor para atributo global/window
 *
 * @param source Fonte global (node.js) ou window (browser)
 * @param propertyName Nome da propriedade
 * @param value Valor
 */
export function setGlobalOrWindowProperty(source: Window, propertyName: any, value: any) {
  Object.defineProperty(source, propertyName, {
    writable: true,
    configurable: true,
    value
  });
}

/**
 * Define o env.js no "window" do contexto atual através da propriedade "___bth"
 * @param envs Objeto do Env.js
 */
export function setBethaEnvs(envs: Object) {
  setGlobalOrWindowProperty(window, '___bth', { envs });
}

/**
 * Define um código de status para o mock do fetch
 * @param status Código do status
 */
export function setFetchMockStatus(status: number) {
  // @ts-ignore
  global.___testing.fetch.status = status;
}

/**
 * Define os dados a serem retornado pelo método "json()" do mock do fetch
 * @param data Dados
 */
export function setFetchMockData(data: any) {
  // @ts-ignore
  global.___testing.fetch.data = data;
}

/**
 * Obtém os dados do mock do fetch
 */
export function getFetchMockData() {
  // @ts-ignore
  return global.___testing?.fetch?.data || { success: true };
}

/**
 * Obtém o status do mock do fetch
 */
export function getFetchMockStatus() {
  // @ts-ignore
  return global.___testing?.fetch?.status || 200;
}
