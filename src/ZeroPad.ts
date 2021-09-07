export default class ZeroPad {
  public static readonly DEFAULT_KEYWORD = '#';
  private size = 0;
  readonly NUMBER: number;

  constructor(formatted: string, keyword = ZeroPad.DEFAULT_KEYWORD) {
    this.size = formatted.length;
    this.NUMBER = Number(formatted.replaceAll(keyword, '0'));
  }

  get(num: number): string {
    let numString = num.toString();
    while (numString.length < this.size) numString = '0' + numString;
    return numString;
  }
}
