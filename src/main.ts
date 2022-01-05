import { css, html, LitElement } from 'lit'
import { customElement, property as state, query } from 'lit/decorators.js'
import '@material/mwc-button'
import '@material/mwc-icon-button'
import { getSelection, googleImagesSearch, jishoSearch, naverHanjaSearch, naverJapSearch, presearchHanjaPage } from './util'
import './quick-search'
import { QuickSearch } from './quick-search'
import './search-panel'
import { Document } from './types'

@customElement('lang-routes')
export class LangRoutes extends LitElement {
  @state()
  private _locked = false;

  @state()
  private _documents: Document[] = []

  @state()
  private _selected = ''

  @query('textarea') _textarea!: HTMLTextAreaElement;
  @query('#textContainer') _textContainer!: HTMLParagraphElement;
  @query('quick-search') _quickSearch!: QuickSearch;

  constructor() {
    super()

    this._documents = JSON.parse(localStorage.getItem('documents') || '[]')


    window.addEventListener('hashchange', (e) => {
      this.requestUpdate()
      console.log(e)
    })
  }

  // private processLocation () {
  //   if (this.currentDocument) {

  //   }
  // }

  public get currentDocument () {
    if (window.location.hash.slice(1) === '') return undefined
    return this._documents.find(d => parseInt(window.location.hash.slice(1)) === d.id)
  }

  firstUpdated() {
    const selectFunction = () => {
      if (this._locked && !this._quickSearch._dialog.open) {
        const selection = getSelection().trim()
        if (selection)
          this._selected = selection
      }
    }
    setInterval(selectFunction, 500)
    // this._textContainer.addEventListener('mouseup', selectFunction)
    // this._textContainer.addEventListener('touchend', selectFunction)
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
    .document {
      display: flex;
      align-items: center;
      padding: 5px;
      margin: 8px;
      cursor: pointer;
    }
    .document > mwc-icon {
      margin-right: 5px;
    }

    header input {
      padding: 6px;
      border: 1px solid transparent;
    }
    header input:hover,
    header input:focus,
    header input:active {
      outline: none;
      border: 1px solid #e0e0e0;
      /* border-style: inset; */
      border-radius: 1px;
    }
    textarea {
      margin: 0 8px 4px;
      padding: 4px;
      resize: vertical;
      font-family: Roboto;
    }

    [hide] {
      display:none;
    }
    `
  ]

  render () {
    if (this.currentDocument === undefined) {
      return html`
      ${this._documents.map(d => {
        return html`<div class="document"
          @click=${() => window.location.hash = d.id.toString()}><mwc-icon>description</mwc-icon><span>${d.title}</span></div>`
      })}
      <mwc-button unelevated icon="add"
        @click=${() => this.onNewDocumentClick()}>new document</mwc-button>
      `
    }

    const doc = this.currentDocument

    /* If there is a selected document (from the hash) */
    return html`
    <header id="topbar" style="display:flex;align-items:center">
      <mwc-icon-button icon="arrow_back"
        @click=${() => window.location.hash = ''}></mwc-icon-button>
      <input style="flex:1;margin:0 6px;" value=${doc.title}
        @click=${e => { if (e.target.value === 'Untitled Document') e.target.select() }}
        @keyup=${e => this.onTitleKeyup(e)}>
      <mwc-icon-button icon="search" @click=${() => this._quickSearch.open()}></mwc-icon-button>
      <mwc-icon-button icon="lock" @click=${() => this._locked = !this._locked}></mwc-icon-button>
      <mwc-icon-button icon="settings"></mwc-icon-button>
      <!-- <mwc-button dense icon="search" @click=${() => this._quickSearch.open()}>quick</mwc-button>
      <mwc-button dense icon="lock" @click=${() => this._locked = !this._locked} style="">lock</mwc-button>
      <mwc-button dense icon="settings">settings</mwc-button> -->
    </header>

    <textarea ?hide=${this._locked} ?disabled=${this._locked} .value=${doc.content} style="flex:1"
      @keyup=${e => this.onTextAreaChange(e)}></textarea>
    <div ?hide=${!this._locked} style="flex:1;font-size:1.7em;overflow-y:scroll" id="textContainer">
      <span style="white-space:pre-wrap">${this._documents}</span>
    </div>

    <div ?hide=${!this._selected} style="margin-bottom:10px;font-size:2em;padding-left:8px;color:white;background-color:grey">${this._selected}</div>

    <search-panel .query=${this._selected}></search-panel>

    <quick-search></quick-search>
    `
  }

  private onTextAreaChange(e: any) {
    this.currentDocument!.content = e.target.value;
    this.save();
  }

  private onTitleKeyup(e: any) {
    this.currentDocument!.title = e.target.value;
    this.save()
  }

  private onNewDocumentClick() {
    const doc: Document = {
      id: this.nextId,
      title: 'Untitled Document',
      content: ''
    }

    this._documents.push(doc)

    window.location.hash = doc.id.toString();

    this.save()
  }

  private get nextId () {
    const ids =  this._documents.map(d => d.id).sort((a, b) => a - b)
    if (ids.length === 0) return 0;
    let id = 0;
    while (ids.includes(id))
      id++
    return id;
  }

  private save () {
    localStorage.setItem('documents', JSON.stringify(this._documents))
  }

  // private onTextAreaChange() {
  //   this._documents = this._textarea.value;
  //   localStorage.setItem('text', this._documents)
  // }
}