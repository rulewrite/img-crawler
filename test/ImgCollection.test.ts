import ImgCollection from '../src/ImgCollection';

describe('html에서 이미지 태그들 파싱', () => {
  const expectedLength = 2;
  const urlString = 'https://dummy.dummy';

  const imgCollection = new ImgCollection(
    new URL(urlString),
    `<html><body><div class="dummy">${new Array(expectedLength)
      .fill(null)
      .map((el, index) => `<img src="${index}"/>`)
      .join('')}</div></body></html>`,
    '.dummy img'
  );

  test('이미지 태그 갯수', () => {
    expect(imgCollection.length).toEqual(expectedLength);
  });

  test('src 파싱', () => {
    (imgCollection as any).imgs.forEach(({ src }, index) => {
      expect(src).toEqual(`${urlString}/${index}`);
    });
  });

  test('iterator', async () => {
    for await (let { filename, index } of imgCollection) {
      expect(filename).toEqual(String(index));
    }
  });
});

test('파일명 가져오기', () => {
  const filename = 'file.name.jpg';
  const url = `https://dummy.dumb/path/path/${filename}`;

  expect((ImgCollection as any).getFilename(url)).toEqual(filename);
});

describe('절대 경로 반환하는 모듈', () => {
  const url = new URL('https://dummy.dummy/path1/path2');
  const relativeUrl = 'relative';
  const expectedUrl = `${url.origin}/path1/${relativeUrl}`;

  const convertAbsoluteUrls = (ImgCollection as any).convertAbsoluteUrls;

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
