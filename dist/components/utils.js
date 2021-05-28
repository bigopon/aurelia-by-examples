import { __decorate } from "tslib";
import { bindable, BindingMode, customAttribute, INode } from '@aurelia/runtime-html';
let RectSize = class RectSize {
    constructor(element) {
        this.element = element;
    }
    binding() {
        let observer = this.observer;
        if (observer === void 0) {
            observer = this.observer = this.createObserver();
        }
        observer.observe(this.element, { box: 'border-box' });
    }
    unbinding() {
        this.observer.disconnect();
        this.observer = (void 0);
    }
    createObserver() {
        return new ResizeObserver((entries) => {
            this.handleResize(entries[0]);
        });
    }
    /**
     * @internal
     */
    handleResize(entry) {
        const boxSize = this.boxSize === 'content-box' ? entry.contentBoxSize : entry.borderBoxSize;
        if (boxSize) {
            // Checking for chrome as using a non-standard array
            if (boxSize[0]) {
                this.value = { width: boxSize[0].inlineSize, height: boxSize[0].blockSize };
            }
            else {
                this.value = {
                    width: boxSize.inlineSize,
                    height: boxSize.blockSize
                };
            }
        }
        else {
            this.value = { width: entry.contentRect.width, height: entry.contentRect.height };
        }
    }
};
RectSize.inject = [INode];
__decorate([
    bindable({ mode: BindingMode.fromView })
], RectSize.prototype, "value", void 0);
__decorate([
    bindable()
], RectSize.prototype, "boxSize", void 0);
RectSize = __decorate([
    customAttribute('rect-size')
], RectSize);
export { RectSize };
