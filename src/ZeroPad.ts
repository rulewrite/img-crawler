export default class ZeroPad {
  static readonly PLACEHOLDER = '#';

  private size = 0;
  readonly NUMBER: number;

  constructor(formatted: string) {
    this.size = formatted.length;
    this.NUMBER = Number(formatted.replaceAll(ZeroPad.PLACEHOLDER, '0'));
  }

  get(num: number): string {
    let numString = num.toString();
    while (numString.length < this.size) numString = '0' + numString;
    return numString;
  }
}
