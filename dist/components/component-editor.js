import { __decorate } from "tslib";
import { bindable, BindingMode, customElement } from "@aurelia/runtime-html";
import { TextEditor } from "./text-editor.js";
let InlineComponentEditor = class InlineComponentEditor {
    constructor() {
        this.code = '';
        this.template = '';
    }
};
__decorate([
    bindable({ mode: BindingMode.twoWay })
], InlineComponentEditor.prototype, "code", void 0);
__decorate([
    bindable({ mode: BindingMode.twoWay })
], InlineComponentEditor.prototype, "template", void 0);
InlineComponentEditor = __decorate([
    customElement({
        name: 'inline-editor',
        template: [
            '<template style="display: flex;">',
            '<text-editor value.bind="code" style="flex: 1 0 48%; border: 1px solid grey;"></text-editor>',
            '<div style="margin: 0 calc(2% - 6px); width: 6px; background: black"></div>',
            '<text-editor lang="html" value.bind="template" style="flex: 1 0 48%; border: 1px solid grey;"></text-editor>',
            '</template>'
        ].join('\n'),
        dependencies: [TextEditor]
    })
], InlineComponentEditor);
export { InlineComponentEditor };
