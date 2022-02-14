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
    display: inline-block;
    padding: 2px 6px;
    border-radius: 2px;
    box-shadow: 2px 2px 7px -3px #0000004f;
    cursor: pointer;
    background-color: #37474f;
    color: white;
    margin: 4px;
  }

  :host([selected]) {
    background-color: yellow;
    color: black;
  }
  `

  protected render() {
    return html`${this.content}`
  }

  protected firstUpdated(_changedProperties: Map<string | number | symbol, unknown>): void {
    this.addEventListener('click', (e) => {
      tags.forEach(el => el.selected = false)
      this.selected = true;
      window.app.requestUpdate()
      e.stopPropagation()
    })
  }
}

window.document.body.addEventListener('click', () => {
  tags.forEach(el => el.selected = false)
  window.app.requestUpdate()
})