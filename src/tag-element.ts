import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

const tags: TagElement[] = []

@customElement('tag-element')
export class TagElement extends LitElement {
  @property()
  public content = '';

  @property({ type: Boolean, reflect: true })
  public selected = false;

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
  }

  :host([selected]) {
    background-color: yellow !important;
    color: black !important;
  }
  `

  protected render() {
    return html`${this.content}`
  }


  protected firstUpdated(_changedProperties: Map<string | number | symbol, unknown>): void {
    this.addEventListener('click', (e) => {
      deselectAllTag()
      // tags.forEach(el => el.selected = false)
      this.selected = true;
      window.app.requestUpdate()
      e.stopPropagation()
    })
  }
}

export function deselectAllTag () {
  tags.forEach(el=>el.selected=false)
}

// window.document.body.addEventListener('click', () => {
//   tags.forEach(el => el.selected = false)
//   window.app.requestUpdate()
// })