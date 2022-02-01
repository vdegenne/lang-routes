import { customElement, property } from 'lit/decorators.js';
import '@material/mwc-button'
import { googleImagesSearch, googleTranslateSearch, isKanji, jishoSearch, mdbgSearch, naverHanjaSearch, naverJapSearch, naverKoreanSearch, writtenChineseSearch } from './util';
import { css, html, LitElement } from 'lit';
import { chineseFullRegExp, isFullChinese, isFullJapanese } from 'asian-regexps';
import '@material/mwc-select'
import { Select } from '@material/mwc-select';

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
  mwc-select {
    margin: 0 4px;
  }
  `

  render () {
    return html`
      <mwc-select @selected=${(e) => { e.target.value = 'japanese' }} value="japanese" style="max-width:135px"
          naturalMenuWidth fixedMenuPosition>
        <mwc-list-item style="display:none" value="japanese">Japanese</mwc-list-item>
        <mwc-list-item graphic="icon" @click=${() => { jishoSearch(this.query) }}>
          <img src="./img/jisho.ico" slot="graphic">
          <span>Jisho</span>
        </mwc-list-item>
        <mwc-list-item graphic="icon" @click=${() => { naverJapSearch(this.query) }}>
          <img src="./img/naver.ico" slot="graphic">
          <span>Naver (Japanese)</span>
        </mwc-list-item>
        <mwc-list-item graphic="icon" @click=${() => { mdbgSearch(this.query)}}>
          <img slot="graphic" src="./img/mdbg.ico">
          <span>MDBG</span>
        </mwc-list-item>
        <mwc-list-item graphic="icon"
          @click=${() => {
            if (!isFullChinese(this.query)) {
              window.toast('This is not a Chinese or Japanese character')
              return;
            }
            window.strokesDialog.open(this.query)
          }}>
          <mwc-icon slot="graphic">brush</mwc-icon>
          <span>Strokes</span>
        </mwc-list-item>
        <mwc-list-item graphic="icon" @click=${() => {
          if (isFullJapanese(this.query)) {
            (new Audio(`https://assiets.vdegenne.com/data/japanese/audio/${this.query}.mp3`)).play()
          }
        }}>
          <mwc-icon slot="graphic">volume_up</mwc-icon>
          <span>Listen</span>
        </mwc-list-item>
      </mwc-select>

      <!-- <mwc-icon-button @click=${() => jishoSearch(this.query)}>
        <img src="./img/jisho.ico">
      </mwc-icon-button> -->

      <mwc-select @selected=${(e) => { e.target.value = 'chinese'}} value="chinese" style="max-width:115px"
          naturalMenuWidth fixedMenuPosition>
        <mwc-list-item style="display:none" value="chinese">Hanzi</mwc-list-item>
        <mwc-list-item graphic="icon" @click=${() => { mdbgSearch(this.query)}}>
          <img slot="graphic" src="./img/mdbg.ico">
          <span>MDBG</span>
        </mwc-list-item>
        <mwc-list-item graphic="icon" @click=${() => { naverHanjaSearch(this.query) }}>
          <img src="./img/naver.ico" slot="graphic">
          <span>Naver (Hanja)</span>
        </mwc-list-item>
        <mwc-list-item graphic="icon" @click=${() => { writtenChineseSearch(this.query) }}>
          <img src="./img/writtenchinese.png" slot="graphic">
          <span>WrittenChinese</span>
        </mwc-list-item>
        <mwc-list-item graphic="icon"
          @click=${() => {
            if (!isFullChinese(this.query)) {
              window.toast('This is not a Chinese or Japanese character')
              return;
            }
            window.strokesDialog.open(this.query)
          }}>
          <mwc-icon slot="graphic">brush</mwc-icon>
          <span>Strokes</span>
        </mwc-list-item>
      </mwc-select>

      <mwc-select @selected=${(e) => { e.target.value = 'korean'}} value="korean" style="max-width:115px"
          naturalMenuWidth fixedMenuPosition>
        <mwc-list-item style="display:none" value="korean">Korean</mwc-list-item>
        <mwc-list-item graphic="icon" @click=${() => { naverKoreanSearch(this.query) }}>
          <img src="./img/naver.ico" slot="graphic">
          <span>Naver (Korean)</span>
        </mwc-list-item>
      </mwc-select>

      <!-- <mwc-icon-button @click=${() => writtenChineseSearch(this.query)}>
        <img src="./img/writtenchinese.png">
      </mwc-icon-button> -->

      <!-- <mwc-icon-button @click=${() => mdbgSearch(this.query)}>
        <img src="./img/mdbg.ico">
      </mwc-icon-button> -->

      <!-- <mwc-icon-button style="background-color:#04cf5c;color:white;border-radius:30px"
        @click=${() => naverHanjaSearch(this.query)}>漢</mwc-icon-button> -->

      <!-- <mwc-icon-button style="background-color:#04cf5c;color:white;border-radius:30px"
        @click=${() => naverJapSearch(this.query)}>あ</mwc-icon-button> -->

      <!-- <mwc-icon-button style="background-color:#04cf5c;color:white;border-radius:30px"
        @click=${() => naverKoreanSearch(this.query)}>한</mwc-icon-button> -->

      <mwc-icon-button @click=${() => { googleTranslateSearch(this.query) }}>
        <img src="./img/google-translate.ico">
      </mwc-icon-button>

        <mwc-icon-button @click=${() => googleImagesSearch(this.query)} icon="image" style="color:#4c8cf5">
        </mwc-icon-button>

      <!-- <mwc-icon-button icon="brush" @click=${() => {
        if (!isFullChinese(this.query)) {
          window.toast('This is not a Chinese or Japanese character')
          return;
        }
        window.strokesDialog.open(this.query)
      }}></mwc-icon-button> -->
    `
  }

  protected firstUpdated(_changedProperties: Map<string | number | symbol, unknown>): void {
    [...this.shadowRoot!.querySelectorAll<Select>('mwc-select')].forEach((el) => {
      let _openDebouncer
      el.addEventListener('mouseover', (e) => {
        if (_openDebouncer) {
          clearTimeout(_openDebouncer)
          _openDebouncer = undefined
        }
        _openDebouncer = setTimeout(() => {
          // We should also blur the input if there is one
          window.quickSearch.textfield.blur()
          // @ts-ignore
          el.menuOpen = true
        }, 400)
      })
      el.addEventListener('mouseleave', (e) => {
        clearTimeout(_openDebouncer)
        // @ts-ignore
        el.menuOpen = false
        el.blur()
      })
    })
  }

  public openFirstSearch () {
    // this.shadowRoot!.querySelector('mwc-select')!.click()
  }
}