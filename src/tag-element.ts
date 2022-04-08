import { css, html, LitElement } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import '@material/mwc-menu'
import { Menu } from '@material/mwc-menu';
import '@material/mwc-icon'
import { googleImagesSearch, jisho } from './util';

const tags: TagElement[] = []

@customElement('tag-element')
export class TagElement extends LitElement {
  @property() private _content = '';
  @property({ type: Boolean, reflect: true })
  public selected = false;
  @property({reflect:true}) group = '0'

  @query('mwc-menu') menu!: Menu;

  set content (value: string) {
    this._content = value;
  }
  get content () {
    return this._content.replace(/^([0-9]*):/, '')
  }

  constructor () {
    super()
    tags.push(this)
  }

  static styles = css`
  :host {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 3px 8px;
    margin: 3px;
    background-color: #6a1b9a;
    font-size: 16px;
    font-weight: 300;
    color: white;
    cursor: pointer;
    border-radius: 4px;
    /* box-shadow: rgb(0 0 0 / 31%) 2px 2px 7px -3px; */
    position: relative;
  }

  :host([selected]) {
    background-color: yellow !important;
    color: black !important;
  }
  :host([group="1"]) { background-color: #ffc107 }
  :host([group="2"]) { background-color: #4caf50 }
  :host([group="3"]) { background-color: #3f51b5 }
  :host([group="4"]) { background-color: #f44336 }
  `

  render() {
    const groupRE = this._content.match(/^([0-9]*):/)
    if (groupRE) {
      this.group = groupRE[1]
    }

    return html`
    <mwc-menu fixed @click=${e=>{e.stopImmediatePropagation()}}>
      <mwc-list-item noninteractive>
        <span>${this.content}</span>
      </mwc-list-item>
      <li divider role="separator"></li>
      <mwc-list-item graphic=icon @click=${()=>{googleImagesSearch(this.content)}}>
        <span>Google Images</span>
        <mwc-icon slot=graphic>image</mwc-icon>
      </mwc-list-item>
      <mwc-list-item graphic=icon
          @click=${()=>{jisho(this.content)}}>
        <span>jisho</span>
        <img src="./img/jisho.ico" slot=graphic>
      </mwc-list-item>
      <li divider role="separator" padded></li>
      <mwc-list-item graphic=icon
          @click=${()=>{window.app.editTag(this._content)}}>
        <span>edit</span>
        <mwc-icon slot=graphic>edit</mwc-icon>
      </mwc-list-item>
      <mwc-list-item graphic=icon style="color:red"
          @click=${()=>{window.app.deleteTag(this._content)}}>
        <span>delete</span>
        <mwc-icon slot=graphic style="color:red">delete</mwc-icon>
      </mwc-list-item>
    </mwc-menu>
    ${this.content}`
  }


  protected firstUpdated(_changedProperties: Map<string | number | symbol, unknown>): void {
    this.addEventListener('contextmenu', (e) => { e.preventDefault() })
    this.addEventListener('pointerdown', (e) => {
      e.preventDefault()
      if (e.button == 2) {
        this.menu.show()
      }
      return
      deselectAllTag()
      // tags.forEach(el => el.selected = false)
      this.selected = true;
      window.app.requestUpdate()
      e.stopPropagation()
    })

    this.menu.anchor = this
  }
}

export function deselectAllTag () {
  tags.forEach(el=>el.selected=false)
}

// window.document.body.addEventListener('click', () => {
//   tags.forEach(el => el.selected = false)
//   window.app.requestUpdate()
// })