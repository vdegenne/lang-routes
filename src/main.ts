import { css, html, LitElement } from 'lit'
import { customElement, property as state, query } from 'lit/decorators.js'
import '@material/mwc-button'
import '@material/mwc-icon-button'
import '@material/mwc-icon-button-toggle'
import { getSelection, jishoSearch, naverHanjaSearch, naverJapSearch, presearchHanjaPage } from './util'
import './quick-search'
import { QuickSearch } from './quick-search'
import './search-panel'
import { Document } from './types'
import { SearchPanel } from './search-panel'
import { live } from 'lit/directives/live.js'
import './settings-dialog'
import './global-declarations'
import { TagElement } from './tag-element'
import { TextField } from '@material/mwc-textfield'
import { hasChinese, isFullJapanese } from 'asian-regexps'
import html2canvas from 'html2canvas'


@customElement('lang-routes')
export class LangRoutes extends LitElement {
  @state()
  private _locked = true;

  @state()
  private _documents: Document[] = []

  @state()
  private query = ''

  private history: string[] = localStorage.getItem('lang-routes:history') ? JSON.parse(localStorage.getItem('lang-routes:history')!.toString()) : []

  @query('mwc-textfield') textfield!: TextField;
  @query('#textContainer') _textContainer!: HTMLParagraphElement;
  @query('tag-element[selected]') selectedTagElement!: TagElement;
  @query('#history') historyBox!: HTMLDivElement;
  @query('search-panel') searchPanel!: SearchPanel;

  constructor() {
    super()

    this.load()

    window.addEventListener('hashchange', (e) => {
      this.requestUpdate()
    })

    window.addEventListener('keydown', (e) => {
      if (e.composedPath()[0] instanceof HTMLTextAreaElement
        || e.composedPath()[0] instanceof HTMLInputElement) {
        return;
      }
      if (window.quickSearch.opened) {
        window.quickSearch.searchPanel.sendKey(e.key)
      }
      else {
        this.searchPanel.sendKey(e.key)
      }
    })
  }

  public get currentDocument () {
    if (window.location.hash.slice(1) === '') return undefined
    return this._documents.find(d => parseInt(window.location.hash.slice(1)) === d.id)
  }

  firstUpdated() {
    // const selectFunction = () => {
    //   if (this._locked && this.currentDocument && !window.quickSearch._dialog.open) {
    //     const selection = getSelection().trim()
    //     if (selection) {
    //       this._selected = selection
    //     }
    //   }
    // }
    // setInterval(selectFunction, 500)
    // this._textContainer.addEventListener('mouseup', selectFunction)
    // this._textContainer.addEventListener('touchend', selectFunction)
    // window.addEventListener('pointerup', e => {
    //   this._selected = getSelection()
    // })
    // this._textarea.addEventListener('selectstart', e => alert('select start !!!!'))

    window.addEventListener('keyup', (e) => {
      if (e.key === 'Enter' && this._locked && this.query !== '') {
        // (this.shadowRoot!.querySelector('search-panel') as SearchPanel).openFirstSearch()
      }
    })
  }

