import Argument from '../src/Argument';

test('노드 인자 받아오기 모듈', () => {
  const mapKeyToExpected = new Map([
    ['-u', 'https://dummy.com/'],
    ['-q', '.query > img'],
    ['-r', '2, 100'],
    ['-s', ''],
  ]);

  process.argv = [
    'execute node path',
    'execute js file',
    ...mapKeyToExpected.entries(),
  ].flat();

  const argument = new Argument();

  expect(argument.URL).toEqual(mapKeyToExpected.get('-u'));
  expect(argument.QUERY).toEqual(mapKeyToExpected.get('-q'));
  expect(argument.SINGLE_DIRECTORY).toEqual(true);
  expect(argument.RANGE).toEqual(mapKeyToExpected.get('-r'));
});
