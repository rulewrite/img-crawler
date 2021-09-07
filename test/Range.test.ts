import ZeroPad from '../src/ZeroPad';
import Range from '../src/Range';

const baseUrl = 'https://google.com/';

describe('순회 테스트', () => {
  const range = new Range(`${baseUrl}${Range.REPLACE_KEYWORD}`, '2,4', false);

  test('처음 여부', () => {
    expect([...range].map(({ isFirst }) => isFirst)).toEqual([
      true,
      false,
      false,
    ]);
  });

  test('url', () => {
    expect([...range].map(({ url }) => url.replaceAll(baseUrl, ''))).toEqual([
      '2',
      '3',
      '4',
    ]);
  });
});

describe('단일 테스트', () => {
  const range: any = new Range(baseUrl, '2,4', true);

  test('디렉토리 중첩하지 않음', () => {
    expect(range.IS_NESTED_DIRECTORY).toEqual(false);
  });

  test('시작, 종료 번호 1로 설정', () => {
    const [expectedStart, expectedEnd] = (Range as any).SINGLE;

    expect(range.START).toEqual(expectedStart);
    expect(range.END).toEqual(expectedEnd);
  });
});

test('range 인자 파서', () => {
  const expectedStart = new ZeroPad('1');
  const expectedEnd = 2;
  const [start, end] = (Range as any).parse(
    `${expectedStart.NUMBER}, ${expectedEnd}`
  );

  expect(start).toEqual(expectedStart);
  expect(end).toEqual(expectedEnd);
});
