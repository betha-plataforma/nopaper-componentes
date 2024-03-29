/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { AuthorizationConfig } from "./global/interfaces";
export namespace Components {
    interface NopaperAssinatura {
        "situacao": string;
    }
    interface NopaperDetalhesAssinatura {
        "accessToken": string;
        "assinaturaBaseUrl": string;
        "authorization": AuthorizationConfig;
        "exibirLinkPara": string;
        "frontAssinadorBaseUrl": string;
        "invalidProtocoloMessage": string;
        "linkAssinador": boolean;
        "protocolo": string;
        "refresh": () => Promise<void>;
        "userAccess": string;
        "usuariosBaseUrl": string;
    }
    interface NopaperDocumentosNaturezaPastaLink {
        /**
          * Caminho para a subpasta dentro da pasta da natureza <br> Exemplo: `caminho="subpasta/outra sub pasta"`
         */
        "caminho": string;
        /**
          * Classes CSS que devem ser aplicadas diretamente ao link <br> Exemplo: `css-class="Não clique aqui"`
         */
        "cssClass": string;
        /**
          * Database para criação da hash de contexto <br> Exemplo: `database="1235"`
         */
        "database": number;
        /**
          * Entidade para criação da hash de contexto <br> Exemplo: `entidade="1235"`
         */
        "entidade": number;
        /**
          * Identificador da natureza <br> Exemplo: `identificador="TAREFA"`
         */
        "identificador": string;
        /**
          * Codigo do sistema ao qual a natureza pertence <br> Exemplo: `sistema="177"`
         */
        "sistema": number;
        /**
          * Texto apresentado no link <br> Exemplo: `texto-link="Não clique aqui"`
         */
        "textoLink": string;
        /**
          * Title apresentado no link <br> Exemplo: `title-link="Eu sou o title, você não é o title..."`
         */
        "titleLink": string;
        /**
          * Titulo do documento que deve ser buscado <br> Exemplo: `titulo="titulo qualquer"`
         */
        "titulo": string;
    }
}
export interface NopaperDetalhesAssinaturaCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLNopaperDetalhesAssinaturaElement;
}
declare global {
    interface HTMLNopaperAssinaturaElement extends Components.NopaperAssinatura, HTMLStencilElement {
    }
    var HTMLNopaperAssinaturaElement: {
        prototype: HTMLNopaperAssinaturaElement;
        new (): HTMLNopaperAssinaturaElement;
    };
    interface HTMLNopaperDetalhesAssinaturaElement extends Components.NopaperDetalhesAssinatura, HTMLStencilElement {
    }
    var HTMLNopaperDetalhesAssinaturaElement: {
        prototype: HTMLNopaperDetalhesAssinaturaElement;
        new (): HTMLNopaperDetalhesAssinaturaElement;
    };
    interface HTMLNopaperDocumentosNaturezaPastaLinkElement extends Components.NopaperDocumentosNaturezaPastaLink, HTMLStencilElement {
    }
    var HTMLNopaperDocumentosNaturezaPastaLinkElement: {
        prototype: HTMLNopaperDocumentosNaturezaPastaLinkElement;
        new (): HTMLNopaperDocumentosNaturezaPastaLinkElement;
    };
    interface HTMLElementTagNameMap {
        "nopaper-assinatura": HTMLNopaperAssinaturaElement;
        "nopaper-detalhes-assinatura": HTMLNopaperDetalhesAssinaturaElement;
        "nopaper-documentos-natureza-pasta-link": HTMLNopaperDocumentosNaturezaPastaLinkElement;
    }
}
declare namespace LocalJSX {
    interface NopaperAssinatura {
        "situacao"?: string;
    }
    interface NopaperDetalhesAssinatura {
        "accessToken"?: string;
        "assinaturaBaseUrl"?: string;
        "authorization"?: AuthorizationConfig;
        "exibirLinkPara"?: string;
        "frontAssinadorBaseUrl"?: string;
        "invalidProtocoloMessage"?: string;
        "linkAssinador"?: boolean;
        "onLinkCopied"?: (event: NopaperDetalhesAssinaturaCustomEvent<string>) => void;
        "protocolo"?: string;
        "userAccess"?: string;
        "usuariosBaseUrl"?: string;
    }
    interface NopaperDocumentosNaturezaPastaLink {
        /**
          * Caminho para a subpasta dentro da pasta da natureza <br> Exemplo: `caminho="subpasta/outra sub pasta"`
         */
        "caminho"?: string;
        /**
          * Classes CSS que devem ser aplicadas diretamente ao link <br> Exemplo: `css-class="Não clique aqui"`
         */
        "cssClass"?: string;
        /**
          * Database para criação da hash de contexto <br> Exemplo: `database="1235"`
         */
        "database"?: number;
        /**
          * Entidade para criação da hash de contexto <br> Exemplo: `entidade="1235"`
         */
        "entidade"?: number;
        /**
          * Identificador da natureza <br> Exemplo: `identificador="TAREFA"`
         */
        "identificador"?: string;
        /**
          * Codigo do sistema ao qual a natureza pertence <br> Exemplo: `sistema="177"`
         */
        "sistema"?: number;
        /**
          * Texto apresentado no link <br> Exemplo: `texto-link="Não clique aqui"`
         */
        "textoLink"?: string;
        /**
          * Title apresentado no link <br> Exemplo: `title-link="Eu sou o title, você não é o title..."`
         */
        "titleLink"?: string;
        /**
          * Titulo do documento que deve ser buscado <br> Exemplo: `titulo="titulo qualquer"`
         */
        "titulo"?: string;
    }
    interface IntrinsicElements {
        "nopaper-assinatura": NopaperAssinatura;
        "nopaper-detalhes-assinatura": NopaperDetalhesAssinatura;
        "nopaper-documentos-natureza-pasta-link": NopaperDocumentosNaturezaPastaLink;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "nopaper-assinatura": LocalJSX.NopaperAssinatura & JSXBase.HTMLAttributes<HTMLNopaperAssinaturaElement>;
            "nopaper-detalhes-assinatura": LocalJSX.NopaperDetalhesAssinatura & JSXBase.HTMLAttributes<HTMLNopaperDetalhesAssinaturaElement>;
            "nopaper-documentos-natureza-pasta-link": LocalJSX.NopaperDocumentosNaturezaPastaLink & JSXBase.HTMLAttributes<HTMLNopaperDocumentosNaturezaPastaLinkElement>;
        }
    }
}
