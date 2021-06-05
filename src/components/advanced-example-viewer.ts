// import { IContainer } from "@aurelia/kernel";
// import { bindable, BindingMode, customElement, ValueConverter } from "@aurelia/runtime-html";
// import { html } from "../html.js";
// import { TextEditor } from "./text-editor.js";

// import type { IComponentCode, IExample, IExampleApp } from "../interfaces.js";

// const enum EditorMode {
//   script = 1,
//   template = 2,
//   all = 3,
// }


// interface ILoadedExampleApp {
//   id: string;
//   title: string;
//   desc?: string;
//   files: ILoadedFile[];
// }

// interface ILoadedFile {
//   mode?: EditorMode;
//   name: string;
//   link: string;
//   script: string;
//   template: string;
//   styles: string[];
// }

// interface IFile {
//   readonly path: string;
//   readonly content: string;
//   dispose(): void;
// }

// interface IParsedScript {
//   lines: string[],
//   mainClass: string;
// }

// @customElement({
//   name: 'example-viewer-advanced',
//   template:
//   html<ExampleViewerAdvanced>`<template style="display: block;">
//     <let i.bind="0"></let>
//     <h3
//       id.bind=${v => v.example.id}
//       show.bind="${v => v.example.title}">\${${v => v.example.title}}</h3>
//     <p
//       show.bind="${v => v.example.desc}">$\{${v => v.example.desc}}</p>
//     <button show.bind="!shouldRender" click.trigger="forceLoad = true">Load example</button>
//     <div if.bind="shouldRender" promise.bind="example | resolve :i">
//       <button pending disabled>Loading example...</button>
//       <div then.from-view="$app">
//         <let selected-file.bind="$app | firstFile"></let>
//         <header>
//           <button repeat.for="file of $app.files" click.trigger="selectedFile = file">\${file.name}</button>
//         </header>
//         <inline-editor
//           view-model.ref="inlineEditor"
//           mode.bind="selectedFile.mode || 3"
//           code.bind="selectedFile.script"
//           template.bind="selectedFile.template"
//           style="height: 300px;"></inline-editor>
//         <!--<result-viewer
//           app.bind="$app"
//           title.bind="$data.title"
//           code.bind="$data.code.script"
//           template.bind="$data.code.template"
//           styles.bind="$data.code.styles"
//           height.style="$data.settings.resultHeight"></result-viewer>-->
//       </div>
//       <span catch.from-view="$err">There's an error loading the example \${example.id}.
//         Maybe try <button click.trigger="i = i + 1">reloading.</button>
//       </span>
//     </div>
//   `,
//   dependencies: [
//     {
//       register(container: IContainer) {
//         return container.register(ResultViewer, InlineComponentEditor);
//       }
//     },
//     ValueConverter.define('resolve', class Resolve {
//       static get inject() { return [ExampleAppLoader]; }

//       constructor(private loader: ExampleAppLoader) {}

//       toView(v: IExampleApp) {
//         return this.loader.load(v);
//       }
//     }),
//     ValueConverter.define('firstFile', class FirstFile {
//       toView(v: ILoadedExampleApp) {
//         return v.files[0];
//       }
//     })
//   ]
// })
// export class ExampleViewerAdvanced {
//   @bindable title: string = '';

//   @bindable example!: IExample;

//   forceLoad = false;

//   get shouldRender() {
//     const { example } = this;
//     return this.forceLoad || example.lazy !== true;
//   }
// }

// class ExampleAppLoader {
//   private cache: Record<string, ILoadedExampleApp> = Object.create(null);
//   private loadingExample: Record<string, Promise<ILoadedExampleApp>> = Object.create(null);

