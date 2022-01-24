import { LitElement, html, css } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { live } from 'lit/directives/live.js';
import '@material/mwc-dialog'
import '@material/mwc-textfield'
import '@material/mwc-button'
import { Dialog } from '@material/mwc-dialog'
import './search-panel'
import { SearchPanel } from './search-panel';
import { TextField } from '@material/mwc-textfield';

@customElement('quick-search')
export class QuickSearch extends LitElement {
  @query('mwc-textfield') textfield!: TextField;
  @query('mwc-dialog') _dialog!: Dialog;
  @query('search-panel') _searchPanel!: SearchPanel;

  @state() private query = '';

  private history: string[] = localStorage.getItem('lang-routes:history') ? JSON.parse(localStorage.getItem('lang-routes:history')!.toString()) : []


  static styles = css`
  mwc-textfield { width: 100%; margin-bottom: 10px; }
  #history {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    /* margin: 18px 0 0 0; */
  }
  #history .query {
    background-color: #e0e0e0;
    padding: 3px 7px;
    margin: 0 5px;
    cursor: pointer;
    border-radius: 4px;
  }
  `

  constructor () {
    super()

    window.addEventListener('searched', (e: Event) => {
      this.history = [...new Set([(e as CustomEvent).detail.query].concat(this.history))]
      localStorage.setItem('lang-routes:history', JSON.stringify(this.history))
      this.requestUpdate()
    })
  }

  render () {
    return html`
      <mwc-dialog scrimClickAction="">
        <div style="display:flex;align-items:center">
          <mwc-textfield placeholder="search"
            .value=${live(this.query)}
            @keyup=${e => this.onTextFieldKeyup(e)}
            dialogInitialFocus></mwc-textfield>
          <mwc-icon-button icon="close"
            @click=${() => { this.onCloseIconClick() }}></mwc-icon-button>
        </div>
        <search-panel .query=${this.query}></search-panel>
        <p style="font-weight:bold">History</p>
        <div id=history>
          ${this.history.map((q) => {
            return html`<span class=query @click=${() => { this.query = q }}>${q}</span>`
          })}
        </div>
        <mwc-button outlined slot="secondaryAction" dialogAction="close">close</mwc-button>
      </mwc-dialog>
    `
  }

  private onCloseIconClick() {
    this.textfield.value = ''
    this.textfield.focus()
  }

  private onTextFieldKeyup (e) {
    if (e.key === 'Enter') {
      this._searchPanel.openFirstSearch()
      return;
    }
    this.query = e.target.value
    // this._searchPanel.query = e.target.value;
  }

  open () {
    this._dialog.show()
  }
}