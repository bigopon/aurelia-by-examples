import { CustomElement, IPlatform } from "@aurelia/runtime-html";
import { ExampleViewer } from "./components/example-viewer.js";
import { html } from "./html.js";
const template = html `
<div id="start"></div>
<header>
  <a href="#start"><img id="logo" src="./images/aulogo.svg" alt="Aurelia logo" /></a>
  <span>by examples</span>
  <i style="flex-grow: 1"></i>
  <a href="https://docs.aurelia.io" target="_blank" rel="noopener" style="justify-self: flex-end">Documentation</a>
  <a href="https://github.com/bigopon/aurelia-by-examples" target="_blank" rel="noopener"
    style="justify-self: flex-end; display: flex; align-items: center; padding: 0.25rem;"
  >
    Contribute
    <svg width="32" height="32" style="margin-right: 0.5rem"><use href="#icon-gh" /></svg>
  </a>
</header>
<main>
  <ul class="side-nav" style="flex-shrink: 0; overflow: auto">
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
      <example-viewer else example.bind="example"></example-viewer>
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
export class App {
    constructor(p) {
        this.p = p;
        this.examples = [
            // hello world section
            {
                id: 'basic',
                type: 'heading',
                title: 'Aurelia by examples',
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
            },
            {
                id: 'templating-syntax-attribute',
                type: 'link',
                title: 'Setting attribute',
                desc: 'By default, "aria-", "data-", "class", "styles" and standard svg attributes are treated as attribute, instead of properties.',
                link: 'examples/basic.attribute.html',
                indent: 1,
            },
            {
                id: 'templating-syntax-attribute-class',
                type: 'link',
                title: 'Setting classes',
                desc: 'Interpolation and ".class" binding command can be used to set a class on an element',
                link: 'examples/basic.attribute-class.html',
                indent: 1,
            },
            {
                id: 'templating-syntax-attribute-style',
                type: 'link',
                title: 'Setting styles',
                desc: 'Interpolation and ".style" binding command can be used to set one or many styles on an element',
                link: 'examples/basic.attribute-style.html',
                indent: 1
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
                id: 'portal-dynamic-target',
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
        ];
        this.scrolled = false;
    }
    static get inject() { return [IPlatform]; }
    attached() {
        document.body.addEventListener('scroll', (e) => {
            this.scrolled = document.body.scrollTop > 500;
        });
        this.p.domWriteQueue.queueTask(() => {
            document.querySelector(':target')?.scrollIntoView();
        }, { delay: 100 });
    }
    isHeading(example) {
        return example.type === 'heading';
    }
}
CustomElement.define({
    name: 'app',
    template,
    dependencies: [ExampleViewer],
}, App);
