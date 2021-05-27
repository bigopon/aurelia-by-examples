import { __decorate } from "tslib";
/// <reference types="codemirror" />
import { customElement, bindable, BindingMode } from "@aurelia/runtime-html";
let TextEditor = class TextEditor {
    constructor() {
        this.value = '';
        this.lang = 'js';
    }
    bound() {
        const view = this.editor = CodeMirror(this.host, {
            value: this.value,
            mode: this.lang === 'js' ? 'javascript' : 'text/html',
            lineNumbers: true,
            // @ts-ignore
            matchBrackets: true,
            continueComments: "Enter",
            extraKeys: { "Ctrl-Q": "toggleComment" },
        });
        view.on('change', (editor, changeEVent) => {
            this.value = editor.getValue();
        });
    }
    valueChanged(v) {
        if (this.editor?.getValue() !== v) {
            this.editor?.setValue(v);
        }
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
