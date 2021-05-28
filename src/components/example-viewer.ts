import { DI } from "@aurelia/kernel";
import { bindable, customElement, ValueConverter } from "@aurelia/runtime-html";
import { html } from "../html.js";
import type { IComponentCode, IExample, ILinkExample, ILoadedLinkExample } from "../interfaces.js";
import { InlineComponentEditor } from "./component-editor.js";
import { ResultViewer } from "./result-viewer.js";

const IExampleLoader = DI.createInterface<ExampleLoader>('IExampleLoader', x => x.singleton(ExampleLoader));

@customElement({
  name: 'example-viewer',
  template:
  html<ExampleViewer>`<template style="display: block;">
    <h3
      id.bind=${v => v.example.id}
      show.bind="${v => v.example.title}">\${${v => v.example.title}}</h3>
    <p
      show.bind="${v => v.example.desc}">$\{${v => v.example.desc}}</p>
    <button if.bind="!shouldRender && !forceLoad" click.trigger="forceLoad = true">Load example</button>
    <template if.bind="shouldRender" promise.bind="example | resolve">
      <template then.from-view="$data">
        <inline-editor code.bind="$data.code.script" template.bind="$data.code.template" style="height: 300px;"></inline-editor>
        <result-viewer
          title.bind="$data.title"
          code.bind="$data.code.script"
          template.bind="$data.code.template"
          styles.bind="$data.code.styles"></result-viewer>
      </template>
      <span catch.from-view="$err">There's an error loading the example \${example.id}. Maybe try reloading.</span>
    </template>
  `,
  dependencies: [
    InlineComponentEditor,
    ResultViewer,
    ValueConverter.define('resolve', class Resolve {
      static get inject() { return [IExampleLoader]; }

      constructor(private loader: ExampleLoader) {}

      toView(v: IExample) {
        return v.type === 'inline' ? Promise.resolve(v) : this.loader.load(v);
      }
    })
  ]
})
export class ExampleViewer {
  @bindable title: string = '';

  @bindable example!: IExample;

  forceLoad = false;

  get shouldRender() {
    const { example } = this;
    return this.forceLoad || example.lazy !== true;
  }
}

class ExampleLoader {
  private cache: Record<string, ILoadedLinkExample> = Object.create(null);
  private loadingExample: Record<string, Promise<ILoadedLinkExample>> = Object.create(null);

  load(example: ILinkExample): Promise<ILoadedLinkExample> {
    const link = example.link;
    if (this.cache[link]) {
      return Promise.resolve(this.cache[link]);
    }
    if (this.loadingExample[link]) {
      return this.loadingExample[link];
    }
    return this.loadingExample[link]
      = fetch(link + '?t=' + Math.random())
      .then(r => r.ok ? r.text() : (() => { throw new Error('Unable to fetch example code') })())
      .then(text => {
        const code = this.parseExample(text);
        const loadedExample: ILoadedLinkExample = { ...example, code: code };
        delete this.loadingExample[link];
        return this.cache[link] = loadedExample;
      })
      .catch(ex => {
        delete this.loadingExample[link];
        throw ex;
      });
  }

  parseExample(code: string): IComponentCode {
    const scriptStartIdx = code.indexOf('<script>');
    const scriptEndIdx = code.indexOf('</script>');
    const script = Math.max(scriptStartIdx, scriptEndIdx, -1) > -1
      ? code.substring(scriptStartIdx + 8, scriptEndIdx).trimStart()
      : 'export class App {}';
    const styleStartIndex = code.lastIndexOf('<style>');
    const template = scriptStartIdx > -1
      ? code.substring(0, scriptStartIdx).trim()
      : styleStartIndex > -1
        ? code.substring(0, styleStartIndex)
        : code;
    const styleCode = code.substr(scriptEndIdx + 9);
    const styles: string[] = [];
    const styleParser = document.createElement('div');
    styleParser.innerHTML = `<template>${styleCode}</template>`;
    Array.from((styleParser.firstChild as HTMLTemplateElement).content.children).forEach(c => {
      if (c.tagName === 'STYLE') {
        styles.push(c.textContent || '');
      }
    });
    return { script, template, styles };
  }
}
