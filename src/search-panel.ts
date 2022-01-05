import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '@material/mwc-button'
import { googleImagesSearch, jishoSearch, naverHanjaSearch, naverJapSearch } from './util';

@customElement('search-panel')
export class SearchPanel extends LitElement {
  @property()
  query = ''

  render () {
    return html`
      <mwc-button outlined style="--mdc-theme-primary:white"
        @click=${() => jishoSearch(this.query)}><img src="https://assets.jisho.org/assets/jisho-logo-v4@2x-7330091c079b9dd59601401b052b52e103978221c8fb6f5e22406d871fcc746a.png" width=42></mwc-button>
      <mwc-button unelevated style="--mdc-theme-primary:#04cf5c"
        @click=${() => naverHanjaSearch(this.query)}><span><b>Naver</b> 漢</span></mwc-button>
      <mwc-button unelevated style="--mdc-theme-primary:#04cf5c"
        @click=${() => naverJapSearch(this.query)}><span><b>Naver</b> あ</span></mwc-button>
      <mwc-button style=""
        @click=${() => googleImagesSearch(this.query)}>
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Google_Images_2015_logo.svg/800px-Google_Images_2015_logo.svg.png" width=64>
      </mwc-button>
    `
  }

  public openFirstSearch () {
    this.shadowRoot!.querySelector('mwc-button')!.click()
  }
}