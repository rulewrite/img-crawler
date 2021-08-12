import axios from 'axios';
import { getArguments, getHtml } from '../src/util';

jest.mock('axios');

beforeEach(() => {
  jest.resetAllMocks();
});

test('node 인자 가져오기', () => {
  const expected = ['arg1', 'arg2'];
  process.argv = ['execute node path', 'execute js file', ...expected];

  expect(getArguments()).toEqual(expect.arrayContaining(expected));
});

test('html 가져오기', async () => {
  const data = '<html></html>';

  axios.get = jest.fn().mockResolvedValue({ data });
  const response = await getHtml('');

  expect(response).toEqual(data);
});
