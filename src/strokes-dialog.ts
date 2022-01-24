import { Dialog } from '@material/mwc-dialog';
import { html, LitElement } from 'lit';
import { customElement, query, queryAll, state } from 'lit/decorators.js';
import '@material/mwc-circular-progress'
import { CircularProgress } from '@material/mwc-circular-progress';

declare global {
  interface Window {
  }
}

@customElement('strokes-dialog')
export class StrokesDialog extends LitElement {
  @state () private query = ''
  @state () private loading = true

  @query('mwc-dialog') dialog!: Dialog;
  @query('mwc-circular-progress') progress!: CircularProgress;
  @queryAll('img') imgs!: HTMLImageElement[];

  render () {
    return html`
    <mwc-dialog heading="Strokes" style="text-align:center">
      ${this.query.split('').map(letter => html`<img src="https://assiets.vdegenne.com/data/chinese/img/${letter}.gif">`)}
      <br>
      <mwc-circular-progress indeterminate></mwc-circular-progress>
      <mwc-button outlined slot="secondaryAction" dialogAction="close">close</mwc-button>
    </mwc-dialog>
    `
  }

  protected updated(_changedProperties: Map<string | number | symbol, unknown>): void {
    this.progress.indeterminate = true
    Promise.all(
      [...this.imgs].filter(el => !el.complete).map(el => new Promise((resolve, reject) => {
        el.onload = resolve
        el.onerror = reject
      }))
    ).finally(() => this.progress.indeterminate = false)
  }

  open(query: string) {
    this.query = query
    this.dialog.show()
  }
}