import { DI, Registration } from "@aurelia/kernel";
import { BrowserPlatform } from '@aurelia/platform-browser';
import { StandardConfiguration, Aurelia, IPlatform } from "@aurelia/runtime-html";
import { ColonPrefixedBindAttributePattern } from '@aurelia/template-compiler';
import { App } from "./app.js";

const PLATFORM = BrowserPlatform.getOrCreate(globalThis);
const ct = DI.createContainer().register(
  Registration.instance(IPlatform, PLATFORM),
  StandardConfiguration,
  ColonPrefixedBindAttributePattern,
);
new Aurelia(ct)
  .app({
    host: document.body,
    component: App,
  })
  .start();

// window.addEventListener('unhandledrejection', err => {
//   if (err.reason instanceof TaskAbortError) {
//     err.preventDefault();
//   }
// });
