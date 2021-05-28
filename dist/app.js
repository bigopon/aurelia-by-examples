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
                title: 'Hello world',
                type: 'inline',
                desc: 'A basic example of Aurelia template. Hello world!',
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
                id: 'conditional-if-else',
                title: 'Conditional rendering using if/else',
                type: 'link',
                desc: 'Examples of conditional rendering syntaxes in Aurelia with if/else.' +
                    'Using this when it is desirable to remove the elements when the condition is false/falsy',
                link: 'examples/condition.if-else.html',
            },
            {
                id: 'conditional-switch',
                title: 'Conditional rendering using switch',
                type: 'link',
                desc: 'Examples of conditional rendering syntaxes in Aurelia with switch/case/default.' +
                    'Using this when it is desirable to have the semantic of switch syntax',
                link: 'examples/condition.switch.html',
            }
        ];
    }
};
App = __decorate([
    customElement({
        name: 'app',
        template: html `
<div style="display: flex;">
  <ul style="position: sticky; top: 0; flex: 1 0 auto; min-width: 300px; max-width: 300px; align-self: flex-start;">
    <li repeat.for="example of examples"
      active.class="example === selectedExample"><a href="#\${example.id}">\${example.title}</a></li>
  </ul>
  <div style="flex: 1 0 auto;">
    <section repeat.for="example of examples">
      <example-viewer example.bind="example"></example-viewer>
    </section>
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
