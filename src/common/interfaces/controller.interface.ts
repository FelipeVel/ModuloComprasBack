export interface Controller {
  [key: string]: (...args: any[]) => any;
}
