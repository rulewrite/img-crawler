import ZeroPad from './ZeroPad';

export default class Range {
  public static readonly REPLACE_KEYWORD = '{%}';

  constructor(
    private readonly URL: string,
    private readonly START: ZeroPad,
    private readonly END: number
  ) {}

  *[Symbol.iterator]() {
    const { URL, START, END } = this;

    for (let index = START.NUMBER; index <= END; index++) {
      const zeroPaddedIndex = START.get(index);

      yield {
        isFirst: index === START.NUMBER,
        index,
        zeroPaddedIndex,
        url: URL.replaceAll(Range.REPLACE_KEYWORD, zeroPaddedIndex),
      };
    }
  }
}
