import { __decorate } from "tslib";
import { camelCase } from "@aurelia/kernel";
import { bindable, customElement } from "@aurelia/runtime-html";
let ResultViewer = class ResultViewer {
    constructor() {
        this.code = '';
        this.template = '';
    }
    attached() {
        this.iframe.src = generateFile(this.code, this.template).src;
    }
};
__decorate([
    bindable
], ResultViewer.prototype, "code", void 0);
__decorate([
    bindable
], ResultViewer.prototype, "template", void 0);
ResultViewer = __decorate([
    customElement({
        name: 'result-viewer',
        template: `<iframe ref=iframe style="width: 100%; height: 100%; border: 0;">`
    })
], ResultViewer);
export { ResultViewer };
function generateFile(code, template) {
    const html = generateHtml(code, template);
    const blob = new Blob([html], { type: 'text/html' });
    const src = URL.createObjectURL(blob);
    return {
        src,
        content: html,
        destroy: () => { URL.revokeObjectURL(src); }
    };
}
function generateHtml(code, template) {
    const lines = code.split('\n');
    const pkgs = lines.map(l => getImportedPackage(l)).filter(Boolean);
    const script = addBootScript(ensureCustomElement(lines, template));
    return `<html><head>` +
        `<script type="importmap">${createImportMap(pkgs)}</script>` +
        `<script type="module">${script.lines.join('\n')}</script>` +
        `</head><body>` +
        `</body></html>`;
}
function addBootScript(script) {
    return {
        lines: script.lines.concat([
            'import { DI as __DI, Registration as __R__ } from "@aurelia/kernel";',
            'import { StandardConfiguration as __SC, Aurelia as __Au, IPlatform as __IP } from "@aurelia/runtime-html";',
            "import { BrowserPlatform as __BP } from '@aurelia/platform-browser'",
            'const PLATFORM = window.PLATFORM = __BP.getOrCreate(globalThis);',
            'const __ct = __DI.createContainer().register(__R__.instance(__IP, PLATFORM), __SC);',
            'const __au = new __Au(__ct);',
            `__au.app({ host: document.body, component: ${script.mainClass} }).start();`,
        ]),
        mainClass: script.mainClass
    };
}
function ensureCustomElement(lines, template) {
    let className;
    for (const l of lines) {
        const match = l.match(/^\s*export\s+class\s+([^a-zA-Z_$][a-zA-Z\d_$]*)\s*{$/);
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
            `const __template = ${template};`,
            `if (!__CE.isType(${className}) __CE.define({ name: '${camelCase(className)}', template: __template });`
        ]),
        mainClass: className
    };
}
function createImportMap(packages) {
    return JSON.stringify({
        imports: packages
            .reduce((all, pkg) => {
            all[pkg] = `https://unpkg.com/${isAureliaPkg(pkg) ? `${pkg}@dev` : pkg}`;
            return all;
        }, {}),
    }, undefined, 2);
}
function isAureliaPkg(pkg) {
    return pkg === 'aurelia' || pkg.startsWith('@aurelia');
}
function getImportedPackage(line) {
    return line.match(/^\s*import\s+(?:.*?)\s+from\s+['"](.*)['"]\s*;?\s*$/)?.[1] ?? null;
}
