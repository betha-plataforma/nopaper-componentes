import {Component, h, Prop, State, Watch} from '@stencil/core';

@Component({
    tag: 'nopaper-documentos-natureza-pasta-link',
    styleUrl: './documentos-natureza-pasta-link.scss',
})
export class DocumentosNaturezaPastaLink {

    /**
     * TODO: renan.silvano - documentar
     */
    @Prop() readonly sistema: number;
    /**
     * TODO: renan.silvano - documentar
     */
    @Prop() readonly identificador: string;
    /**
     * TODO: renan.silvano - documentar
     */
    @Prop() readonly caminho: string = '';
    /**
     * TODO: renan.silvano - documentar
     */
    @Prop() readonly titulo: string = '';
    /**
     * TODO: renan.silvano - documentar
     */
    @Prop() readonly entidade: number;
    /**
     * TODO: renan.silvano - documentar
     */
    @Prop() readonly database: number;

    @Prop() readonly textoLink: string;

    @Prop() readonly cssClass: string;

    @State() navegacao = {} as Navegacao;
    @State() contexto = {} as Contexto;
    @State() caracteristicasVisuais = {} as CaracteristicasVisuais;

    private acessar = this.acessarPastaNatureza.bind(this);

    @Watch('sistema')
    watchSistema(sistema: number) {
        this.navegacao.sistema = sistema;
    }

    @Watch('identificador')
    watchIdentificador(identificador) {
        this.navegacao.identificador = identificador;
    }

    @Watch('caminho')
    watchCaminho(caminho) {
        this.navegacao.caminho = caminho;
    }

    @Watch('titulo')
    watchTitulo(titulo) {
        this.navegacao.titulo = titulo;
    }

    @Watch('entidade')
    watchEntidade(entidade) {
        this.contexto.entidade = entidade;
    }

    @Watch('database')
    watchDatabase(database) {
        this.contexto.database = database;
    }

    @Watch('textoLink')
    watchTextoLink(textoLink: string = 'Acessar em documentos') {
        this.caracteristicasVisuais.textoLink = textoLink;
    }

    @Watch('cssClass')
    watchCssClass(cssClass: string) {
        this.caracteristicasVisuais.cssClass = cssClass;
    }

    componentWillLoad() {
        this.watchSistema(this.sistema);
        this.watchIdentificador(this.identificador);
        this.watchCaminho(this.caminho);
        this.watchTitulo(this.titulo);
        this.watchEntidade(this.entidade);
        this.watchDatabase(this.database);
        this.watchTextoLink(this.textoLink);
        this.watchCssClass(this.cssClass);
    }

    protected render(): any {
        return (
            <a onClick={this.acessar} class={this.caracteristicasVisuais.cssClass}> {this.caracteristicasVisuais.textoLink}
            </a>
        );
    }

    private acessarPastaNatureza(): void {
        const hashContexto = btoa(`${this.contexto.database}:${this.contexto.entidade}`);

        const link =
            `${DocumentosNaturezaPastaLink.getHost()}/#/entidade/${hashContexto}/documentos/sistema/${this.navegacao.sistema}/natureza/${this.navegacao.identificador}?caminho=${this.navegacao.caminho}&titulo=${this.navegacao.titulo}`;

        window.open(link, '_blank');
    }

    private static getHost() {
        if ('___bth' in window) {
            return window['___bth'].envs.suite.documentos['ui/v1'].host;
        }
        throw '___bth deve estar definido'; // TODO: renan.silvano - melhorar
    }
}

export interface Navegacao {
    sistema: number,
    identificador: string
    caminho?: string
    titulo?: string,
}

export interface Contexto {
    entidade: number,
    database: number,
}

export interface CaracteristicasVisuais {
    textoLink?: string;
    cssClass?: string;
}