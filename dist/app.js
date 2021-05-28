import { __decorate } from "tslib";
import { customElement } from "@aurelia/runtime-html";
import { ExampleViewer } from "./components/example-viewer.js";
import { html } from "./html.js";
let App = class App {
    constructor() {
        this.examples = [
            {
                id: 'basic',
                type: 'heading',
                title: 'Hello world',
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
                id: 'conditional-rendering',
                title: 'Conditional rendering',
                type: 'heading',
            },
            {
                id: 'conditional-show-hide',
                title: 'With show/hide',
                type: 'link',
                desc: 'An example of conditional rendering syntaxes in Aurelia with show/hide. ' +
                    'Using this when it is desirable to hide/show an element without removing it from the document.',
                link: 'examples/conditional.show-hide.html',
                indent: 1,
            },
            {
                id: 'conditional-if-else',
                title: 'With if/else',
                type: 'link',
                desc: 'Examples of conditional rendering syntaxes in Aurelia with if/else.' +
                    'Using this when it is desirable to remove the elements when the condition is false/falsy',
                link: 'examples/conditional.if-else.html',
                indent: 1,
            },
            {
                id: 'conditional-switch',
                title: 'With switch',
                type: 'link',
                desc: 'Examples of conditional rendering syntaxes in Aurelia with switch/case/default.' +
                    'Using this when it is desirable to have the semantic of switch syntax',
                link: 'examples/conditional.switch.html',
                indent: 1,
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
            }
        ];
    }
    isHeading(example) {
        return example.type === 'heading';
    }
};
App = __decorate([
    customElement({
        name: 'app',
        template: html `
<header>

</header>
<div style="display: flex;">
  <ul class="side-nav" style="flex-shrink: 0; align-self: flex-start;">
    <li repeat.for="example of examples"
      class="nav-item"
      heading.class="isHeading(example)"
      active.class="example === selectedExample">
      <a href="#\${example.id}" style="padding-left: calc(20px + \${(example.indent || 0) * 20}px);">\${example.title}</a></li>
  </ul>
  <main style="flex-grow: 1; min-width: 0;">
    <template repeat.for="example of examples">
      <h2 if.bind="isHeading(example)" id.bind="example.id">\${example.title}</h2>
      <section else id.bind="example.id" style="width: 100%;">
        <example-viewer example.bind="example"></example-viewer>
      </section>
    </template>
  </main>
</div>
<footer>
  <div>
    <h4>Resources</h4>
    <ul>
      <li><a href="docs/overview/what-is-aurelia">About</a></li>
      <li><a href="blog">Blog</a></li>
      <li><a href="http://eepurl.com/ces50j">Newsletter</a></li>
    </ul>
  </div>
  <div>
    <h4>Help</h4>
    <ul>
      <li><a href="https://discourse.aurelia.io/">Discourse</a></li>
      <li><a href="https://gitter.im/aurelia/Discuss">Gitter</a></li>
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
  `,
        dependencies: [ExampleViewer],
    })
], App);
export { App };
class Footer {
}
