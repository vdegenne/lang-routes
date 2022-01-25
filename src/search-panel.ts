import { customElement, property } from 'lit/decorators.js';
import '@material/mwc-button'
import { googleImagesSearch, googleTranslateSearch, isKanji, jishoSearch, mdbgSearch, naverHanjaSearch, naverJapSearch, naverKoreanSearch, writtenChineseSearch } from './util';
import { css, html, LitElement } from 'lit';
import { isFullChinese, isFullJapanese } from 'asian-regexps';

@customElement('search-panel')
export class SearchPanel extends LitElement {
  @property()
  public query = ''

  constructor () {
    super()

    this.addEventListener('click', (e: Event) => {
      if (e.composedPath()[0] !== this && this.query) {
        this.dispatchEvent(new CustomEvent('searched', { bubbles: true, composed: true, detail: { query: this.query } }))
      }
    })
  }

  static styles = css`
  :host {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    /* background-color: grey; */
    padding: 6px;
  }
  mwc-icon-button, mwc-button {
    margin: 0 3px;
  }
  `

  render () {
    return html`
      <mwc-icon-button @click=${() => jishoSearch(this.query)}>
        <img src="./img/jisho.ico">
      </mwc-icon-button>

      <mwc-icon-button @click=${() => writtenChineseSearch(this.query)}>
        <img src="./img/writtenchinese.png">
      </mwc-icon-button>

      <mwc-icon-button @click=${() => mdbgSearch(this.query)}>
        <img src="./img/mdbg.ico">
      </mwc-icon-button>

      <mwc-icon-button style="background-color:#04cf5c;color:white;border-radius:30px"
        @click=${() => naverHanjaSearch(this.query)}>漢</mwc-icon-button>

      <mwc-icon-button style="background-color:#04cf5c;color:white;border-radius:30px"
        @click=${() => naverJapSearch(this.query)}>あ</mwc-icon-button>

      <mwc-icon-button style="background-color:#04cf5c;color:white;border-radius:30px"
        @click=${() => naverKoreanSearch(this.query)}>한</mwc-icon-button>

      <mwc-icon-button @click=${() => googleImagesSearch(this.query)} icon="image" style="color:#4c8cf5">
      </mwc-icon-button>

      <mwc-icon-button @click=${() => { googleTranslateSearch(this.query) }}>
        <img src="./img/google-translate.ico">
      </mwc-icon-button>

      <mwc-icon-button icon="brush" @click=${() => {
        if (!isFullChinese(this.query)) {
          window.toast('This is not a Chinese or Japanese character')
          return;
        }
        window.strokesDialog.open(this.query)}}></mwc-icon-button>

      <mwc-icon-button icon="volume_up"
        @click=${() => {
          if (isFullJapanese(this.query)) {
            (new Audio(`https://assiets.vdegenne.com/data/japanese/audio/${this.query}.mp3`)).play()
          }
        }}></mwc-icon-button>
    `
  }

  public openFirstSearch () {
    this.shadowRoot!.querySelector('mwc-button')!.click()
  }
}