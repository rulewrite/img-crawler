import * as commander from 'commander';
import { urlReplaceKeyword } from './util';
import ZeroPad from './ZeroPad';

interface OptionValues {
  url: Argument['URL'];
  query: Argument['QUERY'];
  range: [Argument['START'], Argument['END']];
  nestedDirectory: Argument['IS_NESTED_DIRECTORY'];
}

export default class Argument {
  private static readonly SINGLE_RANGE = [new ZeroPad('1'), 1] as const;
  private static readonly DEFAULT_RANGE = [new ZeroPad('1'), Infinity];
  private static parseRange(range: string): OptionValues['range'] {
    const [start, end] = range
      .split(',')
      .map((rangeElement) => rangeElement.trim());
    return [new ZeroPad(start), Number(end)];
  }

  readonly URL: string;
  readonly QUERY: string;
  readonly START: ZeroPad;
  readonly END: number;
  readonly IS_NESTED_DIRECTORY: boolean;

  constructor() {
    const { DEFAULT_KEYWORD } = ZeroPad;

    const program = new commander.Command();
    program
      .requiredOption<OptionValues['url']>(
        '-u, --url <url>',
        `크롤링할 url\n여러 페이지 다운로드 시 치환 문자 "${urlReplaceKeyword}"를 포함합니다.\nex) https://dummy.dummy/${urlReplaceKeyword} -> https://dummy.dummy/{start}...https://dummy.dummy/{end}`,
        (url) => url
      )
      .requiredOption<OptionValues['query']>(
        '-q, --query <query-selector>',
        '크롤링할 img 태그의 선택자',
        (querySelector) => querySelector
      )
      .addOption(
        new commander.Option(
          '-r, --range [start, end]',
          `순회 범위를 지정합니다.\n순회할 숫자가 001...999일 경우 '${
            DEFAULT_KEYWORD + DEFAULT_KEYWORD
          }1, 999'로 표기하며\nurl에 치환 문자가 없을 경우 무시됩니다.`
        )
          .default(Argument.DEFAULT_RANGE, '"1, Infinity"')
          .argParser(Argument.parseRange)
      )
      .option(
        '-n, --no-nested-directory',
        '이미지 파일을 같은 디렉토리에 저장합니다.\n순회하지 않을 경우 자동으로 한 디렉토리에 저장됩니다.'
      )
      .parse();

    const { url, query, range, nestedDirectory } = program.opts<OptionValues>();

    const isLoop = url.includes(urlReplaceKeyword);

    this.URL = url;
    this.QUERY = query;
    this.IS_NESTED_DIRECTORY = isLoop && nestedDirectory;
    [this.START, this.END] = isLoop ? range : Argument.SINGLE_RANGE;

    if (Number.isNaN(this.START.NUMBER) || Number.isNaN(this.END)) {
      throw new commander.InvalidArgumentError(
        '페이지 번호가 올바르지 않습니다.'
      );
    }

    if (this.START.NUMBER > this.END) {
      throw new commander.InvalidArgumentError(
        '종료 번호가 시작 번호보다 작을 수 없습니다.'
      );
    }
  }
}
