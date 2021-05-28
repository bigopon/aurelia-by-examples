import { __decorate } from "tslib";
import { bindable, BindingMode, customElement } from "@aurelia/runtime-html";
import { html } from "../html.js";
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
        template: html `<template style="display: flex;">
      <text-editor lang="html" value.bind="${e => e.template}" style="flex: 1 0 48%; outline: 1px solid grey;"></text-editor>
      <div style="margin: 0 calc(2% - 4px); width: 4px; background: black"></div>
      <text-editor value.bind="${e => e.code}" style="flex: 1 0 48%; outline: 1px solid grey;"></text-editor>
    </template>`,
        dependencies: [TextEditor]
    })
], InlineComponentEditor);
export { InlineComponentEditor };
