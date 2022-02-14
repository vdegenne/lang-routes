import { Dialog } from '@material/mwc-dialog';
import { html, LitElement, nothing, render } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import '@material/mwc-textarea'
import { TextArea } from '@material/mwc-textarea';
import { Button } from '@material/mwc-button';

@customElement('tag-dialog')
export class TagDialog extends LitElement {
  private dialog: Dialog;

  @state()
  public type: 'add'|'edit' = 'add';

  @state()
  private tagValue = ''

  // @query('mwc-dialog') dialog!: Dialog;
  @query('mwc-textarea') textarea!: TextArea;

  constructor () {
    super()
    this.dialog = new Dialog
  }

  protected render(): unknown {
    if (window.app.currentDocument === undefined) {
      return this.dialog
    }

    this.dialog.heading = `${this.type} tag`
    const alreadyExist = window.app.currentDocument!.content.includes(this.tagValue)

    render(html`
      <mwc-textarea style="width:100%;--mdc-text-field-label-ink-color:red" dialogInitialFocus
        rows=12
        helperPersistent
        helper=${alreadyExist ? 'already exists' : ' '}
        @keyup=${(e: KeyboardEvent) => { this.onTextAreaKeyup(e) }}
        value=${this.tagValue}
      ></mwc-textarea>

      <mwc-button outlined slot="secondaryAction" dialogAction="close">cancel</mwc-button>
      <mwc-button unelevated slot="primaryAction"
        ?disabled=${!this.tagValue || alreadyExist}
        @click=${() => { this.submit() }}>${this.type}</mwc-button>
    `,
    this.dialog)


    return this.dialog
  }

  private submit() {
    window.app.currentDocument!.content.push(this.tagValue);
    this.tagValue = ''
    this.dialog.close()
    window.app.save()
    window.app.requestUpdate()
  }

  private onTextAreaKeyup(e: KeyboardEvent) {
    const button = this.shadowRoot!.querySelector<Button>('mwc-button[slot=primaryAction]')!
    if (e.ctrlKey && e.key === 'Enter' && this.tagValue !== '' && !button.disabled) {
      button.click()
      return
    }
    // We verify the tag doesn't already exist
    this.tagValue = this.textarea.value
  }

  open () {
    this.requestUpdate()
    this.dialog.show()
  }
}