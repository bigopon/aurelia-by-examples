import { bindable, BindingMode, customElement } from "@aurelia/runtime-html";
import { html } from "../html.js";
import { TextEditor } from "./text-editor.js";

@customElement({
  name: 'inline-editor',
  template:
    html<InlineComponentEditor>`<template style="display: flex;" css="flex-direction: $\{${c => c.layout === 'v' ? 'column' : 'row'}}">
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
export class InlineComponentEditor {
  @bindable({ mode: BindingMode.twoWay }) code: string = '';
  @bindable({ mode: BindingMode.twoWay }) template: string = '';
  @bindable({
    set: v => v === 'v' || v === 'h' ? v : (() => { throw new Error('Invalid layout value') })()
  })
  layout: 'v' | 'h' = 'h';
}
