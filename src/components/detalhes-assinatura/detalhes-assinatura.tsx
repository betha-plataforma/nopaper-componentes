import { Component, h, Method, Prop, State, Watch } from '@stencil/core';

import { isValidAuthorizationConfig } from '../../global/base-api';
import { Authorization, AuthorizationConfig } from '../../global/interfaces';
import { formatDate, formatDateHtml, isNill } from '../../utils/utils';
import { DetalhesAssinaturaProps, situacaoAssinatura } from './detalhes-assinatura.interfaces';
import { DetalhesAssinaturaService } from './detalhes-assinatura.service';

@Component({
    tag: 'nopaper-detalhes-assinatura',
    styleUrl: 'detalhes-assinatura.scss',
    shadow: true
})
export class DetalhesAssinatura implements DetalhesAssinaturaProps {

    private assinaturaService: DetalhesAssinaturaService;

    @State() loading = false;
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

    private _protocolo: string;
    private _authorization: AuthorizationConfig;
    private _accessToken: string;
    private _userAccess: string;
    private _fetch = this.fetch.bind(this);

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

    formatDateString(date: Date, showTime: boolean): string {
        date = new Date(date);
        const formatDate = `${ date.getDate() }/${ date.getMonth() + 1 }/${ date.getFullYear() }`;
        const formatTime = `${ date.getHours() }:${ date.getMinutes() }`;
        if (showTime) {
            return  `${ formatDate } às ${ formatTime }`;
        }
        return `${ formatDate }`;
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
            nome: documento.nomeArquivo,
            criadoEm: formatDate(documento.createdIn),
            arquivoAssinaturas: documento.arquivoAssinaturas,
            assinantes: documento.secoesAssinaturas && documento.secoesAssinaturas.length
                ? documento.secoesAssinaturas.map(secaoAssinatura => this.transformaAssinante(secaoAssinatura.assinantes[0]))
                : [],
            downloadUrl: this.getDownloadUrlDocumento(documento.urlDownloadFront, documento.tipo === 'PDF')
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
            <div class="d-flex justify-content-between">
                <div class="d-flex flex-column">
                    <h6 class="mb-0">Lista de assinantes</h6>
                    <small class="text-muted">Enviado em { this.documento.criadoEm }</small>
                </div>
                <div class="d-flex">
                    <button class="btn btn-link" onClick={ this._fetch } disabled={ this.loading }>
                        <span class="d-flex">
                            <svg viewBox="0 0 24 24" width="16" height="16">
                                <path fill="currentColor" d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" />
                            </svg>
                            ATUALIZAR
                        </span>
                    </button>
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
                                {/*<i class="mdi mdi-file-document-outline mr-1"></i>*/}
                                {/*Usando svg porque shadow dom não tem suporte a custom fonts*/}
                                <span class="d-flex">
                                    <svg class="mr-1" viewBox="0 0 24 24" width="16" height="16">
                                        <path fill="currentColor" d="M6,2A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2H6M6,4H13V9H18V20H6V4M8,12V14H16V12H8M8,16V18H13V16H8Z" />
                                    </svg>
                                    { this.documento.nome }
                                </span>
                            </a>
                            { (this.documento.arquivoAssinaturas?.length) && (
                              this.getAssinaturasArquivo(this.documento.arquivoAssinaturas)
                            ) }
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
                        <div>
                            <img class="rounded-circle" src={ assinante.avatarUrl } alt={'Foto de ' + assinante.nome } />
                        </div>
                        <span class="text-truncate ml-2">{ assinante.nome }</span>
                    </div>
                </td>
                <td class="p-1">
                    { (assinante.dataAssinatura && assinante.situacaoAssinatura === 'ASSINADO')
                        ? (<span innerHTML={ assinante.dataAssinatura }></span>)
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

    private getAssinaturasArquivo(assinaturas) {
        return (
          <div id="arquivoAssinaturasSectionId">
              <div class="separator">
                  <div class="ml-4 mr-4">O documento possui as assinaturas abaixo</div>
              </div>
              <div class="d-flex flex-column arquivo-assinaturas-container">
                  { assinaturas.map(assinatura => (
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <svg class="ml-1 mr-2" color="red" viewBox="0 0 24 24" width="16" height="16">
                                <path
                                  fill="#595959"
                                  d="M9.75 20.85C11.53 20.15 11.14 18.22 10.24 17C9.35 15.75 8.12 14.89 6.88 14.06C6 13.5 5.19 12.8 4.54 12C4.26 11.67 3.69 11.06 4.27 10.94C4.86 10.82 5.88 11.4 6.4 11.62C7.31 12 8.21 12.44 9.05 12.96L10.06 11.26C8.5 10.23 6.5 9.32 4.64 9.05C3.58 8.89 2.46 9.11 2.1 10.26C1.78 11.25 2.29 12.25 2.87 13.03C4.24 14.86 6.37 15.74 7.96 17.32C8.3 17.65 8.71 18.04 8.91 18.5C9.12 18.94 9.07 18.97 8.6 18.97C7.36 18.97 5.81 18 4.8 17.36L3.79 19.06C5.32 20 7.88 21.47 9.75 20.85M18.96 7.33L13.29 13H11V10.71L16.67 5.03L18.96 7.33M22.36 6.55C22.35 6.85 22.04 7.16 21.72 7.47L19.2 10L18.33 9.13L20.93 6.54L20.34 5.95L19.67 6.62L17.38 4.33L19.53 2.18C19.77 1.94 20.16 1.94 20.39 2.18L21.82 3.61C22.06 3.83 22.06 4.23 21.82 4.47C21.61 4.68 21.41 4.88 21.41 5.08C21.39 5.28 21.59 5.5 21.79 5.67C22.08 5.97 22.37 6.25 22.36 6.55Z"/>
                            </svg>
                        </div>
                        <div class="text-truncate flex-grow-1" title={ assinatura.assinante }>
                            { assinatura.assinante }
                        </div>
                        <div class="text-nowrap" title={this.formatDateString(assinatura.dataAssinatura, true)}>{ this.formatDateString(assinatura.dataAssinatura, false) }</div>
                    </div>
                  )) }
              </div>
          </div>
        );
    }

}
