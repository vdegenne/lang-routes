import { css, html, LitElement } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import '@material/mwc-button'
import { getSelection, googleImagesSearch, jishoSearch, naverHanjaSearch, naverJapSearch, presearchHanjaPage } from './util'
import './quick-search'
import { QuickSearch } from './quick-search'
import './search-panel'

@customElement('lang-routes')
export class LangRoutes extends LitElement {
  @property({type:Boolean})
  private _locked = false;

  @property()
  private _text = ''

  @property()
  private _selected = ''

  @query('textarea') _textarea!: HTMLTextAreaElement;
  @query('#textContainer') _textContainer!: HTMLParagraphElement;
  @query('quick-search') _quickSearch!: QuickSearch;

  constructor() {
    super()

    this._text = localStorage.getItem('text') || 'edit this text and select some text';
  }

  firstUpdated() {
    const selectFunction = () => {
      if (getSelection())
        this._selected = getSelection()
    }
    this._textContainer.addEventListener('mouseup', selectFunction)
    this._textContainer.addEventListener('touchend', selectFunction)
    // window.addEventListener('pointerup', e => {
    //   this._selected = getSelection()
    // })
    // this._textarea.addEventListener('selectstart', e => alert('select start !!!!'))
  }

  static styles = [
    css`
    :host {
      display: flex;
      flex-direction: column;
      height: 90%;
      --mdc-theme-primary: black;
    }
    textarea {
      width:100%;
      resize: vertical;
    }

    [hide] {
      display:none;
    }
    `
  ]
  render () {
    return html`
    <div id="topbar" style="text-align:right;margin-bottom: 5px;">
      <mwc-button dense icon="search" @click=${() => this._quickSearch.open()}>quick</mwc-button>
      <mwc-button dense icon="lock" @click=${() => this._locked = !this._locked} style="">lock</mwc-button>
      <mwc-button dense icon="settings">settings</mwc-button>
    </div>

    <textarea ?hide=${this._locked} ?disabled=${this._locked} .value=${this._text} style="margin:0 6px 6px 0;flex:1"
      @keyup=${e => this.onTextAreaChange()}></textarea>
    <div ?hide=${!this._locked} style="flex:1;font-size:1.7em;overflow-y:scroll" id="textContainer">
      <span style="white-space:pre-wrap">${this._text}</span>
    </div>

    <div ?hide=${!this._selected} style="margin-bottom:10px;font-size:2em;padding-left:8px;color:white;background-color:grey">${this._selected}</div>

    <search-panel .query=${this._selected}></search-panel>

    <quick-search></quick-search>
    `
  }

  private onTextAreaChange() {
    this._text = this._textarea.value;
    localStorage.setItem('text', this._text)
  }
}