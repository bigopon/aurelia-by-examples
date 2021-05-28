export interface IComponentCode {
  readonly script: string;
  readonly template: string;
  readonly styles: string[];
}

export interface IInlineExample {
  id: string;
  title: string;
  type: 'inline',
  desc?: string;
  code: IComponentCode;
}

export interface ILinkExample {
  id: string;
  title: string;
  type: 'link';
  desc?: string;
  /* indicate whether this example shouldn't be loaded eagerly */
  lazy?: boolean;
  link: string;
}

export interface ILoadedLinkExample extends ILinkExample {
  code: IComponentCode;
}

export type IExample = IInlineExample | ILinkExample;
