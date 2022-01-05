import { LitElement, html, css } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { live } from 'lit/directives/live.js';
import '@material/mwc-dialog'
import '@material/mwc-textfield'
import '@material/mwc-button'
import { Dialog } from '@material/mwc-dialog'
import './search-panel'
import { SearchPanel } from './search-panel';

@customElement('quick-search')
export class QuickSearch extends LitElement {
  @query('mwc-dialog') _dialog!: Dialog;
  @query('search-panel') _searchPanel!: SearchPanel;

  static styles = css`
  mwc-textfield { width: 100%; margin-bottom: 10px; }
  `

  render () {
    return html`
      <mwc-dialog>
        <mwc-textfield type=search placeholder="search" @keyup=${e => this.onTextFieldKeyup(e)}
          dialogInitialFocus></mwc-textfield>
        <search-panel></search-panel>
        <mwc-button slot="secondaryAction" dialogAction="close">close</mwc-button>
      </mwc-dialog>
    `
  }

  private onTextFieldKeyup (e) {
    if (e.key === 'Enter') {
      this._searchPanel.openFirstSearch()
      return;
    }
    this._searchPanel.query = e.target.value;
  }

  open () {
    this._dialog.show()
  }
}