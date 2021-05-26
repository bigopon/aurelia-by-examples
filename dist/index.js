import { DI, Registration } from "@aurelia/kernel";
import { StandardConfiguration as SC, Aurelia, BrowserPlatform, IPlatform, CustomElement } from "@aurelia/runtime-html";
import { ResultViewer } from './components/result-viewer.js';
import { InlineComponentEditor } from './components/component-editor.js';
const PLATFORM = BrowserPlatform.getOrCreate(globalThis);
const ct = DI.createContainer().register(Registration.instance(IPlatform, PLATFORM), SC);
const au = new Aurelia(ct);
au.app({
    host: document.body,
    component: CustomElement.define({
        name: 'app',
        template: [
            '<inline-editor code.bind="code" template.bind="template" style="height: 300px"></inline-editor>',
            '<result-viewer code.bind="code" template.bind="template"></result-viewer>',
        ].join('\n'),
        dependencies: [InlineComponentEditor, ResultViewer],
    }, class App {
        constructor() {
            this.code = [
                'export class App {',
                '  message = "Hello world";',
                '}'
            ].join('\n');
            this.template = [
                '<input value.bind=message>',
                '<h1>${message}</h1>'
            ].join('\n');
        }
    })
}).start();
