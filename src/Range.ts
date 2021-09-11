import { InvalidArgumentError } from 'commander';
import ZeroPad from './ZeroPad';

export default class Range {
  static readonly REPLACE_KEYWORD = '{%}';
  static readonly DEFAULT = '1, Infinity';

  private static readonly SINGLE = [new ZeroPad('1'), 1] as const;

  private static parse(range: string) {
    const [start, end] = range
      .split(',')
      .map((rangeElement) => rangeElement.trim());

    return [new ZeroPad(start), Number(end)] as const;
  }

  private readonly START: ZeroPad;
  private readonly END: number;
  readonly IS_NESTED_DIRECTORY: boolean;

  constructor(
    private readonly URL: string,
    range: string,
    singleDirectory: boolean
  ) {
    const isLoop = URL.includes(Range.REPLACE_KEYWORD);

    this.IS_NESTED_DIRECTORY = isLoop && !singleDirectory;
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

    for (let current = START.NUMBER; current <= END; current++) {
      const zeroPaddedIndex = START.get(current);

      yield {
        isFirst: current === START.NUMBER,
        current,
        zeroPaddedIndex,
        url: URL.replaceAll(Range.REPLACE_KEYWORD, zeroPaddedIndex),
      };
    }
  }
}
