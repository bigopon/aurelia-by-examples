import { camelCase, resolve, DI, Registration } from '@aurelia/kernel';
import { BrowserPlatform } from '@aurelia/platform-browser';
import { customElement, bindable, BindingMode, valueConverter, CustomElement, INode, IPlatform, StandardConfiguration, Aurelia } from '@aurelia/runtime-html';
import { ColonPrefixedBindAttributePattern } from '@aurelia/template-compiler';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __esDecorate(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
}
function __runInitializers(thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
}
typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function parse(val) {
    const variable = val?.toString();
    const isFunc = variable.indexOf("f") > -1;
    if (!variable)
        return "";
    const firstParanthesis = variable.indexOf("(") + 1;
    const secondParanthesis = variable.indexOf(")");
    const variableName = variable.substring(firstParanthesis, secondParanthesis) || variable[0];
    const regex = new RegExp(`${variableName}\\.`, "g");
    return variable
        .substring(isFunc ? variable.indexOf("return") + 7 : variable.indexOf("=>") + 3)
        .replace(regex, "");
}
function html(strings, // html text
...values // variables which they are functions.
) {
    let html = "";
    for (let i = 0, ii = strings.length - 1; i < ii; ++i) {
        const currentString = strings[i];
        const value = values[i];
        html += currentString;
        if (typeof value === "function") {
            const parsed = parse(value);
            html += `${parsed}`;
            continue;
        }
        html += `${value}`;
    }
    html += strings[strings.length - 1];
    return html;
}

