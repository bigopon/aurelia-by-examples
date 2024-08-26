import { IContainer, resolve } from "@aurelia/kernel";
import { customAttribute, CustomAttributeStaticAuDefinition, customElement, CustomElement, INode, IPlatform } from "@aurelia/runtime-html";
import { ExampleViewer } from "./components/example-viewer.js";
import { ProjectExampleViewer } from './components/project-example-viewer.js';
import { html } from "./html.js";
import type { IExample } from "./interfaces.js";
import { AureliaExample, examples, IExampleHeading } from "./app.example.js";

const template = html<App>`
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
`

export class App {
  examples: AureliaExample[] = examples;

  static get inject() { return [IPlatform]; }
  
  scrolled = false;
  isMobile = false;

  constructor(private p: IPlatform) {}

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

  isHeading(example: IExample | IExampleHeading): example is IExampleHeading {
    return example.type === 'heading';
  }

  handleScreenChange = () => {
    this.isMobile = window.innerWidth <= 768;
  }
}

CustomElement.define({
  name: 'app',
  template,
  dependencies: [{
    register(c: IContainer) {
      c.register(ExampleViewer);
      c.register(Slide);
      c.register(ProjectExampleViewer);
    }
  }],
}, App);

class Slide {

  static $au: CustomAttributeStaticAuDefinition = {
    type: 'custom-attribute',
    name: 'slide'
  }
  private e = resolve(INode) as HTMLElement;

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
