import { __decorate } from "tslib";
import { DI } from "@aurelia/kernel";
import { bindable, customElement, ValueConverter } from "@aurelia/runtime-html";
import { html } from "../html.js";
import { InlineComponentEditor } from "./component-editor.js";
import { ResultViewer } from "./result-viewer.js";
const IExampleLoader = DI.createInterface('IExampleLoader', x => x.singleton(ExampleLoader));
let ExampleViewer = class ExampleViewer {
    constructor() {
        this.title = '';
        this.forceLoad = false;
    }
    get shouldRender() {
        const { example } = this;
        return this.forceLoad || example.lazy !== true;
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
        template: html `<template style="display: block;">
    <h3
      id.bind=${v => v.example.id}
      show.bind="${v => v.example.title}">\${${v => v.example.title}}</h3>
    <p
      show.bind="${v => v.example.desc}">$\{${v => v.example.desc}}</p>
    <button if.bind="!shouldRender && !forceLoad" click.trigger="forceLoad = true">Load example</button>
    <template if.bind="shouldRender" promise.bind="example | resolve">
      <template then.from-view="$data">
        <inline-editor code.bind="$data.code.script" template.bind="$data.code.template" style="height: 300px;"></inline-editor>
        <result-viewer code.bind="$data.code.script" template.bind="$data.code.template"></result-viewer>
      </template>
      <span catch.from-view="$err">There's an error loading the example \${example.id}. Maybe try reloading.</span>
    </template>
  `,
        dependencies: [
            InlineComponentEditor,
            ResultViewer,
            ValueConverter.define('resolve', class Resolve {
                constructor(loader) {
                    this.loader = loader;
                }
                static get inject() { return [IExampleLoader]; }
                toView(v) {
                    return v.type === 'inline' ? Promise.resolve(v) : this.loader.load(v);
                }
            })
        ]
    })
], ExampleViewer);
export { ExampleViewer };
class ExampleLoader {
    constructor() {
        this.cache = Object.create(null);
        this.loadingExample = Object.create(null);
    }
    load(example) {
        const link = example.link;
        if (this.cache[link]) {
            return Promise.resolve(this.cache[link]);
        }
        if (this.loadingExample[link]) {
            return this.loadingExample[link];
        }
        return this.loadingExample[link]
            = fetch(link)
                .then(r => r.ok ? r.text() : (() => { throw new Error('Unable to fetch example code'); })())
                .then(text => {
                const code = this.parseExample(text);
                const loadedExample = { ...example, code: code };
                delete this.loadingExample[link];
                return this.cache[link] = loadedExample;
            })
                .catch(ex => {
                delete this.loadingExample[link];
                throw ex;
            });
    }
    parseExample(code) {
        const parser = document.createElement('div');
        parser.innerHTML = `<template>${code}</template>`;
        const _template = parser.firstElementChild;
        let script;
        let styles = [];
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
            && template.content.firstChild.content.childNodes.length) {
            template = template.content.firstChild;
        }
        if (!script) {
            script = 'export class App {\n}';
        }
        return {
            script: script.trimStart(),
            template: Array
                .from(template.content.childNodes)
                .reduce((code, node) => code + (node.nodeType === 1 ? node.outerHTML : node.textContent), ''),
            styles
        };
    }
}