let TextEditor = (() => {
    let _classDecorators = [customElement({
            name: 'text-editor',
            template: '<template ref=host style="display: block;">'
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _value_decorators;
    let _value_initializers = [];
    let _value_extraInitializers = [];
    let _lang_decorators;
    let _lang_initializers = [];
    let _lang_extraInitializers = [];
    (class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _value_decorators = [bindable({ mode: BindingMode.twoWay })];
            _lang_decorators = [bindable];
            __esDecorate(null, null, _value_decorators, { kind: "field", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
            __esDecorate(null, null, _lang_decorators, { kind: "field", name: "lang", static: false, private: false, access: { has: obj => "lang" in obj, get: obj => obj.lang, set: (obj, value) => { obj.lang = value; } }, metadata: _metadata }, _lang_initializers, _lang_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        value = __runInitializers(this, _value_initializers, '');
        lang = (__runInitializers(this, _value_extraInitializers), __runInitializers(this, _lang_initializers, 'js'));
        host = __runInitializers(this, _lang_extraInitializers);
        editor;
        onChange = (editor, changeEVent) => {
            this.value = editor.getValue();
        };
        /* lifecycle */
        bound() {
            const view = this.editor = window.CodeMirror(this.host, {
                value: this.value,
                mode: this.lang === 'js' ? 'javascript' : 'text/html',
                lineNumbers: true,
            });
            view.on('change', this.onChange);
        }
        /* lifecycle */
        unbinding() {
            this.editor?.off('change', this.onChange);
        }
        valueChanged(v) {
            if (this.editor?.getValue() !== v) {
                this.editor?.setValue(v);
            }
        }
        focus() {
            this.editor?.refresh();
            this.editor?.focus();
        }
    });
    return _classThis;
})();

let InlineComponentEditor = (() => {
    let _classDecorators = [customElement({
            name: 'inline-editor',
            template: html `<template style="display: flex;" css="flex-direction: $\{${c => c.layout === 'v' ? 'column' : 'row'}}">
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
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _code_decorators;
    let _code_initializers = [];
    let _code_extraInitializers = [];
    let _template_decorators;
    let _template_initializers = [];
    let _template_extraInitializers = [];
    let _layout_decorators;
    let _layout_initializers = [];
    let _layout_extraInitializers = [];
    (class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _code_decorators = [bindable({ mode: BindingMode.twoWay })];
            _template_decorators = [bindable({ mode: BindingMode.twoWay })];
            _layout_decorators = [bindable({
                    set: v => v === 'v' || v === 'h' ? v : (() => { throw new Error('Invalid layout value'); })()
                })];
            __esDecorate(null, null, _code_decorators, { kind: "field", name: "code", static: false, private: false, access: { has: obj => "code" in obj, get: obj => obj.code, set: (obj, value) => { obj.code = value; } }, metadata: _metadata }, _code_initializers, _code_extraInitializers);
            __esDecorate(null, null, _template_decorators, { kind: "field", name: "template", static: false, private: false, access: { has: obj => "template" in obj, get: obj => obj.template, set: (obj, value) => { obj.template = value; } }, metadata: _metadata }, _template_initializers, _template_extraInitializers);
            __esDecorate(null, null, _layout_decorators, { kind: "field", name: "layout", static: false, private: false, access: { has: obj => "layout" in obj, get: obj => obj.layout, set: (obj, value) => { obj.layout = value; } }, metadata: _metadata }, _layout_initializers, _layout_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        code = __runInitializers(this, _code_initializers, '');
        template = (__runInitializers(this, _code_extraInitializers), __runInitializers(this, _template_initializers, ''));
        layout = (__runInitializers(this, _template_extraInitializers), __runInitializers(this, _layout_initializers, 'h'));
        constructor() {
            __runInitializers(this, _layout_extraInitializers);
        }
    });
    return _classThis;
})();

let ExampleViewer = (() => {
    let _classDecorators = [customElement({
            name: 'example-viewer',
            template: html `<template style="display: block;">
    <let i.bind="0"></let>
    <h3
      id.bind="${v => v.example.id}"
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
                        return container.register(InlineComponentEditor, ResultViewer$1, ResolveValueConverter$1);
                    }
                }]
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _example_decorators;
    let _example_initializers = [];
    let _example_extraInitializers = [];
    let _layout_decorators;
    let _layout_initializers = [];
    let _layout_extraInitializers = [];
    (class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [bindable];
            _example_decorators = [bindable];
            _layout_decorators = [bindable];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _example_decorators, { kind: "field", name: "example", static: false, private: false, access: { has: obj => "example" in obj, get: obj => obj.example, set: (obj, value) => { obj.example = value; } }, metadata: _metadata }, _example_initializers, _example_extraInitializers);
            __esDecorate(null, null, _layout_decorators, { kind: "field", name: "layout", static: false, private: false, access: { has: obj => "layout" in obj, get: obj => obj.layout, set: (obj, value) => { obj.layout = value; } }, metadata: _metadata }, _layout_initializers, _layout_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        title = __runInitializers(this, _title_initializers, '');
        example = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _example_initializers, void 0));
        layout = (__runInitializers(this, _example_extraInitializers), __runInitializers(this, _layout_initializers, 'h'));
        forceLoad = (__runInitializers(this, _layout_extraInitializers), false);
        get shouldRender() {
            const { example } = this;
            return this.forceLoad || example.lazy !== true;
        }
    });
    return _classThis;
})();
let ExampleLoader$1 = class ExampleLoader {
    cache = Object.create(null);
    loadingExample = Object.create(null);
    load(example) {
        const link = example.link;
        if (this.cache[link]) {
            return Promise.resolve(this.cache[link]);
        }
        if (!!this.loadingExample[link]) {
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
};
let ResolveValueConverter$1 = (() => {
    let _classDecorators = [valueConverter('resolve')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    (class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        loader;
        static get inject() { return [ExampleLoader$1]; }
        constructor(loader) {
            this.loader = loader;
        }
        toView(v) {
            return v.type === 'inline' ? Promise.resolve(v) : this.loader.load(v);
        }
    });
    return _classThis;
})();
let ResultViewer$1 = (() => {
    let _classDecorators = [customElement({
            name: 'result-viewer',
            template: html `<template style="display: block"><iframe
    ref=iframe
    title.bind="title"
    style="width: 100%; height: 100%; border: 0; position: relative; z-index: 1">`
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _code_decorators;
    let _code_initializers = [];
    let _code_extraInitializers = [];
    let _template_decorators;
    let _template_initializers = [];
    let _template_extraInitializers = [];
    let _styles_decorators;
    let _styles_initializers = [];
    let _styles_extraInitializers = [];
    let _globals_decorators;
    let _globals_initializers = [];
    let _globals_extraInitializers = [];
    (class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [bindable];
            _code_decorators = [bindable];
            _template_decorators = [bindable];
            _styles_decorators = [bindable];
            _globals_decorators = [bindable];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _code_decorators, { kind: "field", name: "code", static: false, private: false, access: { has: obj => "code" in obj, get: obj => obj.code, set: (obj, value) => { obj.code = value; } }, metadata: _metadata }, _code_initializers, _code_extraInitializers);
            __esDecorate(null, null, _template_decorators, { kind: "field", name: "template", static: false, private: false, access: { has: obj => "template" in obj, get: obj => obj.template, set: (obj, value) => { obj.template = value; } }, metadata: _metadata }, _template_initializers, _template_extraInitializers);
            __esDecorate(null, null, _styles_decorators, { kind: "field", name: "styles", static: false, private: false, access: { has: obj => "styles" in obj, get: obj => obj.styles, set: (obj, value) => { obj.styles = value; } }, metadata: _metadata }, _styles_initializers, _styles_extraInitializers);
            __esDecorate(null, null, _globals_decorators, { kind: "field", name: "globals", static: false, private: false, access: { has: obj => "globals" in obj, get: obj => obj.globals, set: (obj, value) => { obj.globals = value; } }, metadata: _metadata }, _globals_initializers, _globals_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        title = __runInitializers(this, _title_initializers, '');
        code = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _code_initializers, ''));
        template = (__runInitializers(this, _code_extraInitializers), __runInitializers(this, _template_initializers, ''));
        styles = (__runInitializers(this, _template_extraInitializers), __runInitializers(this, _styles_initializers, []));
        globals = (__runInitializers(this, _styles_extraInitializers), __runInitializers(this, _globals_initializers, {}));
        iframe = __runInitializers(this, _globals_extraInitializers);
        file = { path: '', content: '', dispose: () => { } };
        attached() {
            this.refresh(generateFile$1(this.code, this.template, this.styles, this.globals));
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
        refreshId = 0;
        propertyChanged() {
            clearTimeout(this.refreshId);
            this.refreshId = setTimeout(() => {
                try {
                    this.refresh(generateFile$1(this.code, this.template, this.styles, this.globals));
                }
                catch (ex) {
                    console.info(ex);
                }
            }, 250);
        }
    });
    return _classThis;
})();
function generateFile$1(code, template, styles, globals) {
    const html = generateHtml$1(code, template, styles, globals);
    const blob = new Blob([html], { type: 'text/html' });
    const path = URL.createObjectURL(blob);
    return {
        path,
        content: html,
        dispose: () => { URL.revokeObjectURL(path); }
    };
}
function generateHtml$1(code, template, styles, globals = {}) {
    const lines = code ? code.split('\n') : [];
    const pkgs = lines.map(l => getImportedPackage$1(l)).filter(Boolean);
    const script = lines.length > 0 ? addBootScript$1(ensureCustomElement$1(lines, template)) : { lines: [], mainClass: '' };
    return (`<html><head>
  <base href="${location.origin}">
  ${globals.scripts?.map(s => `<script src="${s}"></script>`).join('\n') ?? ''}
  ${globals.styles?.map(s => `<link rel="stylesheet" href="${s}" />`).join('\n') ?? ''}
  <script type="importmap">${createImportMap$1(pkgs)}</script>
  <script type="module">${script.lines.join('\n')}</script>
  <style>html,body {margin: 0; padding-top: 4px;}html {font-family: Helvetica, sans-serif;}</style>
  <style>${styles.join('\n')}</style>
</head><body></body></html>`);
}
function addBootScript$1(script) {
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
function ensureCustomElement$1(lines, template) {
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
function createImportMap$1(packages) {
    return JSON.stringify({
        imports: Object.assign(packages
            .reduce((all, pkg) => {
            all[pkg] = `https://unpkg.com/${isAureliaPkg$1(pkg) ? `${pkg}@dev` : pkg}`;
            return all;
        }, {}), {
            "@aurelia/kernel": "/vendors/au.js",
            "@aurelia/runtime": "/vendors/au.js",
            "@aurelia/runtime-html": "/vendors/au.js",
            "@aurelia/expression-parser": "/vendors/au.js",
            "@aurelia/template-compiler": "/vendors/au.js",
            "@aurelia/platform": "/vendors/au.js",
            "@aurelia/platform-browser": "/vendors/au.js",
            "@aurelia/metadata": "/vendors/au.js",
        }),
    }, undefined, 2);
}
function isAureliaPkg$1(pkg) {
    return pkg === 'aurelia' || pkg.startsWith('@aurelia');
}
function getImportedPackage$1(line) {
    return line.match(/^\s*import\s+(?:.*?)\s+from\s+['"](.*)['"]\s*;?\s*$/)?.[1] ?? null;
}

let ProjectExampleViewer = (() => {
    let _classDecorators = [customElement({
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
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _example_decorators;
    let _example_initializers = [];
    let _example_extraInitializers = [];
    let _layout_decorators;
    let _layout_initializers = [];
    let _layout_extraInitializers = [];
    (class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [bindable];
            _example_decorators = [bindable];
            _layout_decorators = [bindable];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _example_decorators, { kind: "field", name: "example", static: false, private: false, access: { has: obj => "example" in obj, get: obj => obj.example, set: (obj, value) => { obj.example = value; } }, metadata: _metadata }, _example_initializers, _example_extraInitializers);
            __esDecorate(null, null, _layout_decorators, { kind: "field", name: "layout", static: false, private: false, access: { has: obj => "layout" in obj, get: obj => obj.layout, set: (obj, value) => { obj.layout = value; } }, metadata: _metadata }, _layout_initializers, _layout_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        title = __runInitializers(this, _title_initializers, '');
        example = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _example_initializers, void 0));
        layout = (__runInitializers(this, _example_extraInitializers), __runInitializers(this, _layout_initializers, 'h'));
        forceLoad = (__runInitializers(this, _layout_extraInitializers), false);
        get shouldRender() {
            const { example } = this;
            return this.forceLoad || example.lazy !== true;
        }
    });
    return _classThis;
})();
class ExampleLoader {
    cache = Object.create(null);
    loadingExample = Object.create(null);
    load(example) {
        const link = example.link;
        if (this.cache[link]) {
            return Promise.resolve(this.cache[link]);
        }
        if (!!this.loadingExample[link]) {
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
let ResolveValueConverter = (() => {
    let _classDecorators = [valueConverter('resolve')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    (class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        loader;
        static get inject() { return [ExampleLoader]; }
        constructor(loader) {
            this.loader = loader;
        }
        toView(v) {
            return v.type === 'inline' ? Promise.resolve(v) : this.loader.load(v);
        }
    });
    return _classThis;
})();
let ResultViewer = (() => {
    let _classDecorators = [customElement({
            name: 'result-viewer',
            template: html `<template style="display: block"><iframe
    ref=iframe
    title.bind="title"
    style="width: 100%; height: 100%; border: 0;">`
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _code_decorators;
    let _code_initializers = [];
    let _code_extraInitializers = [];
    let _template_decorators;
    let _template_initializers = [];
    let _template_extraInitializers = [];
    let _styles_decorators;
    let _styles_initializers = [];
    let _styles_extraInitializers = [];
    let _globals_decorators;
    let _globals_initializers = [];
    let _globals_extraInitializers = [];
    (class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [bindable];
            _code_decorators = [bindable];
            _template_decorators = [bindable];
            _styles_decorators = [bindable];
            _globals_decorators = [bindable];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _code_decorators, { kind: "field", name: "code", static: false, private: false, access: { has: obj => "code" in obj, get: obj => obj.code, set: (obj, value) => { obj.code = value; } }, metadata: _metadata }, _code_initializers, _code_extraInitializers);
            __esDecorate(null, null, _template_decorators, { kind: "field", name: "template", static: false, private: false, access: { has: obj => "template" in obj, get: obj => obj.template, set: (obj, value) => { obj.template = value; } }, metadata: _metadata }, _template_initializers, _template_extraInitializers);
            __esDecorate(null, null, _styles_decorators, { kind: "field", name: "styles", static: false, private: false, access: { has: obj => "styles" in obj, get: obj => obj.styles, set: (obj, value) => { obj.styles = value; } }, metadata: _metadata }, _styles_initializers, _styles_extraInitializers);
            __esDecorate(null, null, _globals_decorators, { kind: "field", name: "globals", static: false, private: false, access: { has: obj => "globals" in obj, get: obj => obj.globals, set: (obj, value) => { obj.globals = value; } }, metadata: _metadata }, _globals_initializers, _globals_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        title = __runInitializers(this, _title_initializers, '');
        code = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _code_initializers, ''));
        template = (__runInitializers(this, _code_extraInitializers), __runInitializers(this, _template_initializers, ''));
        styles = (__runInitializers(this, _template_extraInitializers), __runInitializers(this, _styles_initializers, []));
        globals = (__runInitializers(this, _styles_extraInitializers), __runInitializers(this, _globals_initializers, {}));
        iframe = __runInitializers(this, _globals_extraInitializers);
        file = { path: '', content: '', dispose: () => { } };
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
        refreshId = 0;
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
    });
    return _classThis;
})();
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
(() => {
    let _classDecorators = [customElement({
            name: 'project-files',
            template: html `
  
  `
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    (class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        // files: Record<string, string>;
        binding() {
        }
        normalize(files) {
            const normalized = [];
            return normalized;
        }
    });
    return _classThis;
})();
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

const examples = [
    // hello world section
    {
        id: 'basic',
        type: 'heading',
        title: 'Introduction',
        desc: 'Aurelia is a frontend JavaScript framework that is simple, powerful and unobtrusive.\n' +
            'It stays out of your way with a plain binding & observation system and an intuitive, expressive & extensible templating system.\n' +
            'Let\'s dive into Aurelia via hundred of examples.',
    },
    {
        id: 'hello-world',
        type: 'inline',
        title: 'Hello world',
        desc: 'A basic example of Aurelia template. Hello world!',
        indent: 1,
        code: {
            script: 'export class App {\n  message = "Hello world!";\n}',
            template: '<h1>${message}</h1>',
            styles: []
        }
    },
    {
        id: 'templating-syntax-text',
        type: 'inline',
        title: 'Displaying text',
        desc: 'Using Aurelia\'s interpolation syntax (a dollar sign followed by enclosed curly braces) ${} to display text in your views.\n' +
            'By default, Aurelia is also taught to use textcontent.bind or textcontent="${property}" to display text:',
        code: {
            script: 'export class App {\n  message = "Hello world!";\n}',
            template: '<h1>${message}</h1>\n<p textcontent="${message}"></p>\n<p textcontent.bind="message"></p>',
            styles: [],
        },
        indent: 1,
        lazy: true,
    },
    {
        id: 'templating-syntax-html',
        type: 'inline',
        title: 'Displaying html',
        desc: 'Use innerhtml.bind for when you want to update element.innerHTML.\n' +
            'HTML nodes & elements are also supported, with the caveat that they will be appended as is, which means one value cannot be used in multiple locations.',
        code: {
            script: `export class App {
  constructor() {
    this.message = "Hello world!";

    const b = document.createElement('b');
    b.textContent = this.message;
    this.messageHtml = b;
  }
}`,
            template: '<div innerhtml.bind="message"></div>\n<div>${messageHtml}</div>',
            styles: [],
        },
        indent: 1,
        lazy: true,
    },
    {
        id: 'templating-syntax-attribute',
        type: 'link',
        title: 'Setting attribute',
        desc: 'By default, "aria-", "data-", "class", "styles" and standard svg attributes are treated as attribute, instead of properties.',
        link: 'examples/basic.attribute.html',
        indent: 1,
        lazy: true,
    },
    {
        id: 'templating-syntax-attribute-class',
        type: 'link',
        title: 'Setting classes',
        desc: 'Interpolation and ".class" binding command can be used to set a class on an element',
        link: 'examples/basic.attribute-class.html',
        indent: 1,
        lazy: true,
    },
    {
        id: 'templating-syntax-attribute-style',
        type: 'link',
        title: 'Setting styles',
        desc: 'Interpolation and ".style" binding command can be used to set one or many styles on an element',
        link: 'examples/basic.attribute-style.html',
        indent: 1,
        lazy: true,
    },
    // collectiong rendering
    {
        id: 'rendering-collections',
        type: 'heading',
        title: 'Rendering collections',
        desc: 'In most applications, your model is not only composed of objects, but also of various types of collections. ' +
            'Aurelia provides a robust way to handle collection data through its built-in "repeat" attribute. ' +
            'Repeaters can be used on any element, including custom elements and template elements too!',
    },
    {
        id: 'rendering-collections-array',
        type: 'link',
        title: 'Rendering array',
        desc: 'Render each item of an array via repeat.for',
        link: 'examples/collection.array.html',
        indent: 1,
        lazy: true,
    },
    {
        id: 'rendering-collections-set',
        type: 'link',
        title: 'Rendering Set',
        desc: 'Render each item of a set via repeat.for',
        link: 'examples/collection.set.html',
        indent: 1,
        lazy: true,
    },
    {
        id: 'rendering-collections-map',
        type: 'link',
        title: 'Rendering Map',
        desc: 'Render each item of a map via repeat.for',
        link: 'examples/collection.map.html',
        indent: 1,
        lazy: true,
    },
    {
        id: 'rendering-collections-range',
        type: 'link',
        title: 'Rendering a range',
        desc: 'Iterate from 0 to a given number to render, via repeat.for',
        link: 'examples/collection.number.html',
        indent: 1,
        lazy: true,
        settings: {
            resultHeight: '250px'
        }
    },
    {
        id: 'rendering-collections-objects-keys',
        type: 'link',
        title: 'Rendering object key/value pairs',
        desc: 'Objects are not iterable, though if piped through a value converter, it\'s possible to use repeat.for',
        link: 'examples/collection.object.html',
        indent: 1,
        lazy: true,
    },
    {
        id: 'rendering-collections-contextual-properties',
        type: 'link',
        title: 'Contextual properties',
        desc: `There are contextual properties inside a repeat for:
- $index: (number) the current item index
- $length: (number) the length/size of the collection
- $first: (boolean) true if the current item is the first in the collection
- $last: (boolean) true if the current item is the last in the collection
- $middle: (boolean) true if the current item is neither first nor last in the collection
- $even: (boolean) true if the current item index is even
- $odd: (boolean) true if the current item index is odd`,
        link: 'examples/collection.contextual-properties.html',
        indent: 1,
        lazy: true,
    },
    {
        id: 'rendering-collection-nested',
        type: 'link',
        title: 'Nested collection rendering',
        desc: 'Aurelia supports nested collection rendering intuitively. Parent scope of a repeat scope can be accessed via "$parent".',
        link: 'examples/collection.nested.html',
        indent: 1,
        lazy: true,
    },
    {
        id: 'handling-event',
        type: 'heading',
        title: 'Handling events',
        desc: 'Aurelia makes it easy for you to handle standard/custom DOM event.',
    },
    {
        id: 'handling-event-basic',
        type: 'link',
        title: 'Basic of event handling',
        desc: `Aurelia's binding system supports binding to standard and custom DOM events. A DOM event binding will execute a JavaScript expression whenever the specified DOM event occurs. Event binding declarations have three parts and take the form event.command="expression".

- event:  This is the name of a DOM event, without the "on" prefix, just as you would pass to the native addEventListener() API. e.g. "click"
- command: One of the following event binging commands:
    - trigger: Attaches an event handler directly to the element. When the event fires, the expression will be invoked.
    - capture: Attaches a single event handler to the element in capturing phase.
    - delegate: Attaches a single event handler to the document (or nearest shadow DOM boundary) which handles all events of the specified type in bubbling phase, properly dispatching them back to their original targets for invocation of the associated expression.
- expression: A JavaScript expression. Use the special $event property to access the DOM event in your binding expression.`,
        link: 'examples/event.general.html',
        indent: 1,
        lazy: true,
    },
    {
        id: 'handling-event-self',
        type: 'link',
        title: 'Self binding behavior',
        desc: 'Sometimes it is desirable to fire an event if the origin of the event is the element the event listener is attached to. '
            + 'Aurelia supports this via "Self" binding behavior, syntax: "& self"',
        link: 'examples/event.self.html',
        indent: 1,
        lazy: true,
        settings: {
            resultHeight: '300px'
        }
    },
    // conditional rendering
    {
        id: 'conditional-rendering',
        type: 'heading',
        title: 'Conditional rendering',
        desc: 'Change what is rendered or shown based on conditions in your code.',
    },
    {
        id: 'conditional-show-hide',
        type: 'link',
        title: 'With show/hide',
        desc: 'An example of conditional rendering syntaxes in Aurelia with show/hide. ' +
            'Using this when it is desirable to hide/show an element without removing it from the document.',
        link: 'examples/conditional.show-hide.html',
        indent: 1,
        lazy: true,
    },
    {
        id: 'conditional-if-else',
        type: 'link',
        title: 'With if/else',
        desc: 'Examples of conditional rendering syntaxes in Aurelia with if/else.' +
            'Using this when it is desirable to remove the elements when the condition is false/falsy',
        link: 'examples/conditional.if-else.html',
        indent: 1,
        lazy: true,
    },
    {
        id: 'conditional-switch',
        title: 'With switch',
        type: 'link',
        desc: 'Examples of conditional rendering syntaxes in Aurelia with switch/case/default.' +
            'Using this when it is desirable to have the semantic of switch syntax',
        link: 'examples/conditional.switch.html',
        indent: 1,
        lazy: true,
    },
    {
        id: 'conditional-promise',
        title: 'With promise',
        type: 'link',
        desc: 'Examples of conditional rendering syntaxes in Aurelia with promise/pending/then/catch.' +
            'Using this when it is desirable to have the semantic of Promise in JavaScript, without intermediate view model code',
        link: 'examples/conditional.promise.html',
        indent: 1,
        lazy: true,
    },
    // handling form
    {
        id: 'form-text',
        type: 'heading',
        title: 'Form text input',
        desc: 'It is not uncommon that at some point, your application will contain some form elements that ' +
            'provide the ability to allow user input. Whether they be select dropdowns, text inputs or buttons, ' +
            'Aurelia makes working with forms intuitive.',
    },
    {
        id: 'form-input',
        type: 'inline',
        title: 'Input text',
        desc: 'A common element seen in forms is text <input>. Aurelia supports this via "value.bind"',
        code: {
            script: 'export class App {\n  message = "Hello world!";\n}',
            template: '<input value.bind="message" /><br>\n${message}',
            styles: [],
        },
        lazy: true,
        indent: 1,
    },
    {
        id: 'form-number-input',
        type: 'inline',
        title: 'Input number',
        desc: 'Two way binding with a number <input/>, as string',
        code: {
            script: 'export class App {\n  count = 0;\n}',
            template: '<input type="number" value.bind="count" /><br>\ntype: ${typeof count} -- value: ${count}',
            styles: [],
        },
        lazy: true,
        indent: 1,
    },
    {
        id: 'form-number-input-value-converter',
        type: 'inline',
        title: 'Input number + value converter',
        desc: 'Two way binding with a number <input/>, with the help of "| number" value converter expression to turn string into number',
        code: {
            script: `import { ValueConverter } from "@aurelia/runtime";

export class App {
  static get dependencies() {
    return [
      ValueConverter.define("number", class ToNumber {
        fromView(v) { return Number(v); }
        toView(v) { return Number(v); }
      })
    ];
  }

  count = 0;
}`,
            template: '<input type="number" value.bind="count | number" /><br>\ntype: ${typeof count} -- value: ${count}',
            styles: [],
        },
        lazy: true,
        indent: 1,
    },
    {
        id: 'form-number-input-value-as-number',
        type: 'inline',
        title: 'Input number + valueAsNumber',
        desc: 'Two way binding with number <input/>, via "valueAsNumber" property, to reduce boiler plate converting string to number',
        code: {
            script: 'export class App {\n  a = 0;\n  b = 0;\n}',
            template: [
                '<b>Plus calculator</b>',
                'a: <input type="number" value-as-number.bind="a"/>\ntype: ${typeof a} -- value: ${a}',
                'b: <input type="number" value-as-number.bind="b"/>\ntype: ${typeof b} -- value: ${b}',
                '${a} + ${b} = ${a + b}'
            ].join('<br>\n'),
            styles: [],
        },
        lazy: true,
        indent: 1,
    },
    {
        id: 'form-textarea',
        type: 'inline',
        title: 'Textarea',
        desc: 'A textarea element is just like any other form element. ' +
            'It allows you to bind to its value and by default "value.bind" will be two-way binding ' +
            '(meaning changes in the view will flow to the view-model, and changes in the view-model will flow to the view).',
        code: {
            script: 'export class App {\n  message = "Hello world!";\n}',
            template: '<textarea value.bind="message"></textarea><br>\n${message}',
            styles: ['textarea{width: 300px; height: 100px; resize: none;}'],
        },
        lazy: true,
        indent: 1,
    },
    {
        id: 'form-checkboxes',
        type: 'heading',
        title: 'Form checkboxes',
        desc: 'Aurelia supports two-way binding a variety of data-types to checkbox input elements..',
    },
    {
        id: 'form-checkbox-booleans',
        type: 'link',
        title: 'Checkbox + booleans',
        desc: `Bind a boolean property to an input element's checked attribute using checked.bind="myBooleanProperty"`,
        link: 'examples/form.checkbox-booleans.html',
        lazy: true,
        indent: 1,
    },
    {
        id: 'form-checkbox-array-numbers',
        type: 'link',
        title: 'Checkbox + number array',
        desc: `A set of checkbox elements is a multiple selection interface. ` +
            `If you have an array that serves as the "selected items" list, ` +
            `you can bind the array to each input's checked attribute. ` +
            `The binding system will track the input's checked status, adding the input's value to the array ` +
            `when the input is checked and removing the input's value from the array when the input is unchecked`,
        link: 'examples/form.checkbox-array-numbers.html',
        lazy: true,
        indent: 1,
    },
    {
        id: 'form-checkbox-array-objects',
        type: 'link',
        title: 'Checkbox + object array',
        desc: `Numbers aren't the only type of value you can store in a "selected items" array. ` +
            `The binding system supports all types, including objects. ` +
            `Here's an example that adds and removes "product" objects from a "selectedProducts" array using the checkbox data-binding.`,
        link: 'examples/form.checkbox-array-objects.html',
        lazy: true,
        indent: 1,
    },
    {
        id: 'form-checkbox-array-objects-matcher',
        type: 'link',
        indent: 1,
        title: 'Checkbox + objects array + matcher',
        desc: `You may run into situations where the object your input element's model is bound to ` +
            `does not have reference equality to any of the objects in your checked array. ` +
            `The objects might match by id, but they may not be the same object instance. ` +
            `To support this scenario you can override Aurelia's default "matcher" ` +
            `which is a equality comparison function that looks like this: (a, b) => a === b. ` +
            `You can substitute a function of your choosing that has the right logic to compare your objects.`,
        link: 'examples/form.checkbox-array-objects-matcher.html',
        lazy: true,
    },
    {
        id: 'form-checkbox-array-strings',
        type: 'link',
        title: 'Checkbox + string array',
        desc: `An example that adds and removes strings from a selectedProducts array using the checkbox data-binding. ` +
            `In this is, standard checkbox value attribute is used.`,
        link: 'examples/form.checkbox-array-objects-matcher.html',
        lazy: true,
        indent: 1,
    },
    {
        id: 'form-radios',
        type: 'heading',
        title: 'Form radios',
        desc: `A group of radio inputs is a type of "single select" interface. Aurelia supports two-way binding any type of property to a group of radio inputs. The examples below illustrate binding number, object, string and boolean properties to sets of radio inputs. In each of the examples there's a common set of steps:

1. Group the radios via the \`name\` property. Radio buttons that have the same value for the name attribute are in the same "radio button group"; only one radio button in a group can be selected at a time.
2. Define each radio's value using the \`model\` property.
3. Two-way bind each radio's \`checked\` attribute to a "selected item" property on the view-model.`
    },
    {
        id: 'form-radios-numbers',
        type: 'link',
        title: 'Radios + numbers',
        desc: 'In this example each radio input will be assigned a number value via the model property. ' +
            'Selecting a radio will cause its model value to be assigned to the "selectedProductId" property.',
        link: 'examples/form.radio-numbers.html',
        lazy: true,
        indent: 1,
    },
    {
        id: 'form-radios-objects',
        type: 'link',
        title: 'Radios + objects',
        desc: 'The binding system supports binding all types to radios, including objects. ' +
            'Here\'s an example that binds a group of radios to a selectedProduct object property.',
        link: 'examples/form.radio-objects.html',
        lazy: true,
        indent: 1,
    },
    {
        id: 'form-radios-objects-matcher',
        type: 'link',
        title: 'Radios + objects + matcher',
        desc: 'You may run into situations where the objects in your view and view model may look the same, ' +
            'but are different objects. To support this scenario you can override Aurelia\'s default "matcher", ' +
            'which looks like this:\n(a, b) => a === b.',
        link: 'examples/form.radio-objects-matcher.html',
        lazy: true,
        indent: 1,
    },
    {
        id: 'form-radios-booleans',
        type: 'link',
        title: 'Radios + booleans',
        desc: 'In this example each radio input is assigned one of three literal values: null, true and false. ' +
            'Selecting one of the radios will assign its value to the likesCake property.',
        link: 'examples/form.radio-booleans.html',
        lazy: true,
        indent: 1,
    },
    {
        id: 'form-radios-strings',
        type: 'link',
        title: 'Radios + strings',
        desc: 'Aurelia also knows how to deal with standard value attribute of radio input. An example is as follow',
        link: 'examples/form.radio-strings.html',
        lazy: true,
        indent: 1,
    },
    {
        id: 'form-selects',
        type: 'heading',
        title: 'Form selects',
        desc: `A <select> element can serve as a single-select or multiple-select "picker" depending on whether the multiple attribute is present. The binding system supports both use cases. The samples below demonstrate a variety scenarios, all use a common series of steps to configure the select element:

1. Add a <select> element to the template and decide whether the multiple attribute should be applied.
2. Bind the select element's value attribute to a property. In "multiple" mode, the property should be an array. In singular mode it can be any type.
3. Define the select element's <option> elements. You can use the repeat or add each option element manually.
4. Specify each option's value via the model property:
   <option model.bind="product.id">\${product.name}</option>
   You can use the standard value attribute instead of model, just remember- it will coerce anything it's assigned to a string.`,
    },
    {
        id: 'form-select-number',
        type: 'link',
        title: 'Select + numbers',
        desc: 'Binding a number from select options with the view model is done via value.bind on the <select>, and model.bind on the <option>',
        link: 'examples/form.select-number.html',
        lazy: true,
        indent: 1,
    },
    {
        id: 'form-select-object',
        type: 'link',
        title: 'Select + objects',
        desc: 'Binding an object from select options with the view model is done via value.bind on the <select>, and model.bind on the <option>',
        link: 'examples/form.select-object.html',
        lazy: true,
        indent: 1,
    },
    {
        id: 'form-select-object-matcher',
        type: 'link',
        title: 'Select + objects + matcher',
        desc: 'You may run into situations where the objects in your view and view model may look the same, ' +
            'but are different objects. To support this scenario you can override Aurelia\'s default "matcher", ' +
            'which looks like this:\n(a, b) => a === b.',
        link: 'examples/form.select-object-matcher.html',
        lazy: true,
        indent: 1,
    },
    {
        id: 'form-select-boolean',
        type: 'link',
        title: 'Select + booleans',
        desc: 'Binding a boolean value from select options with the view model is done via value.bind on the <select>, and model.bind on the <option>',
        link: 'examples/form.select-boolean.html',
        lazy: true,
        indent: 1,
    },
    {
        id: 'form-select-string',
        type: 'link',
        title: 'Select + strings',
        desc: 'Unlike other kinds of value above, string works natively with the value property of <option>. Example is as following:',
        link: 'examples/form.select-string.html',
        lazy: true,
        indent: 1,
    },
    {
        id: 'form-select-multiple-numbers',
        type: 'link',
        title: 'Select + multiple + numbers',
        desc: 'Aurelia also knows how to handle multiple attribute on the <select>, as intuitive as the usage without it. ' +
            'To bind with a multi select, use an array. ' +
            'Following is an example how to bind multi number select:',
        link: 'examples/form.select-multiple-numbers.html',
        lazy: true,
        indent: 1,
    },
    {
        id: 'form-select-multiple-objects',
        type: 'link',
        title: 'Select + multiple + objects',
        desc: 'Aurelia also knows how to handle multiple attribute on the <select>, as intuitive as the usage without it. ' +
            'To bind with a multi select, use an array and ensure model.bind is used on the <option> ' +
            'Following is an example how to bind multi object select:',
        link: 'examples/form.select-multiple-objects.html',
        lazy: true,
        indent: 1,
    },
    {
        id: 'form-select-multiple-strings',
        type: 'link',
        title: 'Select + multiple + strings',
        desc: 'Multi select binding with strings are simpler than other form, as option value works natively with string.' +
            'Following is an example how to bind multi string select:',
        link: 'examples/form.select-multiple-strings.html',
        lazy: true,
        indent: 1,
    },
    {
        id: 'form-submission',
        type: 'heading',
        title: 'Form submission',
        desc: ''
    },
    {
        id: 'form-submitting',
        type: 'link',
        title: 'Submitting a form',
        desc: 'It is recommended to use standard way to submit a form, via a submit control, typically a button without a type, or type="submit"',
        link: 'examples/form.submitting.html',
        indent: 1,
        lazy: true,
        settings: { resultHeight: '300px' },
    },
    {
        id: 'form-submission-handling',
        type: 'link',
        title: 'Submission handling',
        desc: 'Hook into the submission event of a form using standard submit event',
        link: 'examples/form.submission-handling.html',
        indent: 1,
        lazy: true,
    },
    // ref
    {
        id: 'retrieving-reference',
        type: 'heading',
        title: 'Retrieving references',
        desc: 'Retrieve the reference to an element, a custom element or custom attribute view model via ref, view-model.ref or (attr-name).ref.',
    },
    {
        id: 'retrieving-reference-element',
        title: 'Element reference',
        type: 'link',
        desc: 'Use "ref" attribute on an element to express the property to assign the element reference to. ' +
            'The value will be available after "binding" lifecycle, and before "bound" lifecycle',
        link: 'examples/ref.element.html',
        indent: 1,
        lazy: true,
    },
    {
        id: 'retrieving-reference-view-model',
        title: 'Custom element VM reference',
        type: 'link',
        desc: 'Use "view-model.ref" on a custom element to express the property to assign the element view model reference to. ' +
            'The value will be available after "binding" lifecycle, and before "bound" lifecycle',
        link: 'examples/ref.custom-element.html',
        indent: 1,
        lazy: true,
    },
    {
        id: 'retrieving-reference-view-model',
        title: 'Custom attribute VM reference',
        type: 'link',
        desc: 'Use "xxxx.ref", where xxxx is the name of the attribute, on a custom element to express the property to assign a custom attribute view model reference to. ' +
            'The value will be available after "binding" lifecycle, and before "bound" lifecycle',
        link: 'examples/ref.custom-attribute.html',
        indent: 1,
        lazy: true,
    },
    // datepicker/date-picker/date picker
    {
        id: 'date-picker',
        type: 'heading',
        title: 'Date picker',
        desc: 'A common UI component seen in many applications. There are many ways to build/handle such requirements',
    },
    {
        id: 'date-picker',
        type: 'link',
        title: 'Native date picker',
        desc: 'An exmaple of how to bind HTML native datepicker with Aurelia',
        link: 'examples/datepicker.native.html',
        indent: 1,
        lazy: true,
    },
    {
        id: 'date-picker-converter',
        type: 'link',
        title: 'Native date picker + converter',
        desc: 'It is sometimes desirable to retrieve a date object out of a dateinput. An exmaple of how to bind HTML native datepicker with Aurelia, with a value converter',
        link: 'examples/datepicker.native-value-converter.html',
        indent: 1,
        lazy: true,
    },
    {
        id: 'date-picker-pikaday',
        type: 'link',
        title: 'Pikaday',
        desc: 'A simple example using a thirdparty datepicker component: Pikaday',
        link: 'examples/datepicker.pikaday.html',
        indent: 1,
        lazy: true,
        settings: {
            resultHeight: '350px',
            globals: {
                scripts: ['https://cdnjs.cloudflare.com/ajax/libs/pikaday/1.6.0/pikaday.min.js'],
                styles: ['https://cdnjs.cloudflare.com/ajax/libs/pikaday/1.6.0/css/pikaday.css'],
            }
        }
    },
    {
        id: 'date-picker-flatpickr',
        type: 'link',
        title: 'Flatpickr',
        desc: 'A simple example using a thirdparty datepicker component: Flatpickr',
        link: 'examples/datepicker.flatpickr.html',
        indent: 1,
        lazy: true,
        settings: {
            resultHeight: '450px',
            globals: {
                scripts: ['https://cdnjs.cloudflare.com/ajax/libs/flatpickr/4.6.9/flatpickr.min.js'],
                styles: ['https://cdnjs.cloudflare.com/ajax/libs/flatpickr/4.6.9/flatpickr.min.css'],
            }
        }
    },
    // focus
    {
        id: 'focus-blur',
        type: 'heading',
        title: 'Focus/Blur binding',
        desc: 'Controlling and getting notified when an element receives focus is a common task in many applications. Aurelia helps application manage this with ease.',
    },
    {
        id: 'focus-event',
        type: 'link',
        title: 'Focus tracking via event',
        desc: 'An plain way to track scroll position of a scroller is via "focus" event.',
        link: 'examples/focus.event.html',
        indent: 1,
        lazy: true,
    },
    {
        id: 'focus-binding',
        type: 'link',
        title: 'Focus tracking via binding',
        desc: 'Aurelia also provides two way binding for focus tracking, use "focus.bind" to achieve this',
        link: 'examples/focus.binding.html',
        indent: 1,
        lazy: true,
    },
    {
        id: 'focus-input',
        type: 'link',
        title: 'Focus binding with input',
        desc: 'An example of a common task: binding the focus of an <input> with a property',
        link: 'examples/focus.input.html',
        indent: 1,
        lazy: true,
    },
    {
        id: 'blur-event',
        type: 'link',
        title: 'Blur tracking via event',
        desc: 'Sometimes it is desirable to know whether an element has lost focus, a plain way to do this is via "blur" event with "blur.trigger"',
        link: 'examples/blur.event.html',
        indent: 1,
        lazy: true,
    },
    // todo: this is somehow broken now
    // {
    //   id: 'blur-binding',
    //   type: 'link',
    //   title: 'Blur tracking via binding',
    //   desc: 'Blur tracking can get complicated in the web, ' +
    //     'when there are a tree of elements that should be consider together, especially when it contains focusable element ' +
    //     'like <input>, <select> etc...' + '\nAurelia helps you manage this with ease with "blur.bind". ' +
    //     '"blur.bind" will assign a false value to the bound property whenever the focus has been truely lost from an element.',
    //   link: 'examples/blur.binding.html',
    //   indent: 1,
    //   lazy: true,
    // },
    // scroll position/scrolling
    {
        id: 'scroll',
        type: 'heading',
        title: 'Scroll position binding',
        desc: 'A common need in application is scroll position tracking. Aurelia supports this via 2 ways: event and direct binding.',
    },
    {
        id: 'scroll-event',
        type: 'link',
        title: 'Scroll tracking via event',
        desc: 'An plain way to track scroll position of a scroller is via "scroll" event.',
        link: 'examples/scroll.event.html',
        indent: 1,
        lazy: true,
        settings: {
            resultHeight: '300px',
        }
    },
    {
        id: 'scroll-binding',
        type: 'link',
        title: 'Scroll tracking via binding',
        desc: 'Aurelia is taught to handle scroll binding, supporting two way binding with scroll position with intuitiveness.',
        link: 'examples/scroll.binding.html',
        indent: 1,
        lazy: true,
        settings: {
            resultHeight: '300px',
        }
    },
    // with
    {
        id: 'with',
        type: 'heading',
        title: 'Dynamic binding scope',
        desc: 'Excessive boilerplate could comes up when binding with long property paths. Aurelia helps manage this easier with "with", like JavaScript "with" syntax',
    },
    {
        id: 'with-static',
        type: 'link',
        title: 'With + static scope',
        desc: 'A simple way to have different scope for bindings inside a view',
        link: 'examples/with.static-scope.html',
        indent: 1,
        lazy: true,
    },
    {
        id: 'with-dynamic',
        type: 'link',
        title: 'With + dynamic scope',
        desc: 'Most of the time, applications will need to switch between different objects as scope for bindings of a part of the template. '
            + '"with" supports the the dynamic assignment of scope to help handle this with ease.',
        link: 'examples/with.dynamic-scope.html',
        indent: 1,
        lazy: true,
        settings: {
            resultHeight: '300px',
        }
    },
    // let
    {
        id: 'let',
        type: 'heading',
        title: 'Declarative computed with <let/>',
        desc: 'Aurelia provides a way to declare computed value in HTML with <let/> element, ' +
            'to enhance compactness & expressiveness of templates.',
    },
    {
        id: 'let-basic',
        type: 'link',
        title: 'Let basic',
        desc: 'A simple way to declare view-only computed value',
        link: 'examples/let.basic.html',
        indent: 1,
        lazy: true,
        settings: {
            resultHeight: '300px',
        }
    },
    {
        id: 'let-to-binding-context',
        type: 'link',
        title: 'Let on binding context',
        desc: 'A way to declare computed value in the binding context from the view',
        link: 'examples/let.binding-context.html',
        indent: 1,
        lazy: true,
        settings: {
            resultHeight: '300px',
        }
    },
    // portal
    {
        id: 'portal',
        type: 'heading',
        title: 'Portalling elements',
        desc: 'There are situations that some elements of a custom element should be rendered at a different location ' +
            ' within the document, usually at the bottom of a document body. Aurelia supports this intuitively with [portal] custom attribute.'
    },
    {
        id: 'portal-basic',
        type: 'link',
        title: 'Portal basic',
        desc: 'Move an element to under the document body, while maintaining the binding context',
        link: 'examples/portal.basic.html',
        indent: 1,
        lazy: true,
        settings: {
            resultHeight: '360px',
        }
    },
    {
        id: 'portal-dynamic-css-selector',
        type: 'link',
        title: 'Portal + CSS selector',
        desc: 'Using target binding on the portal attribute, moving elements to different destination using CSS selector is a breeze.',
        link: 'examples/portal.dynamic-target-id.html',
        indent: 1,
        lazy: true,
        settings: {
            resultHeight: '360px',
        }
    },
    {
        id: 'portal-dynamic-reference',
        type: 'link',
        title: 'Portal + element reference',
        desc: 'Portal also supports element reference as target, beside CSS selectors, making it flexible in many scenarios.',
        link: 'examples/portal.dynamic-reference.html',
        indent: 1,
        lazy: true,
        settings: {
            resultHeight: '360px',
        }
    },
];

const template = html `
<div id="start"></div>
<header>
  <template if.bind="isMobile">
    <button click.trigger="showMenu = !showMenu">🍔</button>
    <a href="#start"><img id="logo" src="./images/au.svg" alt="Aurelia logo" ></a>
  </template>
  <a else href="#start"><img id="logo" src="./images/aulogo.svg" alt="Aurelia logo" /></a>
  <span>by examples</span>
  <i style="flex-grow: 1"></i>
  <a href="https://docs.aurelia.io" target="_blank" rel="noopener" style="justify-self: flex-end">\${isMobile ? 'Doc' : 'Documentation'}</a>
  <a href="https://github.com/bigopon/aurelia-by-examples" target="_blank" rel="noopener"
    style="justify-self: flex-end; display: flex; align-items: center; padding: 0.25rem;"
  >
    \${isMobile ? '' : 'Contribute'}
    <svg width="32" height="32" style="margin-right: 0.5rem"><use href="#icon-gh" /></svg>
  </a>
</header>
<main>
  <template if.bind="isMobile">
    <template if.bind="showMenu">
      <ul class="side-nav" slide style="position: fixed; top: var(--h-header); left: 0; height: calc(100vh - var(--h-header)); z-index: 99; overflow: auto">
        <li repeat.for="example of examples"
          class="nav-item"
          heading.class="isHeading(example)"
          active.class="example === selectedExample">
          <a href="#\${example.id}" css="padding-left: calc(20px + \${(example.indent || 0) * 20}px);">\${example.title}</a></li>
      </ul>
      <div
        portal
        if.bind="showMenu"
        click.trigger="showMenu = false"
        style="position: fixed;
          top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.1); z-index: 98;"></div>
    </template>
  </template>
  <ul else class="side-nav" style="flex-shrink: 0; overflow: auto">
    <li repeat.for="example of examples"
      class="nav-item"
      heading.class="isHeading(example)"
      active.class="example === selectedExample">
      <a href="#\${example.id}" css="padding-left: calc(20px + \${(example.indent || 0) * 20}px);">\${example.title}</a></li>
  </ul>
  <div class="examples">
    <section repeat.for="example of examples" section-heading.class="isHeading(example)" id.bind="example.id">
      <template if.bind="isHeading(example)">
        <h2>\${example.title}</h2>
        <p>\${example.desc}</p>
      </template>
      <example-viewer else example.bind="example" layout.bind="isMobile ? 'v' : 'h'"></example-viewer>
    </section>
    <section repeat.for="example of multiFileExamples" section-heading.class="isHeading(example)" id.bind="example.id">
      <template itemref.bind="isHeading(example)">
        <h2>\${example.title}</h2>
        <p>\${example.desc}</p>
      </template>
      <project-example-viewer example.bind="example"></project-example-viewer>
    </section>
    <section class="section-heading" id="section-heading-advanced-intro">
      <h2>Advanced examples</h2>
      <p>Above are the basic examples of what Aurelia could do, and how Aurelia could help you handle common scenarios met in an application.
The examples below will delve into more advanced scenarios to help you combine various concepts & features to create more sophisticated applications, while still keeping everything manageable and enjoyable 😃.
</p>
    </section>
    <footer>
      <div>
        <h4>Resources</h4>
        <ul>
          <li><a href="https://aurelia.io/docs/overview/what-is-aurelia">About</a></li>
          <li><a href="https://aurelia.io/blog">Blog</a></li>
          <li><a href="http://eepurl.com/ces50j">Newsletter</a></li>
        </ul>
      </div>
      <div>
        <h4>Help</h4>
        <ul>
          <li><a href="https://discourse.aurelia.io/">Discourse</a></li>
          <li><a href="https://discord.gg/sAeee2C">Discord</a></li>
          <li><a href="https://stackoverflow.com/search?q=aurelia">Stack Overflow</a></li>
        </ul>
      </div>
      <div>
        <h4>Community</h4>
        <ul>
          <li><a href="https://github.com/aurelia">GitHub</a></li>
          <li><a href="https://twitter.com/aureliaeffect">Twitter</a></li>
          <li><a href="https://github.com/orgs/aurelia/people">Team</a></li>
        </ul>
      </div>
    </footer>
  </div>
</main>
<a id="to_top" href="#start" show.bind="scrolled">^ Top</a>
`;
class App {
    p;
    examples = examples;
    static get inject() { return [IPlatform]; }
    scrolled = false;
    isMobile = false;
    constructor(p) {
        this.p = p;
    }
    binding() {
        this.handleScreenChange();
    }
    attached() {
        window.addEventListener('resize', this.handleScreenChange);
        window.addEventListener('orientationchange', this.handleScreenChange);
        document.body.addEventListener('scroll', (e) => {
            this.scrolled = document.body.scrollTop > 500;
        });
        this.p.domWriteQueue.queueTask(() => {
            const target = document.querySelector(':target');
            if (target) {
                target.scrollIntoView();
                document.querySelector(`[href="#${target.id}"]`)?.scrollIntoView();
            }
        }, { delay: 100 });
    }
    isHeading(example) {
        return example.type === 'heading';
    }
    handleScreenChange = () => {
        this.isMobile = window.innerWidth <= 768;
    };
}
CustomElement.define({
    name: 'app',
    template,
    dependencies: [{
            register(c) {
                c.register(ExampleViewer);
                c.register(Slide);
                c.register(ProjectExampleViewer);
            }
        }],
}, App);
class Slide {
    static $au = {
        type: 'custom-attribute',
        name: 'slide'
    };
    e = resolve(INode);
    attaching() {
        return this.e.animate([
            { transform: 'translateX(-300px)' },
            { transform: 'translateX(-60px)', offset: 0.2 },
            { transform: 'translateX(10px)', offset: 0.98 },
            { transform: 'translateX(0)' },
        ], {
            duration: 100
        }).finished;
    }
    detaching() {
        return this.e.animate([
            { transform: 'translateX(0)' },
            { transform: 'translateX(-100px)', offset: 0.2 },
            { transform: 'translateX(-300px)' },
        ], {
            duration: 100
        }).finished;
    }
}

const PLATFORM = BrowserPlatform.getOrCreate(globalThis);
const ct = DI.createContainer().register(Registration.instance(IPlatform, PLATFORM), StandardConfiguration, ColonPrefixedBindAttributePattern);
new Aurelia(ct)
    .app({
    host: document.body,
    component: App,
})
    .start();
// window.addEventListener('unhandledrejection', err => {
//   if (err.reason instanceof TaskAbortError) {
//     err.preventDefault();
//   }
// });
//# sourceMappingURL=index.js.map
