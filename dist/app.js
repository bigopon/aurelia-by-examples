import { __decorate } from "tslib";
import { customElement } from "@aurelia/runtime-html";
import { InlineComponentEditor } from "./components/component-editor.js";
import { ExampleViewer } from "./components/example-viewer.js";
import { ResultViewer } from "./components/result-viewer.js";
import { html } from "./html.js";
let App = class App {
    constructor() {
        this.examples = [
            {
                id: 'first',
                title: 'Basic hello world',
                type: 'inline',
                code: {
                    script: [
                        'export class App {',
                        '  message = "Hello world";',
                        '}'
                    ].join('\n'),
                    template: [
                        '<input value.bind=message>',
                        '<h1>${message}</h1>'
                    ].join('\n'),
                    styles: []
                }
            },
            {
                id: 'conditional',
                title: 'Conditional binding',
                type: 'link',
                link: 'examples/condition.if.html',
            }
        ];
        this.select(this.examples[0]);
    }
    select(example) {
        if (example.type === 'link') {
            fetch(example.link)
                .then(r => r.ok ? r.text() : (() => { throw new Error('Unable to fetch example code'); })())
                .then(text => {
                const code = this.parseExample(text);
                console.log(code.template);
                this.selectedExample = { id: example.id, type: 'inline', title: example.title, code: code };
            });
        }
        else {
            this.selectedExample = example;
        }
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
            script = 'export class __AnonymousComponent__ { }';
        }
        return {
            script: script.trimStart(),
            template: Array
                .from(template.content.childNodes)
                .reduce((code, node) => code + (node.nodeType === 1 ? node.outerHTML : node.textContent), ''),
            styles
        };
    }
};
App = __decorate([
    customElement({
        name: 'app',
        template: html `
<div style="display: flex">
  <ul style="flex: 1 0 auto; min-width: 300px; max-width: 300px">
    <li repeat.for="example of examples"
      active.class="example === selectedExample"
      click.trigger="select(example)">\${example.title}</li>
  </ul>
  <div style="flex: 1 0 auto;">
    <example-viewer example.bind="selectedExample" style="height: 300px;"></example-viewer>
  </div>
</div>
  `,
        dependencies: [
            ExampleViewer,
            InlineComponentEditor,
            ResultViewer,
        ],
    })
], App);
export { App };
