import { DI, Registration, TaskAbortError } from "@aurelia/kernel";
import { StandardConfiguration as SC, Aurelia, BrowserPlatform, IPlatform } from "@aurelia/runtime-html";
import { App } from "./app.js";

document.body.textContent = '';

const PLATFORM = BrowserPlatform.getOrCreate(globalThis);
const ct = DI.createContainer().register(Registration.instance(IPlatform, PLATFORM), SC);
new Aurelia(ct)
  .app({
    host: document.body,
    component: App,
  })
  .start();

window.addEventListener('unhandledrejection', err => {
  if (err.reason instanceof TaskAbortError) {
    err.preventDefault();
  }
});