  static styles = [
    css`
    :host {
      display: block;
      /* display: flex;
      flex-direction: column; */
      /* align-items: center; */
      /* width:-webkit-fill-available; */
      height: 85%;
      max-width: 682px;
      margin: 0 auto;
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
      background-color: black;
      color: white;
      outline:none;
      border: 0px;
    }

    #tags {
      display: inline-block;
      overflow: auto;
      width: 100%;
      padding: 22px 0 0 22px;
      border-bottom: 1px solid #e0e0e0bb;
      box-sizing: border-box;
    }

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
  ]

  public loadDocument (document: Document) {
    window.location.hash = document.id.toString()
    this._locked = document.content.length === 0
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

    let doc = this.currentDocument
    if (!(doc.content instanceof Array)) {
      doc.content = [doc.content]
    }

    console.log(`rendered : ${this.query}`)

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
        <mwc-icon-button icon="search" @click=${() => window.quickSearch.open()}></mwc-icon-button>
        <mwc-icon-button icon="settings"
          @click=${() => window.settingsDialog.show()}></mwc-icon-button>
      </div>
    </header>

    <center style="margin:12px">
    <mwc-button raised icon="label" dense
      @click=${() => { window.tagDialog.open() }}>add a tag</mwc-button>
    </center>

    <div id="tags" style="height:${window.settingsDialog.maxHeight}px">
    ${doc.content.map(tag => {
      return html`<tag-element content=${tag}
        @click=${async (e) => { this.query = tag; await this.updateComplete; this.search() }}></tag-element>`
    })}
    </div>

    <!-- <div ?hide=${!this._locked} style="overflow-y:scroll;font-size:${window.settingsDialog.fontSize}px" id="textContainer">
      <span style="white-space:pre-wrap">${doc.content}</span>
    </div> -->

    <div style="display:flex;align-items:flex-start">
      <mwc-textfield placeholder="search" style="flex:1"
        helperPersistent
        value=${live(this.query)}
        @keyup=${(e) => { this.onTextFieldKeyup(e) }}
        ></mwc-textfield>
      <mwc-icon-button icon="close" style="margin:6px"
        @click=${() => { this.onCloseIconClick() }}></mwc-icon-button>
    </div>

    <search-panel .query=${live(this.query)}></search-panel>

    <div style="display:flex;align-items:center;justify-content:space-between;margin-top:24px">
      <p style="font-weight:bold">History</p>
      <div style="flex:1"></div>
      <mwc-icon-button icon="delete"
          ?hide=${!this.query || !this.history.includes(this.query)}
          @click=${() => { this.history.splice(this.history.indexOf(this.textfield.value), 1); this.saveHistory() }}></mwc-icon-button>
      <mwc-icon-button icon="download" @click=${() => { this.downloadHistory() }}></mwc-icon-button>
    </div>
    <div id=history>
      ${this.history.filter(el => el).map((q) => {
        return html`<span class=query @click=${async () => { if (this.query !== q) { this.query = q; await this.updateComplete; this.search()} }} ?selected=${this.query === q}>${q}</span>`
      })}
    </div>
    `
  }

  async search () {
    const query = this.textfield.value;
    if (query === '') { return }
    this.addToHistory(query)
    if (isFullJapanese(query) && hasChinese(query)) {
      this.textfield.helper = ''
      if (query in window.dataManager.flats) {
        this.textfield.helper = window.dataManager.flats[query]
      }
      else {
        // if (this._flattenDebouncer) {
        //   clearTimeout(this._flattenDebouncer)
        //   this._flattenDebouncer = undefined
        // }
        // this._flattenDebouncer = setTimeout(async () => {
          try {
            const response = await fetch(`https://assiets.vdegenne.com/data/japanese/flatten/${query}`)
            if (response.status !== 200) {
              throw new Error()
            }
            const content = await response.text()
            this.textfield.helper = content
            window.dataManager.flats[query] = content
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

  // private onSearchClick() {
  //   const tagEl = this.selectedTagElement
  //   if (tagEl) {
  //     window.quickSearch.query = tagEl.content;
  //     window.quickSearch.search()
  //   }
  //   window.quickSearch.open()
  // }

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
    if (this.textfield.value === '') { return }
    if (e.key === 'Enter') {
      this.search()
      this.textfield.blur()
      this.searchPanel.openFirstSearch()
      return;
    }
    this.onTextFieldChange()
    this.searchPanel.closeAllMenus()
  }

  private onCloseIconClick() {
    this.query = ''
    // this.textfield.value = ''
    this.textfield.focus()
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
      content: []
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

  public addToHistory(query: string) {
    this.history = [...new Set([query].concat(this.history))]
    this.saveHistory()
  }

  private async load () {
    // Try to get the data remotely
    try {
      this._documents = await (await fetch('/data')).json()
    } catch (e) {
      this._documents = JSON.parse(localStorage.getItem('documents') || '[]')
    }
  }

  public save () {
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

  private saveHistory () {
    localStorage.setItem('lang-routes:history', JSON.stringify(this.history))
    this.requestUpdate()
  }

  async downloadHistory () {
    const canvas = await html2canvas(this.historyBox)
    const anchor = document.createElement('a')
    anchor.href = canvas.toDataURL()
    anchor.download = 'history.png'
    anchor.click()
  }

  // private onTextAreaChange() {
  //   this._documents = this._textarea.value;
  //   localStorage.setItem('text', this._documents)
  // }
}