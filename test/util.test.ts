import {
  getContents,
  getElements,
  convertAbsoluteUrls,
  getFilename,
  getTime,
  ZeroPad,
} from '../src/util';

describe('컨텐츠 받아오기', () => {
  const validUrl = 'https://google.com';

  describe('성공', () => {
    test('구글 html 로드', async () => {
      const { title } = await getContents(validUrl);
      expect(Boolean(title.length)).toEqual(true);
    });
  });

  describe('실패', () => {
    const notValidUrlSegment = 'dddddddasscsccsasscas';
    const defaultContents = {
      title: '',
      html: '',
    };

    test('존재하지 않는 사이트', async () => {
      await expect(
        getContents(`https://${notValidUrlSegment}.com`)
      ).resolves.toEqual(defaultContents);
    });

    test('존재하지 않는 페이지', async () => {
      await expect(
        getContents(`${validUrl}/${notValidUrlSegment}`)
      ).resolves.toEqual(defaultContents);
    });
  });
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
  const url = new URL('https://dummy.dummy/path1/path2');
  const relativeUrl = 'relative';
  const expectedUrl = `${url.origin}/path1/${relativeUrl}`;

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

test('파일명 가져오는 모듈', () => {
  const filename = 'file.name.jpg';
  const url = `https://dummy.dumb/path/path/${filename}`;

  expect(getFilename(url)).toEqual(filename);
});

test('시간 정보 가져오는 모듈', () => {
  getTime('!')
    .split('!')
    .map((time) => Number(time))
    .forEach((time) => expect(Number.isInteger(time)).toEqual(true));
});

describe('0 붙은 숫자 만들어주는 모듈', () => {
  const num = 11;
  const zeroPad = new ZeroPad(`##${num}`, '#');

  test('숫자 정보', () => {
    expect(zeroPad.NUMBER).toEqual(num);
  });

  test('1 -> 0001', () => {
    expect(zeroPad.get(1)).toEqual('0001');
  });

  test('21 -> 0021', () => {
    expect(zeroPad.get(21)).toEqual('0021');
  });

  test('99999 -> 99999', () => {
    expect(zeroPad.get(99999)).toEqual('99999');
  });
});
