import { __decorate } from "tslib";
import { camelCase } from "@aurelia/kernel";
import { valueConverter } from "@aurelia/runtime";
import { bindable, customElement } from "@aurelia/runtime-html";
import { html } from "../html.js";
import { InlineComponentEditor } from "./component-editor.js";
let ProjectExampleViewer = class ProjectExampleViewer {
    constructor() {
        this.title = '';
        this.layout = 'h';
        this.forceLoad = false;
    }
    get shouldRender() {
        const { example } = this;
        return this.forceLoad || example.lazy !== true;
    }
};
__decorate([
    bindable
], ProjectExampleViewer.prototype, "title", void 0);
__decorate([
    bindable
], ProjectExampleViewer.prototype, "example", void 0);
__decorate([
    bindable
], ProjectExampleViewer.prototype, "layout", void 0);
ProjectExampleViewer = __decorate([
    customElement({
        name: 'project-example-viewer',
        template: html `<template style="display: block;">
    <let i.bind="0"></let>
    <h3
      id.bind=${v => v.example.id}
      show.bind="${v => v.example.title}">\${${v => v.example.title}}</h3>
    <p
      show.bind="${v => v.example.desc}">$\{${v => v.example.desc}}</p>
    <button show.bind="!shouldRender" click.trigger="forceLoad = true">Load example</button>
    <div if.bind="shouldRender" promise.bind="example | resolve :i">
      <button pending disabled>Loading example...</button>
      <div then.from-view="$data">
        <inline-editor code.bind="$data.code.script" template.bind="$data.code.template" style="min-height: 250px;" layout.bind="layout"></inline-editor>
        <result-viewer
          title.bind="$data.title"
          code.bind="$data.code.script"
          template.bind="$data.code.template"
          styles.bind="$data.code.styles"
          globals.bind="$data.settings.globals"
          height.style="$data.settings.resultHeight"></result-viewer>
      </div>
      <span catch.from-view="$err">There's an error loading the example \${example.id}.
        Maybe try <button click.trigger="i = i + 1">reloading.</button>
      </span>
    </div>
  `,
        dependencies: [{
                register(container) {
                    return container.register(InlineComponentEditor, ResultViewer, ResolveValueConverter);
                }
            }]
    })
], ProjectExampleViewer);
export { ProjectExampleViewer };
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
let ResolveValueConverter = class ResolveValueConverter {
    constructor(loader) {
        this.loader = loader;
    }
    static get inject() { return [ExampleLoader]; }
    toView(v) {
        return v.type === 'inline' ? Promise.resolve(v) : this.loader.load(v);
    }
};
ResolveValueConverter = __decorate([
    valueConverter('resolve')
], ResolveValueConverter);
let ResultViewer = class ResultViewer {
    constructor() {
        this.title = '';
        this.code = '';
        this.template = '';
        this.styles = [];
        this.globals = {};
        this.file = { path: '', content: '', dispose: () => { } };
        this.refreshId = 0;
    }
    attached() {
        this.refresh(generateFile(this.code, this.template, this.styles, this.globals));
    }
    detached() {
        this.file.dispose();
        this.file = { path: '', content: '', dispose: () => { } };
    }
    refresh(file) {
        this.file.dispose();
        this.file = file;
        this.iframe.src = file.path;
    }
    propertyChanged() {
        clearTimeout(this.refreshId);
        this.refreshId = setTimeout(() => {
            try {
                this.refresh(generateFile(this.code, this.template, this.styles, this.globals));
            }
            catch (ex) {
                console.info(ex);
            }
        }, 250);
    }
};
__decorate([
    bindable
], ResultViewer.prototype, "title", void 0);
__decorate([
    bindable
], ResultViewer.prototype, "code", void 0);
__decorate([
    bindable
], ResultViewer.prototype, "template", void 0);
__decorate([
    bindable
], ResultViewer.prototype, "styles", void 0);
__decorate([
    bindable
], ResultViewer.prototype, "globals", void 0);
ResultViewer = __decorate([
    customElement({
        name: 'result-viewer',
        template: html `<template style="display: block"><iframe
    ref=iframe
    title.bind="title"
    style="width: 100%; height: 100%; border: 0;">`
    })
], ResultViewer);
function generateFile(code, template, styles, globals) {
    const html = generateHtml(code, template, styles, globals);
    const blob = new Blob([html], { type: 'text/html' });
    const path = URL.createObjectURL(blob);
    return {
        path,
        content: html,
        dispose: () => { URL.revokeObjectURL(path); }
    };
}
function generateHtml(code, template, styles, globals = {}) {
    const lines = code ? code.split('\n') : [];
    const pkgs = lines.map(l => getImportedPackage(l)).filter(Boolean);
    const script = lines.length > 0 ? addBootScript(ensureCustomElement(lines, template)) : { lines: [], mainClass: '' };
    return (`<html><head>
  <base href="${location.origin}">
  ${globals.scripts?.map(s => `<script src="${s}"></script>`).join('\n') ?? ''}
  ${globals.styles?.map(s => `<link rel="stylesheet" href="${s}" />`).join('\n') ?? ''}
  <script type="importmap">${createImportMap(pkgs)}</script>
  <script type="module">${script.lines.join('\n')}</script>
  <style>html,body {margin: 0; padding-top: 4px;}html {font-family: Helvetica, sans-serif;}</style>
  <style>${styles.join('\n')}</style>
</head><body></body></html>`);
}
function addBootScript(script) {
    return {
        lines: script.lines.concat([
            'import { DI as __DI, Registration as __R } from "@aurelia/kernel";',
            'import { StandardConfiguration as __SC, Aurelia as __Au, IPlatform as __IP } from "@aurelia/runtime-html";',
            "import { BrowserPlatform as __BP } from '@aurelia/platform-browser';",
            '(() => {',
            'const PLATFORM = window.PLATFORM = __BP.getOrCreate(globalThis);',
            'const ct = __DI.createContainer().register(__R.instance(__IP, PLATFORM), __SC);',
            `new __Au(ct).app({ host: document.body, component: ${script.mainClass} }).start();`,
            '})();'
        ]),
        mainClass: script.mainClass
    };
}
function ensureCustomElement(lines, template) {
    let className;
    for (const l of lines) {
        const match = l.match(/^\s*export\s+class\s+([a-zA-Z_$][a-zA-Z\d_$]*)\s*{/);
        if (match) {
            className = match[1];
            break;
        }
    }
    if (!className) {
        throw new Error('Unable to find a custom element');
    }
    return {
        lines: lines.concat([
            'import { CustomElement as __CE } from "@aurelia/runtime-html";',
            `const __template = ${JSON.stringify(`${template}`)};`,
            `if (!__CE.isType(${className})) __CE.define({ name: '${camelCase(className)}', template: __template }, ${className});`
        ]),
        mainClass: className
    };
}
function createImportMap(packages) {
    return JSON.stringify({
        imports: Object.assign(packages
            .reduce((all, pkg) => {
            all[pkg] = `https://unpkg.com/${isAureliaPkg(pkg) ? `${pkg}@dev` : pkg}`;
            return all;
        }, {}), {
            "@aurelia/kernel": "https://unpkg.com/@aurelia/kernel@dev/dist/esm/index.js",
            "@aurelia/runtime": "https://unpkg.com/@aurelia/runtime@dev/dist/esm/index.js",
            "@aurelia/runtime-html": "https://unpkg.com/@aurelia/runtime-html@dev/dist/esm/index.js",
            "@aurelia/platform": "https://unpkg.com/@aurelia/platform@dev/dist/esm/index.js",
            "@aurelia/platform-browser": "https://unpkg.com/@aurelia/platform-browser@dev/dist/esm/index.js",
            "@aurelia/metadata": "https://unpkg.com/@aurelia/metadata@dev/dist/esm/index.js",
            "fs": "https://unpkg.com/virtualfs@2.2.0/dist/index.browser.umd.js",
        }),
    }, undefined, 2);
}
function isAureliaPkg(pkg) {
    return pkg === 'aurelia' || pkg.startsWith('@aurelia');
}
function getImportedPackage(line) {
    return line.match(/^\s*import\s+(?:.*?)\s+from\s+['"](.*)['"]\s*;?\s*$/)?.[1] ?? null;
}
let ProjectFiles = class ProjectFiles {
    // files: Record<string, string>;
    binding() {
    }
    normalize(files) {
        const normalized = [];
        for (const path in files) {
        }
        return normalized;
    }
};
ProjectFiles = __decorate([
    customElement({
        name: 'project-files',
        template: html `
  
  `
    })
], ProjectFiles);
function loadFs() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/virtualfs@2.2.0/dist/index.browser.umd.js';
        document.head.appendChild(script);
        script.onload = function () {
            script.remove();
            resolve(window['virtualFS']);
        };
        script.onerror = reject;
    });
}
console.log(window['loadFs'] = loadFs);
