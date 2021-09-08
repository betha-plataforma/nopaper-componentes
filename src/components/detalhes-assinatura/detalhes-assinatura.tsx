import {h, Component, Prop, State, Watch} from '@stencil/core';

import { isValidAuthorizationConfig } from '../../global/base-api';
import { AuthorizationConfig } from '../../global/interfaces';
import { formatDate, isNill } from '../../utils/utils';
import {
    DetalhesAssinaturaProps,
    situacaoAssinatura
} from './detalhes-assinatura.interfaces';
import { DetalhesAssinaturaService }  from './detalhes-assinatura.service';

@Component({
    tag: 'nopaper-detalhes-assinatura',
    styleUrl: 'detalhes-assinatura.scss',
    shadow: false
})
export class DetalhesAssinatura implements DetalhesAssinaturaProps {

    private assinaturaService: DetalhesAssinaturaService;

    @State() loading = false;
    @State() error = false;
    @State() unavailable = false;
    @State() invalid = false;
    @State() documento: any;

    /**
     *
     */
    @Prop() readonly protocolo: string;
    /**
     *
     */
    @Prop() readonly authorization: AuthorizationConfig;
    /**
     *
     */
    @Prop() readonly assinaturaBaseUrl?: string;
    /**
     *
     */
    @Prop() readonly usuariosBaseUrl?: string;

    @Watch('authorization')
    watchAuthorization() {
        console.warn('watchAuthorization');
        this.fetch();
    }

    connectedCallback() {
        console.warn('connectedCallback');
        this.fetch();
    }

    // protected componentWillLoad() {
    //     console.warn('componentWillLoad');
    //     this.fetch();
    // }

    protected render(): any {
        return (
            <div class="d-flex justify-content-center align-items-center nopaper-detalhes-assinatura">
                { this.loading && (
                    this.getSpinner()
                )}
                { (this.invalid && !this.loading) && (
                    this.getInvalid()
                )}
                { (this.unavailable && !this.loading) && (
                    this.getUnavailable()
                )}
                { (this.error && !this.loading) && (
                    this.getError()
                )}
                { ((!this.loading && !this.documento) && (!this.unavailable && !this.error && !this.invalid)) && (
                    this.getNotFoundDocumento()
                )}
                { (this.documento) && (
                    <div class="container-fluid">
                        { this.getHeaderDocumento() }
                        { this.getLinkDocumento() }
                        { (!this.documento.assinantes || this.documento.assinantes && this.documento.assinantes.length === 0) && (
                            this.getEmptyAssinantes()
                        )}
                        { (this.documento.assinantes && this.documento.assinantes.length > 0) && (
                            this.getTableSecoesAssinaturas(this.documento.assinantes)
                        )}
                    </div>
                )}
            </div>
        );
    }

    private fetch() {
        if (this.isAssinaturaServiceConfigMismatch()) {
            console.warn('[nopaper-detalhes-assinatura] O endereço do serviço de assinaturas deve ser informado. Consulte a documentação do componente.');
            this.unavailable = true;
            return;
        }
        if (this.isUsuariosConfigMismatch()) {
            console.warn('[nopaper-detalhes-assinatura] O endereço do serviço de usuários deve ser informado. Consulte a documentação do componente.');
            this.unavailable = true;
            return;
        }
        if (this.isAuthorizationConfigMismatch()) {
            console.warn('[nopaper-detalhes-assinatura] As credenciais de autenticação devem ser informadas. Consulte a documentação do componente.');
            this.unavailable = true;
            return;
        }
        const uuidRegExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
        if (this.protocolo === undefined || !uuidRegExp.test(this.protocolo)) {
            console.warn('[nopaper-detalhes-assinatura] Protocolo de assinatura inválido');
            this.invalid = true;
            return;
        }
        this.unavailable = false;
        this.loading = true;
        this.assinaturaService = new DetalhesAssinaturaService(this.authorization, this.getAssinaturaBaseUrl());
        this.assinaturaService.getByProtocolo(this.protocolo)
            .then(response => response.ok ? this.onResponse(response) : this.onError())
            .catch(() => this.onFailed());
    }

    private isAssinaturaServiceConfigMismatch() {
        return isNill(this.getAssinaturaBaseUrl());

    }

    private isUsuariosConfigMismatch() {
        return isNill(this.getUsuariosBaseUrl());


    }

    private isAuthorizationConfigMismatch() {
        return !isValidAuthorizationConfig(this.authorization);
    }

    private getAssinaturaBaseUrl(): string {
        if (!isNill(this.assinaturaBaseUrl)) {
            return this.assinaturaBaseUrl;
        }
        if ('___bth' in window) {
            return window['___bth'].envs.suite.assinador.v1.host;
        }
        return null;
    }

