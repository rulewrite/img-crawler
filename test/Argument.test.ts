import Argument from '../src/Argument';
import Range from '../src/Range';

test('노드 인자 받아오기 모듈', () => {
  const mapKeyToExpected = new Map([
    ['-q', '.query > img'],
    ['-r', '2, 100'],
  ]);
  const expectedUrl = `https://dummy.com/${Range.REPLACE_KEYWORD}`;

  process.argv = [
    'execute node path',
    'execute js file',
    ...mapKeyToExpected.entries(),
    '-u',
    `https://dummy.com/${Range.REPLACE_KEYWORD}`,
    '-n',
  ].flat();

  const argument = new Argument();

  expect(argument.URL).toEqual(expectedUrl);
  expect(argument.QUERY).toEqual(mapKeyToExpected.get('-q'));
  expect(argument.NESTED_DIRECTORY).toEqual(false);
  expect(argument.RANGE).toEqual(mapKeyToExpected.get('-r'));
});
