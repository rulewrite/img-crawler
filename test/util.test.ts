import * as puppeteer from 'puppeteer';
import {
  getArguments,
  getHtml,
  getElements,
  convertAbsoluteUrls,
} from '../src/util';

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

test('elements 가져오기', () => {
  const expectedLength = 2;
  const elements = getElements(
    `<html><body><div class="dummy">${new Array(expectedLength)
      .fill('<img />')
      .join('')}</div></body></html>`,
    '.dummy img'
  );

  expect(elements.length).toEqual(expectedLength);
});

describe('절대 경로 반환하는 모듈', () => {
  const origin = 'https://dummy.dummy';
  const relativeUrl = 'relative';
  const expectedUrl = `${origin}/${relativeUrl}`;

  test('상대 경로를 절대 경로로 변경하기', () => {
    expect(convertAbsoluteUrls(relativeUrl, origin)).toEqual(expectedUrl);
  });

  test("'/' 붙은 상대 경로를 절대 경로로 변경하기", () => {
    expect(convertAbsoluteUrls(`/${relativeUrl}`, origin)).toEqual(expectedUrl);
  });

  test("'./' 붙은 상대 경로를 절대 경로로 변경하기", () => {
    expect(convertAbsoluteUrls(`./${relativeUrl}`, origin)).toEqual(
      expectedUrl
    );
  });

  test('절대 경로는 그대로 반환', () => {
    expect(convertAbsoluteUrls(expectedUrl, origin)).toEqual(expectedUrl);
  });
});
