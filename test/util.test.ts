import * as puppeteer from 'puppeteer';
import { getArguments, getHtml } from '../src/util';

jest.mock('puppeteer');

test('node 인자 가져오기', () => {
  const expected = ['arg1', 'arg2'];
  process.argv = ['execute node path', 'execute js file', ...expected];

  expect(getArguments()).toEqual(expect.arrayContaining(expected));
});

test('html 가져오기', async () => {
  const expectedHtml = '<html></html>';

  (puppeteer as any).launch = jest.fn().mockResolvedValue({
    newPage: () => ({
      goto: () => {},
      content: () => expectedHtml,
    }),
  });

  const html = await getHtml('https://dummy.dummy');
  expect(html).toEqual(expectedHtml);
});
