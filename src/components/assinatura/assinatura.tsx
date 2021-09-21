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
    @Prop() readonly situacao: string;

    protected render(): any {
        return (
            <span
                title={ situacaoDocumento.get(this.situacao)?.descricao }
                innerHTML={ situacaoDocumento.get(this.situacao)?.svg }>
            </span>
        );
    }

}
