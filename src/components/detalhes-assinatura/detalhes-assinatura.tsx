import { Component, Event, EventEmitter, h, Method, Prop, State, Watch } from '@stencil/core';

import { isValidAuthorizationConfig } from '../../global/base-api';
import { Authorization, AuthorizationConfig } from '../../global/interfaces';
import { formatDate, formatDateHtml, isNill } from '../../utils/utils';
import {
    DetalhesAssinaturaProps,
    situacaoAssinatura
} from './detalhes-assinatura.interfaces';
import { DetalhesAssinaturaService } from './detalhes-assinatura.service';

@Component({
    tag: 'nopaper-detalhes-assinatura',
    styleUrl: 'detalhes-assinatura.scss',
    shadow: true
})
export class DetalhesAssinatura implements DetalhesAssinaturaProps {

    private assinaturaService: DetalhesAssinaturaService;

    /**
     *
     */
    @Event() linkCopied: EventEmitter<string>;

    @State() loading = false;
    @State() unavailable = false;
    @State() invalid = false;
    @State() documento: any;
    @State() _linkCopied = false;

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
    @Prop() readonly assinaturaBaseUrl: string;
    /**
     *
     */
    @Prop() readonly usuariosBaseUrl: string;
    /**
     *
     */
    @Prop() readonly accessToken: string;
    /**
     *
     */
    @Prop() readonly userAccess: string;
    /**
     *
     */
    @Prop() readonly invalidProtocoloMessage: string;
    /**
     *
     */
    @Prop() readonly linkAssinador: boolean;
    /**
     *
     */
    @Prop() readonly exibirLinkPara: string;
    /**
     *
     */
    @Prop() readonly frontAssinadorBaseUrl: string;

    private _protocolo: string;
    private _authorization: AuthorizationConfig;
    private _accessToken: string;
    private _userAccess: string;
    private _fetch = this.fetch.bind(this);
    private _copyLink = this.copyLink.bind(this);

    @Watch('protocolo')
    watchProtocolo(protocolo: string) {
        this._protocolo = protocolo;
        this.fetch();
    }

    @Watch('authorization')
    watchAuthorization(authorization: AuthorizationConfig) {
        this._authorization = authorization;
    }

    @Watch('accessToken')
    watchAccessToken(accessToken: string) {
        this._accessToken = accessToken;
        this.buildAuthorization();
    }

    @Watch('userAccess')
    watchUserAccess(userAccess: string) {
        this._userAccess = userAccess;
        this.buildAuthorization();
    }

    /**
     *
     */
    @Method()
    async refresh() {
        return this.fetch();
    }

    componentWillLoad() {
        this.watchAuthorization(this.authorization);
        this.watchAccessToken(this.accessToken);
        this.watchUserAccess(this.userAccess);
        this.watchProtocolo(this.protocolo);
    }


    protected render(): any {
        return (
            <div class="h-100 d-flex justify-content-center nopaper-detalhes-assinatura">
                { this.loading && (
                    this.getSpinner()
                )}
                { (this.invalid && (!this.loading && !this.unavailable)) && (
                    this.getInvalid()
                )}
                { (this.unavailable && !this.loading) && (
                    this.getUnavailable()
                )}
                { ((!this.loading && !this.documento) && (!this.unavailable && !this.invalid)) && (
                    this.getNotFoundDocumento()
                )}
                { (this.documento) && (
                    <div class={ this.linkAssinador ? 'container-fluid container-fluid--compacto' : 'container-fluid' }>
                        { this.getHeaderDocumento() }
                        { this.getLinkDocumento() }
                        { (!this.documento.assinantes || this.documento.assinantes && this.documento.assinantes.length === 0) && (
                            this.getEmptyAssinantes()
                        )}
                        { (this.documento.assinantes && this.documento.assinantes.length > 0) && (
                            this.getTableSecoesAssinaturas(this.documento.assinantes, this.documento.arquivoAssinaturas)
                        )}
                    </div>
                )}
            </div>
        );
    }