    private getUsuariosBaseUrl(): string {
        if (!isNill(this.usuariosBaseUrl)) {
            return this.usuariosBaseUrl;
        }
        if ('___bth' in window) {
            return window['___bth'].envs.suite.usuarios.v1.host;
        }
        return null;
    }


    private onSuccess(pageDocumento) {
        this.documento = pageDocumento.content[0] !== undefined
            ? this.transformaDocumento(pageDocumento.content[0])
            : undefined;
        this.loading = false;
    }

    private onResponse(response) {
        this.error = false;
        this.unavailable = false;
        response.json().then(pageDocumento => this.onSuccess(pageDocumento));
    }

    private onError() {
        this.error = true;
        this.loading = false;
    }

    private onFailed() {
        this.unavailable = true;
        this.loading = false;
    }

    private getAvatarUrlAssinante(idUsuario: string) {
        return `${ this.getUsuariosBaseUrl() }/api/usuarios/${ idUsuario }/photo?access_token=${ this.authorization.getAuthorization().accessToken }`;
    }

    private getDownloadUrlDocumento(url) {
        return `${ url }?access_token=${ this.authorization.getAuthorization().accessToken }&disableDownload=true`;
    }

    private transformaAssinante(assinante) {
        return {
            id: assinante.usuario,
            nome: assinante.usuarioInfo?.name || assinante.usuario,
            avatarUrl: this.getAvatarUrlAssinante(assinante.usuario),
            situacaoAssinatura: assinante.situacaoAssinatura.value,
            dataAssinatura: formatDate(assinante.dataSituacao)
        };
    }

    private transformaDocumento(documento) {
        return {
            nome: documento.nomeArquivo,
            criadoEm: formatDate(documento.createdIn),
            assinantes: documento.secoesAssinaturas && documento.secoesAssinaturas.length
                ? documento.secoesAssinaturas.map(secaoAssinatura => this.transformaAssinante(secaoAssinatura.assinantes[0]))
                : [],
            downloadUrl: this.getDownloadUrlDocumento(documento.urlDownloadFront)
        };
    }

    private getSpinner() {
        return (
            <div class="spinner-grow-backdrop">
                <div class="spinner-grow"></div>
            </div>
        );
    }

    private getNotFoundDocumento() {
        return (<span>Não foi encontrado documento para o protocolo <span class="text-nowrap">{ this.protocolo }</span>.</span>);
    }

    private getInvalid() {
        return (<span>Protocolo de assinatura inválido</span>);
    }

    private getUnavailable() {
        return (<span>O serviço de assinaturas está temporariamente indisponível</span>);
    }

    private getError() {
        return (<span>Ocorreu um erro ao processar a requisição</span>);
    }

    private getEmptyAssinantes() {
        return (
            <div class="row">
                <div class="col">
                    <span>Não existem seções de assinatura</span>
                </div>
            </div>
        );
    }

    private getHeaderDocumento() {
        return (
            <div class="row">
                <div class="col">
                    <h6 class="mb-0">Lista de assinantes</h6>
                    <small class="text-muted">Enviado em { this.documento.criadoEm }</small>
                </div>
            </div>
        );
    }

    private getLinkDocumento() {
        return (
            <div class="row">
                <div class="col">
                    <div class="card border-0 bg-secondary mb-2 mt-2">
                        <div class="card-body">
                            <a href={ this.documento.downloadUrl } target="_blank">
                                <i class="mdi mdi-file-document-outline mr-1"></i>
                                { this.documento.nome }
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private getTableSecoesAssinaturas(assinantes) {
        return (
            <div class="row">
                <div class="col">
                    <div class={ assinantes.length > 3 ? 'scroll-list' : '' }>
                        <table class="table table-hover table-card table-responsive">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th><span>Assinante</span></th>
                                    <th><span>Situação</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                { assinantes.map((assinante, index) => this.getRowAssinante(assinante, index))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    private getRowAssinante(assinante, index) {
        return (
            <tr>
                <td><span class="text-nowrap"><b>{ index + 1 }º</b></span></td>
                <td>
                    <div class="d-flex align-items-center">
                        <img class="rounded-circle" src={ assinante.avatarUrl } alt={'Foto de ' + assinante.nome } />
                        <span class="text-truncate ml-2">{ assinante.nome }</span>
                    </div>
                </td>
                <td>
                    { (assinante.situacaoAssinatura !== 'ERRO') ? (
                        <span class={ situacaoAssinatura.get(assinante.situacaoAssinatura).css } title={'Assinado ' + assinante.dataAssinatura }>
                            { situacaoAssinatura.get(assinante.situacaoAssinatura).descricao }
                        </span>
                    ) : (
                        <span class="text-danger">
                            <i class="mdi mdi-alert mr-1"></i>
                            { situacaoAssinatura.get(assinante.situacaoAssinatura).descricao }
                        </span>
                    )}
                </td>
            </tr>
        );
    }

}
