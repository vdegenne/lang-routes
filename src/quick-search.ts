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
import html2canvas from 'html2canvas'
import { hasChinese, isFullJapanese } from 'asian-regexps';

@customElement('quick-search')
export class QuickSearch extends LitElement {
  @query('mwc-textfield') textfield!: TextField;
  @query('mwc-dialog') _dialog!: Dialog;
  @query('search-panel') searchPanel!: SearchPanel;
  @query('#history') historyBox!: HTMLDivElement;

  @state() public query = '';

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
    margin: 3px;
    cursor: pointer;
    border-radius: 4px;
  }
  .query[selected] {
    background-color: #ffee58 !important;
    color: black;
  }
  [hide] {
    display: none;
  }
  `

  constructor () {
    super()

    // window.addEventListener('searched', (e: Event) => {
    //   this.addToHistory((e as CustomEvent).detail.query);
    // })

    let _blurTimestamp: number|undefined = undefined;
    let _focusDebouncer: NodeJS.Timeout|undefined = undefined;
    const clearFocusDebouncer = function () {
      if (_focusDebouncer) {
        clearTimeout(_focusDebouncer)
        _focusDebouncer = undefined
      }
    }
    window.addEventListener('blur', (e) => {
      clearFocusDebouncer()
      _blurTimestamp = Date.now()
    })

    window.addEventListener('focus', (e) => {
      if (!navigator.userAgent.includes('Whale')) {
        return;
      }
      _focusDebouncer = setTimeout(() => {
        // We take advantage of one breach in Whale browser
        // When the application is in the sidebar, on tab closing
        // the blur event listener is triggered again.
        // We use this behavior to avoid textfield focus other than
        // toggling the sidebar on and off
        // console.log(Date.now() - _blurTimestamp!)
        if (_blurTimestamp && (Date.now() - _blurTimestamp < 1000)) {
          return;
        }
        this.textfield.focus()
      }, 500)
    })

    window.addEventListener('keyup', (e) => {
      if (e.key === 'Escape' && window.strokesDialog.dialog.open === false) {
        this._dialog.close()
      }
    })
  }

  public addToHistory(query: string) {
    this.history = [...new Set([query].concat(this.history))]
    this.saveHistory()
  }

  render () {
    return html`
      <mwc-dialog escapeKeyAction="">
        <div style="display:flex;align-items:flex-start">
          <mwc-textfield placeholder="search"
            helperPersistent
            value=${this.query}
            @keyup=${(e) => { this.onTextFieldKeyup(e) }}
            ></mwc-textfield>
          <mwc-icon-button icon="close" style="margin:6px"
            @click=${() => { this.onCloseIconClick() }}></mwc-icon-button>
        </div>

        <search-panel .query=${this.query}
          @opened=${() => { this.textfield.blur() }}></search-panel>

        <div style="display:flex;align-items:center;justify-content:space-between;margin-top:24px">
          <p style="font-weight:bold">History</p>
          <div style="flex:1"></div>
          <mwc-icon-button icon="delete"
              ?hide=${!this.query || !this.history.includes(this.query)}
              @click=${() => { this.history.splice(this.history.indexOf(this.query), 1); this.saveHistory() }}></mwc-icon-button>
          <mwc-icon-button icon="download" @click=${() => { this.downloadHistory() }}></mwc-icon-button>
        </div>

        <div id=history>
          ${this.history.map((q) => {
            return html`<span class=query @click=${() => { if (this.query !== q) { this.query = q; this.search()} }} ?selected=${this.query === q}>${q}</span>`
          })}
        </div>
        <mwc-button outlined slot="secondaryAction" dialogAction="close">close</mwc-button>
      </mwc-dialog>
    `
  }

  private onCloseIconClick() {
    this.query = ''
    // this.textfield.value = ''
    this.textfield.focus()
  }


  private onTextFieldChange () {
    // await this.updateComplete
    this.query = this.textfield.value;
    // Initiate a search to resolve the Japanese word to full japanese
    // If the word is full japanese already (without kanjis within) do nothing
    if (this.query in window.dataManager.flats) {
      this.textfield.helper = window.dataManager.flats[this.query]
    }
    else {
      this.textfield.helper = ''
    }
  }

  private async onTextFieldKeyup (e) {
    if (e.key === 'Enter') {
      this.search()
      this.textfield.blur()
      this.searchPanel.openFirstSearch()
      return;
    }
    this.onTextFieldChange()
    this.searchPanel.closeAllMenus()
  }


  // private _flattenDebouncer;
  async search () {
    this.addToHistory(this.query)
    if (isFullJapanese(this.query) && hasChinese(this.query)) {
      this.textfield.helper = ''
      if (this.query in window.dataManager.flats) {
        this.textfield.helper = window.dataManager.flats[this.query]
      }
      else {
        // if (this._flattenDebouncer) {
        //   clearTimeout(this._flattenDebouncer)
        //   this._flattenDebouncer = undefined
        // }
        // this._flattenDebouncer = setTimeout(async () => {
          try {
            const response = await fetch(`https://assiets.vdegenne.com/data/japanese/flatten/${this.query}`)
            if (response.status !== 200) {
              throw new Error()
            }
            const content = await response.text()
            this.textfield.helper = content
            window.dataManager.flats[this.query] = content
            window.dataManager.save()
          }
          catch (e) {
          }
        // }, 1500)
      }
    }
    else {
      this.textfield.helper = ''
    }
  }

  get opened() {
    return this._dialog.open;
  }

  open () {
    // window.app.searchPanel.closeAllMenus()
    this._dialog.show()
  }

  async downloadHistory () {
    const canvas = await html2canvas(this.historyBox)
    const anchor = document.createElement('a')
    anchor.href = canvas.toDataURL()
    anchor.download = 'history.png'
    anchor.click()
  }

  private saveHistory () {
    localStorage.setItem('lang-routes:history', JSON.stringify(this.history))
    this.requestUpdate()
  }
}