# @betha-plataforma/nopaper-componentes

Coleção de Web Components NoPaper.

Compatível com qualquer stack front-end que utilize HTML, CSS e JavaScript.

## Componentes 📦

### Ferramentas

- [nopaper-detalhes-assinatura](http://github.com/betha-plataforma/nopaper-componentes/tree/master/src/components/detalhes-assinatura)
- [nopaper-assinatura](http://github.com/betha-plataforma/nopaper-componentes/tree/master/src/components/assinatura)

## Instalando

### NPM

```
npm install @betha-plataforma/nopaper-componentes
```

### Yarn

```
yarn add @betha-plataforma/nopaper-componentes
```

### CDN (unpkg)

```html
<script type="module" src="https://unpkg.com/@betha-plataforma/nopaper-componentes/dist/nopaper-componentes/nopaper-componentes.esm.js"></script>
<script nomodule src="https://unpkg.com/@betha-plataforma/nopaper-componentes/dist/nopaper-componentes/nopaper-componentes.js"></script>

<!-- ... ou caso queira suportar somente navegadores modernos -->
<script type="module">
  import { defineCustomElements } from 'https://unpkg.com/@betha-plataforma/nopaper-componentes/loader/index.es2017.mjs';
  defineCustomElements();
</script>
```

## Como usar 🔨

### Fonte

O componente utilizará a fonte herdada pelo documento, caso não utilize nenhuma fonte customizada, é possível obter as definições padrões nos arquivos de distribuição ao instalar este projeto. 

```html
<link rel="stylesheet" href="https://unpkg.com/@betha-plataforma/nopaper-componentes/dist/collection/assets/fonts.css">
```

### Estilos

Os componentes NoPaper utilizam o aspecto de encapsulação para os estilos usando _[shadow dom](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM)_, portanto cada elemento irá portar todo o estilo necessário.

### Registrando componentes

*A integração com frameworks frontend, pode exigir algumas configurações específicas.*

Abaixo alguns exemplos de como registrar e utilizar os web components

- [Vanilla JavaScript](http://github.com/betha-plataforma/nopaper-componentes/tree/master/docs/registrando-vanilla.md)
- [Angular](http://github.com/betha-plataforma/nopaper-componentes/tree/master/docs/registrando-angular.md)
- [Vue](http://github.com/betha-plataforma/nopaper-componentes/tree/master/docs/registrando-vue.md)
- [React](http://github.com/betha-plataforma/nopaper-componentes/tree/master/docs/registrando-react.md)

Mais informações sobre [integração com frameworks](https://stenciljs.com/docs/overview) podem ser vistas na documentação oficial do StencilJS

### Configurando componentes

A comunicação com os componentes é feita através de propriedades, atributos, métodos e eventos do DOM, e cada componente tem suas específicações documentadas individualmente, siga o [índice no topo deste documento](#componentes-) ou [navegue através dos diretórios para consultar](http://github.com/betha-plataforma/nopaper-componentes/tree/master/src/components).

## Exemplos

Exemplos podem ser encontrados em [betha-plataforma/exemplos](https://github.com/betha-plataforma/exemplos)

## Compatibilidade 📜

Para entender melhor a abrangência de suporte entre navegadores, [consulte a tabela no site oficial do Stencil](https://stenciljs.com/docs/browser-support).

## Dúvidas

Possíveis dúvidas foram esclarecidas [nesta documentação](http://github.com/betha-plataforma/nopaper-componentes/tree/master/docs/FAQ.md)

## Contribuindo 👥

Contribua para a evolução dos componentes [Como contribuir](http://github.com/betha-plataforma/nopaper-componentes/tree/master/CONTRIBUTING.md).