//   load(example: IExampleApp): Promise<ILoadedExampleApp> {
//     const id = example.id;
//     if (this.cache[id]) {
//       return Promise.resolve(this.cache[id]);
//     }
//     if (this.loadingExample[id]) {
//       return this.loadingExample[id];
//     }
//     // this is wrong, as it shouldn't cache
//     return this.loadingExample[id] = Promise
//       .all(example.files.map(f =>
//         fetch(`${f.link}?t=${Date.now()}`)
//           .then(r => r.ok ? r.text() : (() => { throw new Error('Unable to fetch example code') })())
//           .then(text => ({ ...this.parseExample(text), name: f.name, link: f.link }) as ILoadedFile)
//       ))
//       .then(
//         files => {
//           const mainModule = files.find(f => f.name === 'main');
//           if (!mainModule) {
//             files = [
//               {
//                 link: 'synthetic-main',
//                 name: 'main',
//                 mode: EditorMode.script,
//                 script: createDefaultBootScript(files[0].name),
//                 template: '',
//                 styles: []
//               },
//               ...files
//             ]
//           }
//           delete this.loadingExample[id];
//           return { ...example, files };
//         },
//         ex => {
//           delete this.loadingExample[id];
//           console.log('???\n', ex);
//           throw ex;
//         }
//       );
//   }

//   parseExample(code: string): IComponentCode {
//     const scriptStartIdx = code.indexOf('<script>');
//     const scriptEndIdx = code.indexOf('</script>');
//     const script = Math.max(scriptStartIdx, scriptEndIdx, -1) > -1
//       ? code.substring(scriptStartIdx + 8, scriptEndIdx).trimStart()
//       : 'export class App {}';
//     const styleStartIndex = code.lastIndexOf('<style>');
//     const template = scriptStartIdx > -1
//       ? code.substring(0, scriptStartIdx).trim()
//       : styleStartIndex > -1
//         ? code.substring(0, styleStartIndex)
//         : code;
//     const styleCode = code.substr(scriptEndIdx + 9);
//     const styles: string[] = [];
//     const styleParser = document.createElement('div');
//     styleParser.innerHTML = `<template>${styleCode}</template>`;
//     Array.from((styleParser.firstChild as HTMLTemplateElement).content.children).forEach(c => {
//       if (c.tagName === 'STYLE') {
//         styles.push(c.textContent || '');
//       }
//     });
//     return { script, template, styles };
//   }
// }

// function createDefaultBootScript(appModuleName: string): string {
//   return (
// `import { DI, Registration } from "@aurelia/kernel";
// import { StandardConfiguration, Aurelia, IPlatform } from "@aurelia/runtime-html";
// import { BrowserPlatform } from '@aurelia/platform-browser';
// import { App } from "./${appModuleName}";

// const PLATFORM = window.PLATFORM = BrowserPlatform.getOrCreate(globalThis);
// new Aurelia()
//   .register(
//     Registration.instance(IPlatform, PLATFORM),
//     StandardConfiguration
//   )
//   .app({ host: document.body, component: App })
//   .start();`
//   );
// }


// @customElement({
//   name: 'inline-editor',
//   template:
//     html<InlineComponentEditor>`<template style="display: flex;">
//       <text-editor
//         view-model.ref="htmlEditor" lang="html"
//         value.bind="${e => e.template}"
//         style="flex: 1 0 48%; outline: 1px solid grey;"
//         hide.bind="scriptOnly"></text-editor>
//       <div style="margin: 0 calc(2% - 4px); width: 4px; background: black" hide.bind="scriptOnly || templateOnly"></div>
//       <text-editor
//         view-model.ref="scriptEditor"
//         value.bind="${e => e.code}"
//         style="flex: 1 0 48%; outline: 1px solid grey;"
//         hide.bind="templateOnly"></text-editor>
//     </template>`,
//   dependencies: [TextEditor]
// })
// class InlineComponentEditor {
//   @bindable({ mode: BindingMode.twoWay }) code: string = '';
//   @bindable({ mode: BindingMode.twoWay }) template: string = '';
//   @bindable mode = EditorMode.all;

//   htmlEditor!: TextEditor;
//   scriptEditor!: TextEditor;

//   get scriptOnly() {
//     return this.mode === 1;
//   }

//   get templateOnly() {
//     return this.mode === 2;
//   }

//   async modeChanged() {
//     // value binding in code mirror refreshes before the style binding
//     // resulting in blank editor, and requires a click to refresh
//     // so force a refresh after selecting a new file
//     // and it takes more than a frame for Codemirror to render, so using a setTimeout instead of taskqueue
//     setTimeout(() => {
//       if (this.scriptOnly) {
//         this.scriptEditor.focus();
//       } else {
//         this.htmlEditor.focus();
//       }
//     });
//   }
// }

