import { getArguments } from '../src/util';

test('node 인자 가져오기', () => {
  const expected = ['arg1', 'arg2'];
  process.argv = ['execute node path', 'execute js file', ...expected];

  expect(getArguments()).toEqual(expect.arrayContaining(expected));
});
