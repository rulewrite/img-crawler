import Argument from '../src/Argument';
import Range from '../src/Range';
import ZeroPad from '../src/ZeroPad';

describe('노드 인자 받아오기 모듈', () => {
  test('range 인자 파서', () => {
    const expectedStart = new ZeroPad('1');
    const expectedEnd = 2;
    const [start, end] = (Argument as any).parseRange(
      `${expectedStart.NUMBER},${expectedEnd}`
    );

    expect(start).toEqual(expectedStart);
    expect(end).toEqual(expectedEnd);
  });

  const dummyArgv = ['execute node path', 'execute js file'];
  const mapKeyToExpected = new Map([
    ['-q', '.query > img'],
    ['-r', '2, 100'],
  ]);

  test('다중 페이지', () => {
    const expectedUrl = `https://dummy.com/${Range.REPLACE_KEYWORD}`;
    process.argv = [
      ...dummyArgv,
      ...mapKeyToExpected.entries(),
      '-u',
      `https://dummy.com/${Range.REPLACE_KEYWORD}`,
      '-n',
    ].flat();

    const argument = new Argument();

    expect(argument.URL).toEqual(expectedUrl);
    expect(argument.QUERY).toEqual(mapKeyToExpected.get('-q'));

    expect(argument.IS_NESTED_DIRECTORY).toEqual(false);

    const [expectedStart, expectedEnd] = (Argument as any).parseRange(
      mapKeyToExpected.get('-r')
    );
    expect(argument.START).toEqual(expectedStart);
    expect(argument.END).toEqual(expectedEnd);
  });

  describe('단일 페이지', () => {
    process.argv = [
      ...dummyArgv,
      ...mapKeyToExpected.entries(),
      '-u',
      'https://dummy.com/',
    ].flat();

    const { IS_NESTED_DIRECTORY, START, END } = new Argument();

    test('디렉토리 중첩하지 않음', () => {
      expect(IS_NESTED_DIRECTORY).toEqual(false);
    });

    test('시작, 종료 번호 1로 설정', () => {
      const [expectedStart, expectedEnd] = (Argument as any).SINGLE_RANGE;

      expect(START).toEqual(expectedStart);
      expect(END).toEqual(expectedEnd);
    });
  });
});
