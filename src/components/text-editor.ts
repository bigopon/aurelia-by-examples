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

  onChange: (editor: CodeMirror.Editor, change: CodeMirror.EditorChange) => void = (editor, changeEVent) => {
    this.value = editor.getValue();
  };

  /* lifecycle */
  bound() {
    const view = this.editor = CodeMirror(this.host, {
      value: this.value,
      mode: this.lang === 'js' ? 'javascript' : 'text/html',
      lineNumbers: true,
    });
    view.on('change', this.onChange);
  }

  /* lifecycle */
  unbinding() {
    this.editor?.off('change', this.onChange);
  }

  valueChanged(v: string) {
    if (this.editor?.getValue() !== v) {
      this.editor?.setValue(v);
    }
  }

  focus() {
    this.editor?.refresh();
    this.editor?.focus();
  }
}
