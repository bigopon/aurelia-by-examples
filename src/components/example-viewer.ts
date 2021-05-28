import { DI } from "@aurelia/kernel";
import { bindable, customElement, ValueConverter } from "@aurelia/runtime-html";
import { html } from "../html.js";
import type { IComponentCode, IExample, ILinkExample, ILoadedLinkExample } from "../interfaces";
import { InlineComponentEditor } from "./component-editor.js";
import { ResultViewer } from "./result-viewer.js";

const IExampleLoader = DI.createInterface<ExampleLoader>('IExampleLoader', x => x.singleton(ExampleLoader));

@customElement({
  name: 'example-viewer',
  template:
  html<ExampleViewer>`<template style="display: flex; flex-direction: column">
    <h3
      id.bind=${v => v.example.id}
      show.bind="${v => v.example.title}">\${${v => v.example.title}}</h3>
    <p
      show.bind="${v => v.example.desc}">$\{${v => v.example.desc}}</p>
    <template promise.bind="example | resolve">
      <template then.from-view="$data">
        <inline-editor code.bind="$data.code.script" template.bind="$data.code.template" style="height: 300px;"></inline-editor>
        <result-viewer code.bind="$data.code.script" template.bind="$data.code.template"></result-viewer>
      </template>
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
      = fetch(link)
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
    const parser = document.createElement('div');
    parser.innerHTML = `<template>${code}</template>`;
    const _template = parser.firstElementChild as HTMLTemplateElement;
    let script: string | undefined;
    let styles: string[] = [];
    let template = document.createElement('template');
    let node = _template.content.firstChild;
    while (node !== null) {
      let next = node.nextSibling;
      switch (node.nodeName) {
        case 'SCRIPT': {
          if (script) {
            throw new Error('Invalid component 2 script blocks encounted.');
          }
          script = node.textContent ?? '';
          node.remove();
          break;
        }
        case 'STYLE': {
          if (node.textContent) {
            styles.push(node.textContent);
            node.remove();
          }
          break;
        }
        default: {
          template.content.appendChild(node);
          break;
        }
      }

      node = next;
    }

    if (template.content.childNodes.length === 1
      && template.content.firstChild?.nodeName === 'TEMPLATE'
      && (template.content.firstChild as HTMLTemplateElement).content.childNodes.length
    ) {
      template = template.content.firstChild as HTMLTemplateElement;
    }

    if (!script) {
      script = 'export class __AnonymousComponent__ { }';
    }

    return {
      script: script.trimStart(),
      template: Array
        .from(template.content.childNodes)
        .reduce((code, node) =>
          code + (node.nodeType === 1 ? (node as Element).outerHTML : node.textContent),
          ''
        ),
      styles
    };
  }
}
