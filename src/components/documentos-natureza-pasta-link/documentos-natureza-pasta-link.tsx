import {Component, h, Prop, State, Watch} from '@stencil/core';

@Component({
    tag: 'nopaper-documentos-natureza-pasta-link',
    styleUrl: '',
})
export class DocumentosNaturezaPastaLink {

    /**
     * TODO: renan.silvano - documentar
     */
    @Prop() readonly propriedades: Propriedades;

    @State() navegacao: Navegacao;

    @Watch('propriedades')
    watchNatureza(propriedades: Propriedades) {
        this.navegacao = propriedades.navegacao;
    }

    protected render(): any {
        return (
            <a onClick={this.acessarPastaNatureza}> Acessar em documentos</a>
        );
    }

    private acessarPastaNatureza = () => {
        const natureza = this.navegacao.natureza;
        const hashContexto = btoa(`${natureza.database}:${natureza.entidade}`);

        const link =
            `${DocumentosNaturezaPastaLink.getHost()}/#/entidade/${hashContexto}/documentos/sistema/${natureza.sistema}/natureza/${natureza.identificador}?caminho=${this.navegacao.caminho}&titulo=${this.navegacao.titulo}`;

        window.open(link, '_blank');
    };

    private static getHost() {
        if ('___bth' in window) {
            return window['___bth'].envs.suite.documentos['ui/v1'].host;
        }
        throw '___bth deve estar definido'; // TODO: renan.silvano - melhorar
    }
}

export interface Propriedades {
    navegacao: Navegacao;
}

export interface Navegacao {
    natureza: Natureza,
    caminho?: string
    titulo?: string,
}

export interface Natureza {
    entidade: number,
    database: number,
    sistema: number,
    identificador: string
}