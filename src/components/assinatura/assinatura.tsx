import { h, Component, Prop } from '@stencil/core';

import { AssinaturaProps, situacaoDocumento } from './assinatura.interfaces';

@Component({
    tag: 'nopaper-assinatura',
    styleUrl: 'assinatura.scss',
    shadow: false
})
export class Assinatura implements AssinaturaProps {

    /**
     *
     */
    @Prop() readonly protocolo: string;
    /**
     *
     */
    @Prop() readonly situacao: string;

    protected componentWillLoad() {
    }

    protected render(): any {
        return (
            <div class="nopaper-assinatura">
                <button class="btn btn-link">
                    <i class={ situacaoDocumento.get(this.situacao)?.css }></i>
                </button>
            </div>
        );
    }

}
