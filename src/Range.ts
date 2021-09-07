import { InvalidArgumentError } from 'commander';
import ZeroPad from './ZeroPad';

export default class Range {
  public static readonly REPLACE_KEYWORD = '{%}';
  public static readonly DEFAULT = '1, Infinity';

  private static readonly SINGLE = [new ZeroPad('1'), 1] as const;

  private static parse(range: string) {
    const [start, end] = range
      .split(',')
      .map((rangeElement) => rangeElement.trim());

    return [new ZeroPad(start), Number(end)] as const;
  }

  private readonly START: ZeroPad;
  private readonly END: number;
  public readonly IS_NESTED_DIRECTORY: boolean;

  constructor(
    private readonly URL: string,
    range: string,
    nestedDirectory: boolean
  ) {
    const isLoop = URL.includes(Range.REPLACE_KEYWORD);

    this.IS_NESTED_DIRECTORY = isLoop && nestedDirectory;
    [this.START, this.END] = isLoop ? Range.parse(range) : Range.SINGLE;

    if (Number.isNaN(this.START.NUMBER) || Number.isNaN(this.END)) {
      throw new InvalidArgumentError('페이지 번호가 올바르지 않습니다.');
    }

    if (this.START.NUMBER > this.END) {
      throw new InvalidArgumentError(
        '종료 번호가 시작 번호보다 작을 수 없습니다.'
      );
    }
  }

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
