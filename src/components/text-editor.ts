/// <reference types="codemirror" />
import { customElement, bindable, BindingMode } from "@aurelia/runtime-html";

declare global {
  const CodeMirror: typeof import('codemirror');
}

@customElement({
  name: 'text-editor',
  template: '<template ref=host style="display: block;">'
})
export class TextEditor {

  @bindable({ mode: BindingMode.twoWay }) value: string = '';
  @bindable lang: 'html' | 'js' = 'js';

  host!: HTMLElement;
  editor?: CodeMirror.Editor;

  bound() {
    const view = this.editor = CodeMirror(this.host, {
      value: this.value,
      mode: this.lang === 'js' ? 'javascript' : 'text/html',
      lineNumbers: true,
      extraKeys: { "Ctrl-Q": "toggleComment" },
    });
    view.on('change', (editor, changeEVent) => {
      this.value = editor.getValue();
    });
  }

  valueChanged(v: string) {
    if (this.editor?.getValue() !== v) {
      this.editor?.setValue(v);
    }
  }
}
