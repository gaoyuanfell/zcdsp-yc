/* SystemJS module definition */
declare var module: NodeModule;

interface NodeModule {
  id: string;
}

declare module '*.json' {
  const value: any;
  export default value;
}

declare module '*.js' {
  const value: any;
  export default value;
}

declare var echarts: any;
declare var domtoimage: any;
declare var wangEditor: any;
declare var BMap: any;
declare var AMap: any;

interface Date {
  calendar(type: number, num: number): Date

  formatDate(format: string): string
}