// // TODO: handle convention

// @customElement({
//   name: 'result-viewer',
//   template:
//     html<ResultViewer>`<template style="display: block"><iframe ref=iframe title.bind="${x => x.app.title}" style="width: 100%; height: 100%; border: 0;">`
// })
// class ResultViewer {

//   @bindable title: string = '';
//   @bindable code: string = '';
//   @bindable template: string = '';
//   @bindable styles: string[] = [];
//   @bindable app!: ILoadedExampleApp;

//   readonly iframe!: HTMLIFrameElement;
//   private file: IFile = { path: '', content: '', dispose: () => {} };

//   bound() {
    
//   }

//   async attached() {
//     this.refresh(generateFile(this.code, this.template, this.styles, await import('typescript')));
//   }

//   detached() {
//     this.file.dispose();
//   }

//   private prepare(app: ILoadedExampleApp) {

//   }

//   refresh(file: IFile) {
//     this.file.dispose();
//     this.file = file;
//     this.iframe.src = file.path;
//   }

//   private refreshId: number = 0;
//   propertyChanged() {
//     clearTimeout(this.refreshId);
//     this.refreshId = setTimeout(async () => {
//       try {
//         this.refresh(generateFile(this.code, this.template, this.styles, await import('typescript')));
//       } catch (ex) {
//         console.info(ex);
//       }
//     }, 250);
//   }
// }


// function generateFile(code: string, template: string, styles: string[], ts: typeof import('typescript')): IFile {
//   const html = generateHtml(code, template, styles, ts);
//   const blob = new Blob([html], { type: 'text/html' });
//   const path = URL.createObjectURL(blob);
//   return {
//     path,
//     content: html,
//     dispose: () => { URL.revokeObjectURL(path); }
//   };
// }

// function generateHtml(code: string, template: string, styles: string[], ts: typeof import('typescript')) {
//   const lines = code ? code.split('\n') : [];
//   const pkgs = lines.map(l => getImportedPackage(l)).filter(Boolean) as string[];
//   const script: IParsedScript = lines.length > 0 ? addBootScript(ensureCustomElement(lines, template, ts)) : { lines: [], mainClass: '' };
//   return `<html><head>` +
//     `<script type="importmap">${createImportMap(pkgs)}</script>` +
//     `<script type="module">${script.lines.join('\n')}</script>` +
//     '<style>html,body {margin: 0; padding-top: 4px;}html {font-family: Helvetica, sans-serif;}</style>' +
//     `<style>${styles.join('\n')}</style>` +
//   `</head><body>` +
//   `</body></html>`;
// }

// function addBootScript(script: IParsedScript): IParsedScript {
//   return {
//     lines: script.lines.concat([
//       'import { DI as __DI, Registration as __R } from "@aurelia/kernel";',
//       'import { StandardConfiguration as __SC, Aurelia as __Au, IPlatform as __IP } from "@aurelia/runtime-html";',
//       "import { BrowserPlatform as __BP } from '@aurelia/platform-browser';",
//       '(() => {',
//         'const PLATFORM = window.PLATFORM = __BP.getOrCreate(globalThis);',
//         'const ct = __DI.createContainer().register(__R.instance(__IP, PLATFORM), __SC);',
//         `new __Au(ct).app({ host: document.body, component: ${script.mainClass} }).start();`,
//       '})();'
//     ]),
//     mainClass: script.mainClass
//   }
// }

