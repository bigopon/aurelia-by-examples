import { bindable, BindingMode, customElement } from "@aurelia/runtime-html";
import { html } from "../html.js";
import { TextEditor } from "./text-editor.js";

@customElement({
  name: 'inline-editor',
  template:
    html<InlineComponentEditor>`<template style="display: flex;">
      <text-editor lang="html" value.bind="${e => e.template}" style="width: 48%; outline: 1px solid grey;"></text-editor>
      <div style="margin: 0 calc(2% - 4px); width: 4px; background: black"></div>
      <text-editor value.bind="${e => e.code}" style="width: 48%; outline: 1px solid grey;"></text-editor>
    </template>`,
  dependencies: [TextEditor]
})
export class InlineComponentEditor {
  @bindable({ mode: BindingMode.twoWay }) code: string = '';
  @bindable({ mode: BindingMode.twoWay }) template: string = '';
}
