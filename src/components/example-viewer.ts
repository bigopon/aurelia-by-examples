import { camelCase, IContainer } from "@aurelia/kernel";
import { bindable, customElement, valueConverter } from "@aurelia/runtime-html";
import { html } from "../html.js";
import { InlineComponentEditor } from "./component-editor.js";

import type { IComponentCode, IExample, IExampleSettings, ILinkExample, ILoadedLinkExample } from "../interfaces.js";

@customElement({
  name: 'example-viewer',
  template:
  html<ExampleViewer>`<template style="display: block;">
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
    register(container: IContainer) {
      return container.register(InlineComponentEditor, ResultViewer, ResolveValueConverter);
    }
  }]
})
export class ExampleViewer {
  @bindable title: string = '';

  @bindable example!: IExample;

  @bindable layout: 'v' | 'h' = 'h';

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

@valueConverter('resolve')
class ResolveValueConverter {
  static get inject() { return [ExampleLoader]; }

  constructor(private loader: ExampleLoader) {}

  toView(v: IExample) {
    return v.type === 'inline' ? Promise.resolve(v) : this.loader.load(v);
  }
}

@customElement({
  name: 'result-viewer',
  template: `<template style="display: block"><iframe ref=iframe title.bind="title" style="width: 100%; height: 100%; border: 0;">`
})
class ResultViewer {

  @bindable title: string = '';
  @bindable code: string = '';
  @bindable template: string = '';
  @bindable styles: string[] = [];
  @bindable globals: { scripts?: string[]; styles?: string[] } = {};

  readonly iframe!: HTMLIFrameElement;
  private file: IFile = { path: '', content: '', dispose: () => {} };

  attached() {
    this.refresh(generateFile(this.code, this.template, this.styles, this.globals));
  }

  detached() {
    this.file.dispose();
    this.file = { path: '', content: '', dispose: () => {} };
  }

  refresh(file: IFile) {
    this.file.dispose();
    this.file = file;
    this.iframe.src = file.path;
  }

  private refreshId: number = 0;
  propertyChanged() {
    clearTimeout(this.refreshId);
    this.refreshId = setTimeout(() => {
      try {
        this.refresh(generateFile(this.code, this.template, this.styles, this.globals));
      } catch (ex) {
        console.info(ex);
      }
    }, 250);
  }
}

interface IFile {
  readonly path: string;
  readonly content: string;
  dispose(): void;
}

interface IParsedScript {
  lines: string[],
  mainClass: string;
}

function generateFile(code: string, template: string, styles: string[], globals: IExampleSettings['globals']): IFile {
  const html = generateHtml(code, template, styles, globals);
  const blob = new Blob([html], { type: 'text/html' });
  const path = URL.createObjectURL(blob);
  return {
    path,
    content: html,
    dispose: () => { URL.revokeObjectURL(path); }
  };
}

function generateHtml(code: string, template: string, styles: string[], globals: IExampleSettings['globals'] = {}) {
  const lines = code ? code.split('\n') : [];
  const pkgs = lines.map(l => getImportedPackage(l)).filter(Boolean) as string[];
  const script: IParsedScript = lines.length > 0 ? addBootScript(ensureCustomElement(lines, template)) : { lines: [], mainClass: '' };
  return (
`<html><head>
  <base href="${location.origin}">
  ${globals.scripts?.map(s => `<script src="${s}"></script>`).join('\n') ?? ''}
  ${globals.styles?.map(s => `<link rel="stylesheet" href="${s}" />`).join('\n') ?? ''}
  <script type="importmap">${createImportMap(pkgs)}</script>
  <script type="module">${script.lines.join('\n')}</script>
  <style>html,body {margin: 0; padding-top: 4px;}html {font-family: Helvetica, sans-serif;}</style>
  <style>${styles.join('\n')}</style>
</head><body></body></html>`);
}

function addBootScript(script: IParsedScript): IParsedScript {
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
  }
}

function ensureCustomElement(lines: string[], template: string) {
  let className: string | undefined;
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

function createImportMap(packages: string[]) {
  return JSON.stringify({
    imports: Object.assign(packages
      .reduce((all, pkg) => {
        all[pkg] = `https://unpkg.com/${isAureliaPkg(pkg) ? `${pkg}@dev`: pkg}`;
        return all;
      }, {}), {
        "@aurelia/kernel": "https://unpkg.com/@aurelia/kernel@dev/dist/esm/index.js",
        "@aurelia/runtime": "https://unpkg.com/@aurelia/runtime@dev/dist/esm/index.js",
        "@aurelia/runtime-html": "https://unpkg.com/@aurelia/runtime-html@dev/dist/esm/index.js",
        "@aurelia/platform": "https://unpkg.com/@aurelia/platform@dev/dist/esm/index.js",
        "@aurelia/platform-browser": "https://unpkg.com/@aurelia/platform-browser@dev/dist/esm/index.js",
        "@aurelia/metadata": "https://unpkg.com/@aurelia/metadata@dev/dist/esm/index.js",
      }),
  }, undefined, 2);
}

function isAureliaPkg(pkg: string) {
  return pkg === 'aurelia' || pkg.startsWith('@aurelia');
}

function getImportedPackage(line: string): string | null {
  return line.match(/^\s*import\s+(?:.*?)\s+from\s+['"](.*)['"]\s*;?\s*$/)?.[1] ?? null;
}
