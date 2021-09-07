import ZeroPad from '../src/ZeroPad';
import Range from '../src/Range';

describe('순회 테스트', () => {
  const baseUrl = 'https://google.com/';
  const range = new Range(
    `${baseUrl}${Range.REPLACE_KEYWORD}`,
    new ZeroPad('2'),
    4
  );

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
