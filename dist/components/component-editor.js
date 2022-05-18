import { __decorate } from "tslib";
import { BindingMode } from "@aurelia/runtime";
import { bindable, customElement } from "@aurelia/runtime-html";
import { html } from "../html.js";
import { TextEditor } from "./text-editor.js";
let InlineComponentEditor = class InlineComponentEditor {
    constructor() {
        this.code = '';
        this.template = '';
        this.layout = 'h';
    }
};
__decorate([
    bindable({ mode: BindingMode.twoWay })
], InlineComponentEditor.prototype, "code", void 0);
__decorate([
    bindable({ mode: BindingMode.twoWay })
], InlineComponentEditor.prototype, "template", void 0);
__decorate([
    bindable({
        set: v => v === 'v' || v === 'h' ? v : (() => { throw new Error('Invalid layout value'); })()
    })
], InlineComponentEditor.prototype, "layout", void 0);
InlineComponentEditor = __decorate([
    customElement({
        name: 'inline-editor',
        template: html `<template style="display: flex;" css="flex-direction: $\{${c => c.layout === 'v' ? 'column' : 'row'}}">
      <text-editor lang="html" value.bind="${e => e.template}" style="outline: 1px solid grey;"
        width.style="layout === 'h' ? '48%' : '100%'"></text-editor>
      <div style="background: black"
        css="height: \${layout === 'v' ? '2px' : ''};
          margin: \${layout === 'v' ? '4px 0' : 'calc(2% - 4px)'};
          width: \${layout === 'v' ? '100%' : '4px'}"></div>
      <text-editor value.bind="${e => e.code}" style="outline: 1px solid grey;"
        width.style="layout === 'h' ? '48%' : '100%'"></text-editor>
    </template>`,
        dependencies: [TextEditor]
    })
], InlineComponentEditor);
export { InlineComponentEditor };
