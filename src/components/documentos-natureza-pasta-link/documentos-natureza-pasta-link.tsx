import {Component, h, Prop, State, Watch} from '@stencil/core';

@Component({
    tag: 'nopaper-documentos-natureza-pasta-link',
    styleUrl: './documentos-natureza-pasta-link.scss',
})
export class DocumentosNaturezaPastaLink {
    /**
     * Codigo do sistema ao qual a natureza pertence
     * <br> Exemplo: `sistema="177"`
     */
    @Prop() readonly sistema: number;
    /**
     * Identificador da natureza
     * <br> Exemplo: `identificador="TAREFA"`
     */
    @Prop() readonly identificador: string;
    /**
     * Caminho para a subpasta dentro da pasta da natureza
     * <br> Exemplo: `caminho="subpasta/outra sub pasta"`
     */
    @Prop() readonly caminho: string = '';
    /**
     * Titulo do documento que deve ser buscado
     * <br> Exemplo: `titulo="titulo qualquer"`
     */
    @Prop() readonly titulo: string = '';
    /**
     * Entidade para criação da hash de contexto
     * <br> Exemplo: `entidade="1235"`
     */
    @Prop() readonly entidade: number;
    /**
     * Database para criação da hash de contexto
     * <br> Exemplo: `database="1235"`
     */
    @Prop() readonly database: number;
    /**
     * Texto apresentado no link
     * <br> Exemplo: `texto-link="Não clique aqui"`
     */
    @Prop() readonly textoLink: string = 'Acessar em documentos';
    /**
     * Title apresentado no link
     * <br> Exemplo: `title-link="Eu sou o title, você não é o title..."`
     */
    @Prop() readonly titleLink: string = 'Acessar em documentos';
    /**
     * Classes CSS que devem ser aplicadas diretamente ao link
     * <br> Exemplo: `css-class="Não clique aqui"`
     */
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
    watchTextoLink(textoLink: string) {
        this.caracteristicasVisuais.textoLink = textoLink;
    }

    @Watch('titleLink')
    watchTitleLink(titleLink: string) {
        this.caracteristicasVisuais.titleLink = titleLink;
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
        this.watchTitleLink(this.titleLink);
        this.watchCssClass(this.cssClass);
    }

    protected render(): any {
        return (
            <a onClick={this.acessar} class={this.caracteristicasVisuais.cssClass} title={this.caracteristicasVisuais.titleLink}> {this.caracteristicasVisuais.textoLink}
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
        throw '___bth deve estar definido em window';
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
    titleLink?: string;
    cssClass?: string;
}