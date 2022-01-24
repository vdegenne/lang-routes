import { css, html, LitElement } from 'lit'
import { customElement, property as state, query } from 'lit/decorators.js'
import '@material/mwc-button'
import '@material/mwc-icon-button'
import '@material/mwc-icon-button-toggle'
import { getSelection, googleImagesSearch, jishoSearch, naverHanjaSearch, naverJapSearch, presearchHanjaPage } from './util'
import './quick-search'
import { QuickSearch } from './quick-search'
import './search-panel'
import { Document } from './types'
import { SearchPanel } from './search-panel'
import { live } from 'lit/directives/live.js'
import './settings-dialog'
import './global-declarations'


@customElement('lang-routes')
export class LangRoutes extends LitElement {
  @state()
  private _locked = true;

  @state()
  private _documents: Document[] = []

  @state()
  private _selected = ''

  @query('textarea') _textarea!: HTMLTextAreaElement;
  @query('#textContainer') _textContainer!: HTMLParagraphElement;
  @query('quick-search') _quickSearch!: QuickSearch;
  @query('search-panel') searchPanel!: SearchPanel;

  constructor() {
    super()

    this.load()

    window.addEventListener('hashchange', (e) => {
      this.requestUpdate()
    })
  }

  public get currentDocument () {
    if (window.location.hash.slice(1) === '') return undefined
    return this._documents.find(d => parseInt(window.location.hash.slice(1)) === d.id)
  }

  firstUpdated() {
    const selectFunction = () => {
      if (this._locked && this.currentDocument && !this._quickSearch._dialog.open) {
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

    window.addEventListener('keyup', (e) => {
      if (e.key === 'Enter' && this._locked && this._selected !== '') {
        (this.shadowRoot!.querySelector('search-panel') as SearchPanel).openFirstSearch()
      }
    })
  }

  static styles = [
    css`
    :host {
      display: flex;
      flex-direction: column;
      /* align-items: center; */
      /* width:-webkit-fill-available; */
      height: 85%;
      --mdc-theme-primary: black;
    }
    [hide] {
      display:none;
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

    header {
      display: flex;
      justify-content: space-between;
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
      flex: 1;
      padding: 6px;
      margin: 6px;
      resize: vertical;
      font-family: Roboto;
      /* background-color: grey; */
    }

    #textContainer {
      flex:1;
      padding: 12px 0 12px 18px;
      border: 1px solid #e0e0e0;
      /* background-color: grey; */
    }

    #selectInput {
      margin-bottom: 10px;
      padding: 8px;
      /* padding-left: 8px; */
      font-size: 2em;
      background-color: grey;
      color: white;
      outline:none;
      border: 0px;
    }
    `
  ]

  public loadDocument (document: Document) {
    window.location.hash = document.id.toString()
    this._locked = document.content !== ''
  }

  render () {
    if (this.currentDocument === undefined) {
      return html`
      ${this._documents.map(d => {
        return html`<div class="document"
          @click=${() => this.loadDocument(d)}><mwc-icon>description</mwc-icon><span>${d.title}</span></div>`
      })}
      <mwc-button unelevated icon="add"
        @click=${() => this.createNewDocument()}>new document</mwc-button>
      `
    }

    const doc = this.currentDocument

    /* If there is a selected document (from the hash) */
    return html`
    <header id="topbar">
      <div style="display:flex;align-items:center;flex:1">
        <mwc-icon-button icon="arrow_back"
          @click=${() => window.location.hash = ''}></mwc-icon-button>
        <input .value=${live(doc.title)} style="max-width:134px;"
          @click=${e => { if (e.target.value === 'Untitled Document') e.target.select() }}
          @keyup=${e => this.onTitleKeyup(e)}>
      </div>
      <div style="display:flex">
        <mwc-icon-button icon="note_add"
          @click=${() => this.createNewDocument()}></mwc-icon-button>
        <mwc-icon-button icon="search" @click=${() => this._quickSearch.open()}></mwc-icon-button>
        <mwc-icon-button-toggle onIcon="lock" offIcon="lock_open" @click=${() => {this._locked = !this._locked; if (!this._locked) { setTimeout(() => this._textarea.focus(), 100) }}} style="color:${this._locked ? 'green': 'red'}" ?on=${this._locked}></mwc-icon-button-toggle>
        <mwc-icon-button icon="settings"
          @click=${() => window.settingsDialog.show()}></mwc-icon-button>
      </div>
      <!-- <mwc-button dense icon="search" @click=${() => this._quickSearch.open()}>quick</mwc-button>
      <mwc-button dense icon="lock" @click=${() => this._locked = !this._locked} style="">lock</mwc-button>
      <mwc-button dense icon="settings">settings</mwc-button> -->
    </header>

    <textarea ?hide=${this._locked} ?disabled=${this._locked} .value=${doc.content} style="font-size:${window.settingsDialog.fontSize}px"
      @keyup=${e => this.onTextAreaChange(e)} placeholder="empty"></textarea>
    <div ?hide=${!this._locked} style="overflow-y:scroll;font-size:${window.settingsDialog.fontSize}px" id="textContainer">
      <span style="white-space:pre-wrap">${doc.content}</span>
    </div>

    <input id="selectInput" ?hide=${!this._selected} .value=${live(this._selected)}
      @keyup=${(e) => { this.searchPanel.query = e.target.value }}>

    <search-panel .query=${live(this._selected)}></search-panel>

    <quick-search></quick-search>
    `
  }

  private _textAreaDebouncer?: NodeJS.Timeout;
  private onTextAreaChange(e: any) {
    this.currentDocument!.content = e.target.value;
    if (this._textAreaDebouncer !== undefined) {
      clearTimeout(this._textAreaDebouncer)
      this._textAreaDebouncer = undefined
    }

    this._textAreaDebouncer = setTimeout(() => {
      this.save();
    }, 1000)
  }

  private _titleUpdateDebouncer?: NodeJS.Timeout;
  private onTitleKeyup(e: any) {
    this.currentDocument!.title = e.target.value;
    if (this._titleUpdateDebouncer !== undefined) {
      clearTimeout(this._titleUpdateDebouncer)
      this._titleUpdateDebouncer = undefined
    }

    this._titleUpdateDebouncer = setTimeout(() => {
      this.save()
    }, 1000)
  }

  private createNewDocument() {
    const doc: Document = {
      id: this.nextId,
      title: 'Untitled Document',
      content: ''
    }

    this._documents.push(doc)

    this.loadDocument(doc)

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

  private async load () {
    // Try to get the data remotely
    try {
      this._documents = await (await fetch('/data')).json()
    } catch (e) {
      this._documents = JSON.parse(localStorage.getItem('documents') || '[]')
    }
  }

  private save () {
    // Try to save the data remotely
    try {
      fetch('/data', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(this._documents)
      })
    }
    catch (e) {}
    // Also save locally in any case
    localStorage.setItem('documents', JSON.stringify(this._documents))
  }

  // private onTextAreaChange() {
  //   this._documents = this._textarea.value;
  //   localStorage.setItem('text', this._documents)
  // }
}