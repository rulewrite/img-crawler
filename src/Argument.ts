import { Command } from 'commander';
import Range from './Range';
import ZeroPad from './ZeroPad';

interface OptionValues {
  url: Argument['URL'];
  query: Argument['QUERY'];
  range: Argument['RANGE'];
  singleDirectory: Argument['SINGLE_DIRECTORY'] | undefined;
}

export default class Argument {
  readonly URL: string;
  readonly QUERY: string;
  readonly RANGE: string;
  readonly SINGLE_DIRECTORY: boolean;

  constructor() {
    const { PLACEHOLDER } = ZeroPad;

    const program = new Command();
    program
      .requiredOption<OptionValues['url']>(
        '-u, --url <url>',
        `크롤링할 url\n여러 페이지 다운로드 시 치환 문자 "${Range.REPLACE_KEYWORD}"를 포함합니다.\nex) https://dummy.dummy/${Range.REPLACE_KEYWORD} -> https://dummy.dummy/{start}...https://dummy.dummy/{end}`,
        (url) => url
      )
      .requiredOption<OptionValues['query']>(
        '-q, --query <query-selector>',
        '크롤링할 img 태그의 선택자',
        (querySelector) => querySelector
      )
      .option<OptionValues['range']>(
        '-r, --range [start, end]',
        `순회 범위를 지정합니다.\n순회할 숫자가 001...999일 경우 '${
          PLACEHOLDER + PLACEHOLDER
        }1, 999'로 표기하며\nurl에 치환 문자가 없을 경우 무시됩니다.`,
        (range) => range,
        Range.DEFAULT
      )
      .option(
        '-s, --single-directory',
        '이미지 파일을 같은 디렉토리에 저장합니다.\n순회하지 않을 경우 자동으로 한 디렉토리에 저장됩니다.'
      )
      .parse();

    const { url, query, range, singleDirectory } = program.opts<OptionValues>();

    this.URL = url;
    this.QUERY = query;
    this.RANGE = range;
    this.SINGLE_DIRECTORY = Boolean(singleDirectory);
  }
}
