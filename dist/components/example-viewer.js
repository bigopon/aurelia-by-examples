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
    <button show.bind="!shouldRender" click.trigger="forceLoad = true">Load example</button>
    <div if.bind="shouldRender" promise.bind="example | resolve">
      <button pending disabled>Loading example...</button>
      <div then.from-view="$data">
        <inline-editor code.bind="$data.code.script" template.bind="$data.code.template" style="height: 300px;"></inline-editor>
        <result-viewer
          title.bind="$data.title"
          code.bind="$data.code.script"
          template.bind="$data.code.template"
          styles.bind="$data.code.styles"
          height.style="$data.settings.resultHeight"></result-viewer>
      </div>
      <span catch.from-view="$err">There's an error loading the example \${example.id}. Maybe try reloading.</span>
    </div>
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
            = fetch(link + '?t=' + Math.random())
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
        const styles = [];
        const styleParser = document.createElement('div');
        styleParser.innerHTML = `<template>${styleCode}</template>`;
        Array.from(styleParser.firstChild.content.children).forEach(c => {
            if (c.tagName === 'STYLE') {
                styles.push(c.textContent || '');
            }
        });
        return { script, template, styles };
    }
}
