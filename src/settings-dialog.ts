import { css, html, LitElement, nothing } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import '@material/mwc-slider'
import { Dialog } from '@material/mwc-dialog';

@customElement('settings-dialog')
export class SettingsDialog extends LitElement {
  @state()
  public fontSize: number = 12;

  @query('mwc-dialog') dialog!: Dialog;

  static styles = css`
  mwc-slider {
    /* margin-top: 32px; */
      margin: 12px 0;
  }
  `

  constructor () {
    super();
    const settings = JSON.parse(localStorage.getItem('settings') || '{}')
    if (Object.getOwnPropertyNames(settings).length !== 0) {
      this.fontSize = settings.fontSize
    }
  }

  render () {
    return html`
    <mwc-dialog heading="Settings">
      <div>
        <span>Font size (${this.fontSize}px)</span>
        <mwc-slider
          value=${this.fontSize}
          min="12"
          max="70"
          @input=${(e) => this.onSliderInput(e)}
        >
        </mwc-slider>
      </div>
      <mwc-button outlined slot="primaryAction" dialogAction="close">close</mwc-button>
    </mwc-dialog>
    `
  }

  protected firstUpdated(_changedProperties: Map<string | number | symbol, unknown>): void {
      this.shadowRoot!.querySelector('mwc-dialog')!.addEventListener('opened', () => {
        this.shadowRoot!.querySelector('mwc-slider')!.layout()
      })
  }

  private onSliderInput(e) {
    this.fontSize = e.detail.value;
    window.app.requestUpdate()
    this.save()
  }

  public async show() {
    this.dialog.show()
  }

  private save () {
    localStorage.setItem('settings', JSON.stringify({
      fontSize: this.fontSize
    }))
  }
}