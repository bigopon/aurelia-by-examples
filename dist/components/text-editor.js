import { __decorate } from "tslib";
/// <reference types="codemirror" />
import { customElement, bindable, BindingMode } from "@aurelia/runtime-html";
let TextEditor = class TextEditor {
    constructor() {
        this.value = '';
        this.lang = 'js';
        this.onChange = (editor, changeEVent) => {
            this.value = editor.getValue();
        };
    }
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
    valueChanged(v) {
        if (this.editor?.getValue() !== v) {
            this.editor?.setValue(v);
        }
    }
    focus() {
        this.editor?.refresh();
        this.editor?.focus();
    }
};
__decorate([
    bindable({ mode: BindingMode.twoWay })
], TextEditor.prototype, "value", void 0);
__decorate([
    bindable
], TextEditor.prototype, "lang", void 0);
TextEditor = __decorate([
    customElement({
        name: 'text-editor',
        template: '<template ref=host style="display: block;">'
    })
], TextEditor);
export { TextEditor };