    private fetch(): void {
        this.invalid = false;
        this.unavailable = false;
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
        if (this.isProtocoloInvalido()) {
            console.warn('[nopaper-detalhes-assinatura] Protocolo de assinatura inválido');
            this.invalid = true;
            return;
        }
        if (this.isFrontAssinadorConfigMismatch()) {
            console.warn('[nopaper-detalhes-assinatura] O endereço do Assinador deve ser informado. Consulte a documentação do componente.');
            this.invalid = true;
            return;
        }
        this.loading = true;
        this.assinaturaService = new DetalhesAssinaturaService(this._authorization, this.getAssinaturaBaseUrl());
        this.assinaturaService.getByProtocolo(this._protocolo)
            .then(response => response.ok ? this.onResponse(response) : this.onError())
            .catch(() => this.onFailed());
    }

    private isAssinaturaServiceConfigMismatch() {
        return isNill(this.getAssinaturaBaseUrl());

    }

    private isUsuariosConfigMismatch() {
        return isNill(this.getUsuariosBaseUrl());
    }

    private isFrontAssinadorConfigMismatch() {
        if (!this.linkAssinador) {
            return false;
        }
        return isNill(this.getFrontAssinadorBaseUrl());
    }

    private isAuthorizationConfigMismatch() {
        return !isValidAuthorizationConfig(this._authorization);
    }

    private buildAuthorization() {
        if (!isNill(this._accessToken) && !isNill(this._userAccess)) {
            const authorization = {
                accessToken: this._accessToken,
                userAccess: this._userAccess
            };
            this._authorization = {
                getAuthorization(): Authorization {
                    return authorization;
                },
                handleUnauthorizedAccess(): Promise<void> {
                    return Promise.resolve();
                }
            };
        }
    }

