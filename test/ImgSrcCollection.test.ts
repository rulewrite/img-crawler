import ImgSrcCollection from '../src/ImgSrcCollection';

const urlString = 'https://dummy.dummy/path1/path2';

test('elements 가져오기', () => {
  const expectedLength = 2;
  const imgSrcCollection = new ImgSrcCollection(
    urlString,
    `<html><body><div class="dummy">${new Array(expectedLength)
      .fill(true)
      .map((el, index) => `<img src="${index}"/>`)
      .join('')}</div></body></html>`,
    '.dummy img'
  );

  imgSrcCollection.map((src, index) => {
    expect(src).toEqual(`${index}`);
  });
});

describe('절대 경로 반환하는 모듈', () => {
  const url = new URL(urlString);
  const relativeUrl = 'relative';
  const expectedUrl = `${url.origin}/path1/${relativeUrl}`;

  const convertAbsoluteUrls = (ImgSrcCollection as any).convertAbsoluteUrls;

  test('절대 경로는 그대로 반환', () => {
    expect(convertAbsoluteUrls(expectedUrl, url)).toEqual(expectedUrl);
  });

  test("'/' 최상위 경로를 절대 경로로 변경하기", () => {
    expect(convertAbsoluteUrls(`/${relativeUrl}`, url)).toEqual(
      `${url.origin}/${relativeUrl}`
    );
  });

  test('상대 경로를 절대 경로로 변경하기', () => {
    expect(convertAbsoluteUrls(relativeUrl, url)).toEqual(expectedUrl);
  });

  test("'./' 붙은 상대 경로를 절대 경로로 변경하기", () => {
    expect(convertAbsoluteUrls(`./${relativeUrl}`, url)).toEqual(expectedUrl);
  });
});