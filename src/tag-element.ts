import { css, html, LitElement } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import '@material/mwc-menu'
import { Menu } from '@material/mwc-menu';
import '@material/mwc-icon'
import { googleImagesSearch } from './util';

const tags: TagElement[] = []

@customElement('tag-element')
export class TagElement extends LitElement {
  @property() content = '';
  @property({ type: Boolean, reflect: true })
  public selected = false;

  @query('mwc-menu') menu!: Menu;

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
  `

  render() {
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
      <li divider role="separator" padded></li>
      <mwc-list-item graphic=icon
          @click=${()=>{window.app.editTag(this.content)}}>
        <span>edit</span>
        <mwc-icon slot=graphic>edit</mwc-icon>
      </mwc-list-item>
      <mwc-list-item graphic=icon style="color:red"
          @click=${()=>{window.app.deleteTag(this.content)}}>
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