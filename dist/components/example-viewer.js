import { __decorate } from "tslib";
import { bindable, customElement, ValueConverter } from "@aurelia/runtime-html";
import { html } from "../html.js";
import { InlineComponentEditor } from "./component-editor.js";
import { ResultViewer } from "./result-viewer.js";
let ExampleViewer = class ExampleViewer {
    constructor() {
        this.title = '';
        this.example = void 0;
    }
};
__decorate([
    bindable
], ExampleViewer.prototype, "title", void 0);
__decorate([
    bindable
], ExampleViewer.prototype, "example", void 0);
ExampleViewer = __decorate([
    customElement({
        name: 'example-viewer',
        template: html `<template style="display: flex; flex-direction: column">
    <p>\${${viewer => viewer.title}}</p>
    <template promise.bind="example | resolve">
      <template then.from-view="$data">
        <inline-editor code.bind="$data.code.script" template.bind="$data.code.template"></inline-editor>
        <result-viewer code.bind="$data.code.script" template.bind="$data.code.template"></result-viewer>
      </template>
    </template>
  `,
        dependencies: [
            InlineComponentEditor,
            ResultViewer,
            ValueConverter.define('resolve', class Resolve {
                toView(v) {
                    return v instanceof Promise ? v : Promise.resolve(v);
                }
            })
        ]
    })
], ExampleViewer);
export { ExampleViewer };
