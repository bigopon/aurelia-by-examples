# Introduction

`Aurelia by examples` is a collection of examples of basic and advanced coding practices & syntaxes that a dev probably will encounter when developing applications with Aurelia. This can be used as a cheat sheet, and a playground to help any dev quickly verify their ideas.

The playground employs native "importmap" feature of the web, making it possible to write code like this
```ts
import { DI } from '@aurelia/kernel';
```
and it will still work in the browser, without any bundling steps.

Though, there's no native support for decorator yet, so for now, custom element, custom attribute, value converter and binding behavior will have to be declared using the vanilla form, like the following examples:

```ts
import { CustomElement, CustomAttribute, ValueConverter, BindingBehavior } from '@aurelia/runtime-html';

class App {
    message = 'Hello world!';
}
CustomElement.define({ name: 'my-app', template: '${message}' }, App);

// similar for custom attribute with CustomAttribute, value converter with ValueConverter
// and binding behavior with BindingBehavior
```
