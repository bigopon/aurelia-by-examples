export interface IComponentCode {
  readonly script: string;
  readonly template: string;
  readonly styles: string[];
}

export interface IInlineExample {
  id: string;
  title: string;
  type: 'inline',
  code: IComponentCode;
}

export interface ILazyExample {
  id: string;
  title: string;
  type: 'link';
  link: string;
}

export type IExample = IInlineExample | ILazyExample;