import { BindingMode } from "@aurelia/runtime";
import { bindable, customAttribute, INode } from '@aurelia/runtime-html';

@customAttribute('rect-size')
export class RectSize {

  public static inject = [INode];

  @bindable({ mode: BindingMode.fromView })
  public value!: { width: number; height: number; };

  @bindable()
  public boxSize!: 'border-box' | 'content-box';

  private observer!: ResizeObserver;

  constructor(
    private readonly element: HTMLElement
  ) {

  }

  public binding(): void {
    let observer = this.observer;
    if (observer === void 0) {
      observer = this.observer = this.createObserver();
    }
    observer.observe(this.element, { box: 'border-box' });
  }

  public unbinding(): void {
    this.observer.disconnect();
    this.observer = (void 0)!;
  }

  private createObserver(): ResizeObserver {
    return new ResizeObserver((entries) => {
      this.handleResize(entries[0]);
    });
  }

  /**
   * @internal
   */
  private handleResize(entry: ResizeObserverEntry): void {
    const boxSize = this.boxSize === 'content-box' ? entry.contentBoxSize : entry.borderBoxSize;
    if (boxSize) {
      // Checking for chrome as using a non-standard array
      if (boxSize[0]) {
        this.value = { width: boxSize[0].inlineSize, height: boxSize[0].blockSize };
      } else {
        this.value = {
          width: (boxSize as unknown as ResizeObserverSize).inlineSize,
          height: (boxSize as unknown as ResizeObserverSize).blockSize
        };
      }
    } else {
      this.value = { width: entry.contentRect.width, height: entry.contentRect.height };
    }
  }
}