    private isProtocoloInvalido() {
        return isNill(this._protocolo)
            || ! /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi
                .test(this._protocolo);
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

    private getFrontAssinadorBaseUrl(): string {
        if (!isNill(this.frontAssinadorBaseUrl)) {
            return this.frontAssinadorBaseUrl;
        }
        if ('___bth' in window) {
            return window['___bth'].envs.suite['assinador-ui'].ferramenta.host;
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
        this.unavailable = false;
        response.json().then(pageDocumento => this.onSuccess(pageDocumento));
    }

    private onError() {
        this.unavailable = true;
        this.loading = false;
    }

    private onFailed() {
        this.unavailable = true;
        this.loading = false;
    }

    private getAvatarUrlAssinante(idUsuario: string) {
        return `${ this.getUsuariosBaseUrl() }/api/usuarios/${ idUsuario }/photo?access_token=${ this._authorization.getAuthorization().accessToken }`;
    }

    private getDownloadUrlDocumento(url, disableDownload) {
        return `${ url }?access_token=${ this._authorization.getAuthorization().accessToken }${ disableDownload ? '&disableDownload=true' : '' }`;
    }

    private transformaAssinante(assinante) {
        return {
            id: assinante.usuario,
            nome: assinante.usuarioInfo?.name || assinante.usuario,
            avatarUrl: this.getAvatarUrlAssinante(assinante.usuario),
            situacaoAssinatura: assinante.situacaoAssinatura.value,
            dataAssinatura: assinante.dataSituacao ? formatDateHtml(assinante.dataSituacao) : undefined
        };
    }

    private transformaDocumento(documento) {
        return {
            id: documento.id,
            nome: documento.nomeArquivo,
            tipo: documento.tipo,
            situacao: this.getSituacaoDocumento(documento),
            criadoEm: formatDate(documento.createdIn),
            arquivoAssinaturas: documento.arquivoAssinaturas,
            assinantes: documento.secoesAssinaturas && documento.secoesAssinaturas.length
                ? documento.secoesAssinaturas
                    .flatMap(secaoAssinatura => secaoAssinatura.assinantes
                        .map(assinante => this.transformaAssinante(assinante)))
                : [],
            downloadUrl: this.linkAssinador
                ? this.getLinkDocumentoAssinador(documento.id)
                : this.getDownloadUrlDocumento(documento.urlDownloadFront, documento.tipo === 'PDF'),
            arquivoUrl: this.getDownloadUrlDocumento(documento.urlDownloadFront, documento.tipo === 'PDF'),
            arquivoAssinadoUrl: this.getUrlArquivoAssinado(documento)
        };
    }

    private isDocumentoPdf(documento): boolean {
        return documento.tipo === 'PDF';
    }

    private isDocumentoAssinado(documento): boolean {
        return this.getSituacaoDocumento(documento) === 'ASSINADO';
    }

    private getUrlArquivoAssinado(documento): string | undefined {
        if (isNill(documento.urlDownloadFront) || !this.isDocumentoPdf(documento) || !this.isDocumentoAssinado(documento)) {
            return undefined;
        }
        return this.getDownloadUrlDocumento(`${ this.getBaseUrlArquivo(documento) }/download-assinado`, true);
    }

    private getBaseUrlArquivo(documento): string {
        return documento.urlDownloadFront.substring(0, documento.urlDownloadFront.lastIndexOf('/'));
    }

    private getSituacaoDocumento(documento): string | undefined {
        const situacao = documento && documento.situacao;
        if (isNill(situacao)) {
            return undefined;
        }
        return typeof situacao === 'string' ? situacao : situacao.value;
    }

    private async copyLink() {
        try {
            await navigator.clipboard.writeText(this.documento.downloadUrl);
        } catch (err) {
            console.error('Failed to copy', err);
        }
        this.linkCopied.emit(this.documento.downloadUrl);
        this._linkCopied = true;
        setTimeout(() => this._linkCopied = false, 800);
    }

    private isUserInAssinantes(): boolean {
        return this.documento.assinantes.find(assinante => assinante.id === this.exibirLinkPara);
    }

    private getLinkDocumentoAssinador(id) {
        return `${this.getFrontAssinadorBaseUrl()}/#/informacoes/documento/${id}`;
    }

    private getSpinner() {
        return (
            <div class="spinner-grow-backdrop">
                <div class="spinner-grow"></div>
            </div>
        );
    }

    private getNotFoundDocumento() {
        return (
            <div class="invalid d-flex flex-column justify-content-center align-items-center text-center">
                <span>Não foi encontrado documento para o protocolo <span class="text-nowrap">{ this._protocolo }</span>.</span>
            </div>
        );
    }

    private getInvalid() {
        return (
            <div class="invalid d-flex flex-column justify-content-center align-items-center text-center">
                <div class="mb-2">
                    {/*<img src="../../assets/images/invalid.svg" alt="Invalid"/>*/}
                    <svg xmlns="http://www.w3.org/2000/svg" width="94" height="119" viewBox="0 0 94 119">
                        <defs>
                            <clipPath id="clip-ilustração-processamento">
                                <rect width="94" height="119"/>
                            </clipPath>
                        </defs>
                        <g id="ilustração-processamento" clip-path="url(#clip-ilustração-processamento)">
                            <g id="Grupo_10007" transform="translate(1888.858 7101.611)">
                                <path id="Caminho_13" d="M8543.626,2727.894c.129.008.257.02.388.02H8563.3a6.221,6.221,0,0,0,6.221-6.221v-19.283c0-.131-.012-.259-.02-.387Z" transform="translate(-10430.484 -9803.049)" fill="#ecf7fb"/>
                                <path id="Caminho_14" d="M8620.4,2704.254h-50.465v18.476a6.22,6.22,0,0,1-6.222,6.22h-19.094v80.959a7.443,7.443,0,0,0,7.443,7.443h67.113a7.443,7.443,0,0,0,7.443-7.443v-99.435A6.221,6.221,0,0,0,8620.4,2704.254Z" transform="translate(-10431.065 -9804.355)" fill="#fff" stroke="#7faadc" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                <line id="Linha_13" x1="25.315" y2="24.697" transform="translate(-1886.448 -7100.102)" fill="#fff" stroke="#7faadc" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                <line id="Linha_2497" x2="50.72" transform="translate(-1870.807 -7051.704)" fill="none" stroke="#e1e3e6" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"/>
                                <line id="Linha_2498" x2="50.72" transform="translate(-1870.807 -7043.354)" fill="none" stroke="#e1e3e6" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"/>
                                <line id="Linha_2499" x2="50.72" transform="translate(-1870.807 -7035.003)" fill="none" stroke="#e1e3e6" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"/>
                                <path id="Caminho_16" d="M8543.672,2727.894c.128.008.256.02.387.02h19.284a6.221,6.221,0,0,0,6.22-6.221v-19.283c0-.131-.012-.259-.02-.387Z" transform="translate(-10430.512 -9803.049)" fill="none"/>
                                <path id="Caminho_17" d="M8620.442,2704.254h-50.466v18.476a6.219,6.219,0,0,1-6.22,6.22h-19.095v80.959a7.443,7.443,0,0,0,7.443,7.443h67.113a7.443,7.443,0,0,0,7.443-7.443v-99.435A6.221,6.221,0,0,0,8620.442,2704.254Z" transform="translate(-10431.091 -9804.355)" fill="none" stroke="#7faadc" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                <line id="Linha_18" x1="25.315" y2="24.697" transform="translate(-1886.429 -7100.102)" fill="none" stroke="#7faadc" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                <circle id="Elipse_727" cx="24.5" cy="24.5" r="24.5" transform="translate(-1837 -7030.611)" fill="#fff"/>
                                <path id="autorenew" d="M20.036,11.023v6.014l8.018-8.018L20.036,1V7.014A16.008,16.008,0,0,0,6.486,31.589l2.927-2.927a11.826,11.826,0,0,1-1.4-5.613A12.027,12.027,0,0,1,20.036,11.023m13.55,3.488L30.66,17.437a12.007,12.007,0,0,1-10.624,17.64V29.063l-8.018,8.018L20.036,45.1V39.086A16.008,16.008,0,0,0,33.587,14.51Z" transform="translate(-1832.231 -7029.058)" fill="#7faadc"/>
                                <path id="Caminho_2802" d="M8560.787,2764.094h-15.838v15.838Z" transform="translate(-10430.651 -9838.774)" fill="#f5f7fa"/>
                                <line id="Linha_2496" x2="14.522" transform="translate(-1870.807 -7060.054)" fill="none" stroke="#a7c4e7" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"/>
                            </g>
                        </g>
                    </svg>
                </div>
                <span
                    innerHTML={ !isNill(this.invalidProtocoloMessage)
                        ? this.invalidProtocoloMessage
                        : '<h6>Protocolo de assinatura inválido</h6>' }>
                </span>
            </div>
        );
    }

    private getUnavailable() {
        return (
            <div class="unavailable d-flex flex-column justify-content-center align-items-center text-center">
                <div class="mb-2">
                    {/*<img src="../../assets/images/unavailable.svg" alt="Unavailable"/>*/}
                    <svg xmlns="http://www.w3.org/2000/svg" width="94" height="84" viewBox="0 0 94 84">
                        <defs>
                            <clipPath id="clip-assinaturas-indisponivel">
                                <rect width="94" height="84"/>
                            </clipPath>
                        </defs>
                        <g id="assinaturas-indisponivel" clip-path="url(#clip-assinaturas-indisponivel)">
                            <g id="Grupo_10015" transform="translate(-192 -46.074)">
                                <path id="Caminho_6592" d="M4445.144,444.4h68.07a9.037,9.037,0,0,0,7.818-13.56L4487,372.034a9.037,9.037,0,0,0-15.641,0l-34.034,58.8A9.038,9.038,0,0,0,4445.144,444.4Z" transform="translate(-4240.597 -317.826)" fill="none" stroke="#a7c4e7" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>
                                <circle id="Elipse_728" cx="3.697" cy="3.697" r="3.697" transform="translate(235 104.326)" fill="#a7c4e7"/>
                                <line id="Linha_2500" y2="20.555" transform="translate(238.5 77.563)" fill="none" stroke="#a7c4e7" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"/>
                            </g>
                        </g>
                    </svg>
                </div>
                <h6>O serviço de assinaturas está temporariamente indisponível</h6>
                <small class="text-muted">Quando o serviço for restabelecido, a sua aplicação voltará a funcionar normalmente</small>
            </div>
        );
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
            <div class="d-flex justify-content-between detalhes-assinatura__header">
                <div class="d-flex flex-column">
                    <h6 class="mb-0">
                        { this.linkAssinador ? 'Detalhes do processo de assinatura' : 'Lista de assinantes' }
                    </h6>
                    <small class="text-muted">Enviado em { this.documento.criadoEm }</small>
                </div>
                <div class="d-flex align-items-start">
                    { (!this.linkAssinador) && (
                        <button class="btn btn-link text-capitalize" onClick={ this._fetch } disabled={ this.loading }>
                            <span class="d-flex">
                                <svg viewBox="0 0 24 24" width="16" height="16">
                                    <path fill="currentColor" d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" />
                                </svg>
                                <span class="ml-1">Atualizar</span>
                            </span>
                        </button>
                    )}
                    { (this.linkAssinador && (isNill(this.exibirLinkPara) || this.isUserInAssinantes())) && (
                        this.getAtalhosLinkAssinador()
                    )}
                </div>
            </div>
        );
    }

    private getAtalhosLinkAssinador() {
        return (
            <div class="d-flex link-assinador-atalhos">
                <a href={ this.documento.downloadUrl } target="_blank" rel="noopener noreferrer" class="d-flex align-items-center mr-md-3 mb-2 mb-md-0 ml-2 ml-md-0 text-decoration-none" title="Abrir no Assinador">
                    <svg class="mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                        <path fill="currentColor" d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
                    </svg>
                    <span class="d-none d-md-block">Assinador</span>
                    <span class="d-block d-md-none">Visualizar no Assinador</span>
                </a>
                <a class="text-secondary text-decoration-none d-flex align-items-center ml-2 ml-md-0" onClick={ this._copyLink } title="Copiar link">
                    { !this._linkCopied ? (
                        <svg class="mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                            <path fill="currentColor" d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z" />
                        </svg>
                    ) : (
                        <svg class="mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                            <path fill="#54a668" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
                        </svg>
                    )}
                    Copiar link
                </a>
            </div>
        );
    }

    private getLinkDocumento() {
        return (
            <div class="row">
                <div class="col">
                    <div class="card border-0 bg-secondary mb-2 mt-2">
                        <div class="card-body">
                            <div class="d-flex align-items-center justify-content-md-between w-100 flex-md-row flex-column">
                                <div class="d-flex w-100 justify-content-center justify-content-md-start text-truncate mb-2 mb-md-0">
                                    <a href={ this.documento.arquivoUrl } target="_blank" class="mw-95 text-decoration-none" title={ this.documento.nome }>
                                        {/*<i class="mdi mdi-file-document-outline mr-1"></i>*/}
                                        {/*Usando svg porque shadow dom não tem suporte a custom fonts*/}
                                        <div class="d-flex align-items-center">
                                            <div>
                                                <svg class="mr-1" viewBox="0 0 24 24" width="16" height="16">
                                                    <path fill="currentColor" d="M6,2A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2H6M6,4H13V9H18V20H6V4M8,12V14H16V12H8M8,16V18H13V16H8Z" />
                                                </svg>
                                            </div>
                                            <div class="text-truncate">
                                                { this.documento.nome }
                                            </div>
                                        </div>
                                    </a>
                                </div>
                                { (this.documento.arquivoAssinadoUrl) && (
                                    <div class="d-flex w-xs-100">
                                        <a href={ this.documento.arquivoAssinadoUrl } target="_blank" rel="noopener noreferrer"
                                           class="btn btn-primary btn-abrir-assinado text-decoration-none flex-grow-1 flex-md-grow-0"
                                           title={ "Abrir assinado" + (this.documento.tipo === 'PDF' && (' (PAdES)')) }>
                                            <svg class="mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                                                <path fill="currentColor" d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
                                            </svg>
                                            Abrir assinado { this.documento.tipo === 'PDF' && ('(PAdES)') }
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private getTableSecoesAssinaturas(assinantes, assinaturasPreExistentes) {
        return (
            <div class="row">
                <div class="col">
                    <div>
                        <table class="table table-hover table-card table-responsive">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th><span>Assinante</span></th>
                                    <th><span>Assinado em</span></th>
                                    <th><span>Situação</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                { assinantes.map((assinante, index) => this.getRowAssinante(assinante, index))}
                                {(!!assinaturasPreExistentes && assinaturasPreExistentes.length > 0) && (
                                    <tr>
                                        <td></td>
                                        <td class="separator">
                                            <span>Assinaturas pré-existentes</span>
                                        </td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                )}
                                {(!!assinaturasPreExistentes && assinaturasPreExistentes.length > 0) && (
                                    assinaturasPreExistentes.map(assinatura => this.getRowAssinaturaPreExistente(assinatura))
                                )}
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
                <td>
                    <span class="text-nowrap fw-600">{ index + 1 }º</span>
                </td>
                <td>
                    <div class="d-flex align-items-center">
                        <div>
                            <img class="rounded-circle" src={ assinante.avatarUrl } alt={'Foto de ' + assinante.nome } />
                        </div>
                        <div class="text-truncate ml-2">
                            <span class="d-block text-truncate fs-13">{ assinante.nome }</span>
                            <small class="tx__gray--d20 text-truncate fs-12">{ assinante.id }</small>
                        </div>
                    </div>
                </td>
                <td class="p-1">
                    { (assinante.dataAssinatura && assinante.situacaoAssinatura === 'ASSINADO')
                        ? (<div class="d-flex flex-column text-nowrap" innerHTML={ assinante.dataAssinatura }></div>)
                        : (<span>--</span>) }
                </td>
                <td>
                    { (assinante.situacaoAssinatura !== 'ERRO') ? (
                        <span class={ situacaoAssinatura.get(assinante.situacaoAssinatura).css }>
                            { situacaoAssinatura.get(assinante.situacaoAssinatura).descricao }
                        </span>
                    ) : (
                        <span class="text-danger d-flex justify-content-start">
                            {/*<i class="mdi mdi-alert mr-1"></i>*/}
                            {/*Usando svg porque shadow dom não tem suporte a custom fonts*/}
                            <svg class="mr-1" viewBox="0 0 24 24" width="16" height="16">
                                <path fill="currentColor" d="M13 14H11V9H13M13 18H11V16H13M1 21H23L12 2L1 21Z" />
                            </svg>
                            { situacaoAssinatura.get(assinante.situacaoAssinatura).descricao }
                        </span>
                    )}
                </td>
            </tr>
        );
    }

    private getRowAssinaturaPreExistente(assinatura) {
        return (
            <tr>
                <td></td>
                <td>
                    <div class="d-flex align-items-center">
                        <div>
                            <img class="rounded-circle"
                                 src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAABVBAMAAADzvAQyAAAAA3NCSVQICAjb4U/gAAAAJFBMVEXv7+/r6+vn5+fj4+Pf39/b29vX19fS0tLOzs7KysrGxsbCwsLs/LKrAAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABZ0RVh0Q3JlYXRpb24gVGltZQAwNS8yOC8xNZrgdoYAAAHdSURBVEiJ7dU7SwNBEADgE8Q6s3nY3h5q0sZCtIwgRDttDHYqoqRLEIJJ56tIHQh7tprcXWpB8uvcy+NuZ2/njATEIlN/zMzezs1aziJhWyu2Yr9kAMB+ZqFJOJ1xdnTbat0cQirj7NwNZPTPII1BNfCFjMCrMJrxwkhM4+0DUljdnzERXJKMF4K5Eu4ASHYSJZPpKhRj3VgJ95ERLK8kE+KDYHwTsSEQ7AAxv0ywY8wqf8IW7A0zj2IlzPhybAOxwZqZQRVnUyZTZTlXVcLtmdkOSiarGovyosaG3MhKGvPMbF9n5SWyOfkxPumn+aTQQelGDTPjRfXDuX3ishzAPyD1Z9nqITzbIRg6qzog2g5Rr2vgkCyn7JB3RjJlO6DdoC+ui3hxndJFlSEZcprFVXHNxIquzxlalomF356z5r9jEB2hkfZ8ZKMP8gTkLQCrRZ/XvwJi3iBbU67euwbjkEPuIVbS+fexixiHLaQmjoPGgO11sZIueN2dJZyxyXMr9HCj53fKIHsX+AkVTt3sIBMWtmVU0skG2ZRltrtjMwoLj19sFjJ7PdE8bvDZChlr07mm+ZrMtngpXUn3xW2LdYju4xg1M5a2v43pehlL39+mGNiWvr9NMVwxnX0DvhTtmYR25VcAAAAASUVORK5CYII="
                                 alt={'Foto de ' + assinatura.assinante}/>
                        </div>
                        <div class="text-truncate ml-2">
                            <span class="d-block text-truncate fs-13">{assinatura.assinante}</span>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="d-flex flex-column text-nowrap"
                         innerHTML={formatDateHtml(assinatura.dataAssinatura)}></div>
                </td>
                <td></td>
            </tr>
        );
    }

}
