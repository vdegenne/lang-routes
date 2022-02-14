import { css, html, LitElement, nothing } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import '@material/mwc-slider'
import { Dialog } from '@material/mwc-dialog';

@customElement('settings-dialog')
export class SettingsDialog extends LitElement {
  @state()
  public fontSize: number = 12;
  @state() public maxHeight = 100;

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
    this.fontSize = settings?.fontSize || 12;
    this.maxHeight = settings?.maxHeight || 400;
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

      <div>
        <span>Tags container max-height (${this.maxHeight}px)</span>
        <mwc-slider
          value=${this.maxHeight || 400}
          min="200"
          max="900"
          @input=${(e) => { this.maxHeight = e.detail.value; window.app.requestUpdate(); this.save() }}
        >
        </mwc-slider>
      </div>
      <mwc-button outlined slot="primaryAction" dialogAction="close">close</mwc-button>
    </mwc-dialog>
    `
  }

  protected firstUpdated(_changedProperties: Map<string | number | symbol, unknown>): void {
      this.shadowRoot!.querySelector('mwc-dialog')!.addEventListener('opened', () => {
        this.shadowRoot!.querySelectorAll('mwc-slider')!.forEach(el => el.layout())
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