// function ensureCustomElement(script: string, template: string, ts: typeof import('typescript')) {
//   const sourceFile = ts.createSourceFile("any", script, ts.ScriptTarget.ES2020, void 0, ts.ScriptKind.TS);
//   let className = '';
//   let firstClassName = '';
//   sourceFile.statements.forEach(statement => {
//     if (className) {
//       return;
//     }
//     if (ts.isClassDeclaration(statement)) {
//       if (statement.decorators) {
//         for (const decorator of statement.decorators) {
//           if (ts.isCallExpression(decorator.expression) && ts.isIdentifier(decorator.expression.expression)) {
//             const decoratorName = decorator.expression.expression.escapedText;
//             if (decoratorName === 'customElement') {
//               className = statement.name
//                 ? statement.name.text
//                 : (() => { throw new Error('Default export not supported') })();
//               break;
//             }
//           }
//         }
//       }
//     }
//   });
//   if (!className) {
//     throw new Error('Unable to find a custom element');
//   }
//   return {
//     script: script + `
// import { CustomElement as __CE } from "@aurelia/runtime-html";
// const __template = ${JSON.stringify(`${template}`)};
// if (!__CE.isType(${className})) __CE.define({ name: '${_hyphenate(className)}', template: __template }, ${className});
// `,
//     // lines: script.concat([
//     //   'import { CustomElement as __CE } from "@aurelia/runtime-html";',
//     //   `const __template = ${JSON.stringify(`${template}`)};`,
//     //   `if (!__CE.isType(${className})) __CE.define({ name: '${camelCase(className)}', template: __template }, ${className});`
//     // ]),
//     mainClass: className
//   };
// }

// function createImportMap(packages: string[]) {
//   return JSON.stringify({
//     imports: Object.assign(packages
//       .reduce((all, pkg) => {
//         all[pkg] = `https://unpkg.com/${isAureliaPkg(pkg) ? `${pkg}@dev`: pkg}`;
//         return all;
//       }, {}), {
//         "@aurelia/kernel": "https://unpkg.com/@aurelia/kernel@dev/dist/bundle/index.js",
//         "@aurelia/runtime": "https://unpkg.com/@aurelia/runtime@dev/dist/bundle/index.js",
//         "@aurelia/runtime-html": "https://unpkg.com/@aurelia/runtime-html@dev/dist/bundle/index.js",
//         "@aurelia/platform": "https://unpkg.com/@aurelia/platform@dev/dist/bundle/index.js",
//         "@aurelia/platform-browser": "https://unpkg.com/@aurelia/platform-browser@dev/dist/bundle/index.js",
//         "@aurelia/metadata": "https://unpkg.com/@aurelia/metadata@dev/dist/bundle/index.js",
//       }),
//   }, undefined, 2);
// }

// function createImportMap2(app: ILoadedExampleApp, ts: typeof import('typescript')) {
//   return JSON.stringify({
//     imports: Object.assign(app.files
//       .reduce((all, file) => {
//         all[file] = `https://unpkg.com/${file}`;
//         return all;
//       }, {}), {
//         "@aurelia/kernel": "https://unpkg.com/@aurelia/kernel@dev/dist/bundle/index.js",
//         "@aurelia/runtime": "https://unpkg.com/@aurelia/runtime@dev/dist/bundle/index.js",
//         "@aurelia/runtime-html": "https://unpkg.com/@aurelia/runtime-html@dev/dist/bundle/index.js",
//         "@aurelia/platform": "https://unpkg.com/@aurelia/platform@dev/dist/bundle/index.js",
//         "@aurelia/platform-browser": "https://unpkg.com/@aurelia/platform-browser@dev/dist/bundle/index.js",
//         "@aurelia/metadata": "https://unpkg.com/@aurelia/metadata@dev/dist/bundle/index.js",
//       }),
//   }, undefined, 2);
// }

// function isAureliaPkg(pkg: string) {
//   return pkg === 'aurelia' || pkg.startsWith('@aurelia');
// }

// function getImportedPackage(line: string): string | null {
//   return line.match(/^\s*import\s+(?:.*?)\s+from\s+['"](.*)['"]\s*;?\s*$/)?.[1] ?? null;
// }

// class PoorFs {
//   private files: Record<string, string>;

//   constructor(files: Record<string, string>) {
//     this.files = { ...files };
//   }

//   writeFileSync(path: string, content: string) {

//   }
// }


// const capitalMatcher = /([A-Z])/g;

// function addHyphenAndLower(char: string) {
//   return '-' + char.toLowerCase();
// }

// function _hyphenate(name: string) {
//   return (name.charAt(0).toLowerCase() + name.slice(1)).replace(capitalMatcher, addHyphenAndLower);
// }
