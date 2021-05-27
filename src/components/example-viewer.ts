import { bindable, customElement, ValueConverter } from "@aurelia/runtime-html";
import { html } from "../html.js";
import type { IExample } from "../interfaces";
import { InlineComponentEditor } from "./component-editor.js";
import { ResultViewer } from "./result-viewer.js";

@customElement({
  name: 'example-viewer',
  template:
  html<ExampleViewer>`<template style="display: flex; flex-direction: column">
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
      toView(v: unknown) {
        return v instanceof Promise ? v : Promise.resolve(v);
      }
    })
  ]
})
export class ExampleViewer {
  @bindable title: string = '';

  @bindable example: IExample | Promise<IExample> | undefined = void 0;
}
