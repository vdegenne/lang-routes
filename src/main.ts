import { css, html, LitElement } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import '@material/mwc-button'
import { getSelection, googleImagesSearch, jishoSearch, naverHanjaSearch, naverJapSearch, presearchHanjaPage } from './util'

@customElement('lang-routes')
export class LangRoutes extends LitElement {
  @property({type:Boolean})
  private _locked = false;

  @property()
  private _text = ''

  @property()
  private _selected = ''

  @query('textarea') _textarea!: HTMLTextAreaElement;

  constructor() {
    super()

    this._text = localStorage.getItem('text') || 'edit this text and select some text';
  }

  firstUpdated() {
    this._textarea.addEventListener('select', e => {
      this._selected = getSelection()
      // presearchHanjaPage(this._selected)
    })
  }

  static styles = [
    css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
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
      <mwc-button dense icon="lock" @click=${_ => this._locked = !this._locked} style="">lock</mwc-button>
      <mwc-button dense icon="settings">settings</mwc-button>
    </div>

    <textarea ?hide=${false} ?disabled=${this._locked} .value=${this._text} style="margin:0 6px 6px 0;flex:1;font-size:1.8em"
      @keyup=${e => this.onTextAreaChange()}></textarea>
    <div ?hide=${true} style="flex:1">
      ${this._text}
    </div>

    <div ?hide=${!this._selected} style="margin:10px 0;font-size:2em;margin-left:8px">${this._selected}</div>

    <div ?hide=${!this._selected}>
      <mwc-button outlined style="--mdc-theme-primary:white"
        @click=${_ => jishoSearch(this._selected)}><img src="https://assets.jisho.org/assets/jisho-logo-v4@2x-7330091c079b9dd59601401b052b52e103978221c8fb6f5e22406d871fcc746a.png" width=42></mwc-button>
      <mwc-button unelevated style="--mdc-theme-primary:#04cf5c"
        @click=${_ => naverHanjaSearch(this._selected)}><span><b>Naver</b> 漢</span></mwc-button>
      <mwc-button unelevated style="--mdc-theme-primary:#04cf5c"
        @click=${_ => naverJapSearch(this._selected)}><span><b>Naver</b> あ</span></mwc-button>
      <mwc-button style=""
        @click=${_ => googleImagesSearch(this._selected)}>
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Google_Images_2015_logo.svg/800px-Google_Images_2015_logo.svg.png" width=64>
      </mwc-button>
    </div>
    `
  }

  private onTextAreaChange() {
    this._text = this._textarea.value;
    localStorage.setItem('text', this._text)
  }
}