import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '@material/mwc-button'
import { googleImagesSearch, jishoSearch, mdbgSearch, naverHanjaSearch, naverJapSearch, writtenChineseSearch } from './util';

@customElement('search-panel')
export class SearchPanel extends LitElement {
  @property()
  query = ''

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
      <mwc-button outlined style="--mdc-theme-primary:white"
        @click=${() => jishoSearch(this.query)}><img src="https://assets.jisho.org/assets/jisho-logo-v4@2x-7330091c079b9dd59601401b052b52e103978221c8fb6f5e22406d871fcc746a.png" width=42></mwc-button>
      <mwc-icon-button outlined
        @click=${() => writtenChineseSearch(this.query)}>
        <img src="/img/writtenchinese.png" width="24">
      </mwc-icon-button>
      <mwc-icon-button><img src="/img/mdbg.jpg" @click=${() => mdbgSearch(this.query)}></mwc-icon-button>
      <!-- <mwc-button unelevated style="--mdc-theme-primary:#04cf5c"
        @click=${() => naverHanjaSearch(this.query)}><span><b>Naver</b> 漢</span></mwc-button> -->
      <mwc-icon-button style="background-color:#04cf5c;color:white;border-radius:30px"
        @click=${() => naverHanjaSearch(this.query)}>漢</mwc-icon-button>
      <mwc-icon-button style="background-color:#04cf5c;color:white;border-radius:30px"
        @click=${() => naverJapSearch(this.query)}>あ</mwc-icon-button>
      <!-- <mwc-button unelevated style="--mdc-theme-primary:#04cf5c"
        @click=${() => naverJapSearch(this.query)}><span><b>Naver</b> あ</span></mwc-button> -->
      <mwc-button outlined style=""
        @click=${() => googleImagesSearch(this.query)}>
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Google_Images_2015_logo.svg/800px-Google_Images_2015_logo.svg.png" width=64>
      </mwc-button>
    `
  }

  public openFirstSearch () {
    this.shadowRoot!.querySelector('mwc-button')!.click()
  }
}