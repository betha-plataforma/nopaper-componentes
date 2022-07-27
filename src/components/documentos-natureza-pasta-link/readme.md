# nopaper-documentos-natureza-pasta-link

### Breve descrição
Componente de link que faz a montagem de URL de navegação para uma pasta ou documento relacionado a uma natureza.

### Composição da URL
```
https://<host_documento>/#/entidade/<hash_contexto>/documentos/sistema/<id_sistema>/natureza/<identificador_natureza>?caminho=<caminho_pasta>&titulo=<titulo_documento>
```

| Variável               |	Descrição|
|------------------------|----|
| host_documento         |	URL para o front do sistema documentos|
| hash_contexto          |	Hash no formato Base64 da composição seguinte composição database:entidade|
| id_sistema             |	Código do sistema da natureza|
| identificador_natureza |	Identificador da natureza|
| caminho_pasta          |	(Opcional) Caminho para a subpasta procurada|
| titulo_documento       |	(Opcional) Titulo do documento desejado|

### Comportamentos da navegação

- Quando informado somente o parâmetro titulo, o sistema realiza a busca deste titulo dentro da pasta configurada para a natureza.
  ```
  https://documentos.test.plataforma.betha.cloud/#/entidade/MTIzNToxMjM1/documentos/sistema/177/natureza/TAREFA?titulo=titulo do documento
  ```
- Quando informado somente o parâmetro caminho, o sistema realiza a busca de subpastas dentro da pasta da natureza, em caso existindo mais de uma subpasta com o mesmo nome, o sistema considera a mais nova. A busca por documentos se vale da mesma logica, onde documentos com títulos iguais retornam o documento mais novo.   
  ```
    https://documentos.test.plataforma.betha.cloud/#/entidade/MTIzNToxMjM1/documentos/sistema/177/natureza/TAREFA?caminho=pasta/subpasta
  ```
- Quando informado os parâmetros titulo e caminho, o sistema o titulo é buscado dentro da subpasta no final do caminho.
  ```
  https://documentos.test.plataforma.betha.cloud/#/entidade/MTIzNToxMjM1/documentos/sistema/177/natureza/TAREFA?caminho=pasta/subpasta&titulo=titulo do documento
  ```
- Quando nenhum parâmetro for informado o acesso é feito na pasta da natureza.
  ```
  https://documentos.test.plataforma.betha.cloud/#/entidade/MTIzNToxMjM1/documentos/sistema/177/natureza/TAREFA
  ```
- Quando a natureza não for encontrada para o sistema informado, o usuário será redirecionado para a raiz do explorador.
- Quando alguma das subpastas do parâmetro caminho não for encontrada, o sistema vai navegar para a ultima pasta encontrada e notificar a situação
- Quando todas as subpastas do parâmetro caminho não forem encontradas, o sistema vai navegar para a pasta da natureza
- Quando nenhum documento com o titulo  definido no parâmetro titulo for encontrado, o sistema vai navegar para a ultima pasta encontrada e notificar a situação.

# O componente:

## Pré condições
O sistema que desejar usar este componente de possuir as seguintes configurações:
- Importar o arquivo env.js para os ambientes de [teste](https://suite.test.bethacloud.com.br/env.js) e [produção](https://suite.cloud.betha.com.br/env.js)
ou configurar a seguinte estrutura de atributos com as urls corretas para os ambiente de Documentos em teste e produção
  ```js
  window['___bth'].envs.suite.documentos['ui/v1'].host = "https://documentos.plataforma.betha.cloud" // host de documento em produção
  ```

<!-- Auto Generated Below -->


## Properties

| Property        | Attribute       | Description                                                                                            | Type     | Default                   |
| --------------- | --------------- | ------------------------------------------------------------------------------------------------------ | -------- | ------------------------- |
| `caminho`       | `caminho`       | Caminho para a subpasta dentro da pasta da natureza <br> Exemplo: `caminho="subpasta/outra sub pasta"` | `string` | `''`                      |
| `cssClass`      | `css-class`     | Classes CSS que devem ser aplicadas diretamente ao link <br> Exemplo: `css-class="Não clique aqui"`    | `string` | `undefined`               |
| `database`      | `database`      | Database para criação da hash de contexto <br> Exemplo: `database="1235"`                              | `number` | `undefined`               |
| `entidade`      | `entidade`      | Entidade para criação da hash de contexto <br> Exemplo: `entidade="1235"`                              | `number` | `undefined`               |
| `identificador` | `identificador` | Identificador da natureza <br> Exemplo: `identificador="TAREFA"`                                       | `string` | `undefined`               |
| `sistema`       | `sistema`       | Codigo do sistema ao qual a natureza pertence <br> Exemplo: `sistema="177"`                            | `number` | `undefined`               |
| `textoLink`     | `texto-link`    | Texto apresentado no link <br> Exemplo: `texto-link="Não clique aqui"`                                 | `string` | `'Acessar em documentos'` |
| `titleLink`     | `title-link`    | Title apresentado no link <br> Exemplo: `title-link="Eu sou o title, você não é o title..."`           | `string` | `'Acessar em documentos'` |
| `titulo`        | `titulo`        | Titulo do documento que deve ser buscado <br> Exemplo: `titulo="titulo qualquer"`                      | `string` | `''`                      |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
