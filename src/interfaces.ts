export interface IComponentCode {
  readonly script: string;
  readonly template: string;
  readonly styles: string[];
}

export interface IComponentFile {
  name: string;
  code: IComponentCode;
}

export interface IInlineExample {
  id: string;
  title: string;
  type: 'inline',
  desc?: string;
  lazy?: boolean;
  code: IComponentCode;
  settings?: IExampleSettings;
  files?: IComponentFile[];
}

export interface ILinkExample {
  id: string;
  title: string;
  type: 'link';
  desc?: string;
  lazy?: boolean;
  link: string;
  settings?: IExampleSettings;
}

export interface ILoadedLinkExample extends ILinkExample {
  code: IComponentCode;
}

export type IExample = IInlineExample | ILinkExample;

export interface IExampleSettings {
  /* specific height for the text editor  */
  height?: string;
  /* specific height for the result viewer */
  resultHeight?: string;
}
