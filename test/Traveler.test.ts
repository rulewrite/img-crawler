import Traveler from '../src/Traveler';

describe('컨텐츠 받아오기', () => {
  let traveler: Traveler;
  beforeAll(async () => {
    traveler = new Traveler();
    await traveler.launch();
  });

  const validUrl = 'https://google.com';

  describe('성공', () => {
    test('구글 html 로드', async () => {
      const { title } = await traveler.goto(validUrl);
      expect(Boolean(title.length)).toEqual(true);
    });
  });

  describe('실패', () => {
    const notValidUrlSegment = `dummy-${Date.now()}`;
    const defaultContents = {
      title: '',
      html: '',
    };

    test('존재하지 않는 사이트', async () => {
      await expect(
        traveler.goto(`https://${notValidUrlSegment}.com`)
      ).resolves.toEqual(defaultContents);
    });

    test('존재하지 않는 페이지', async () => {
      await expect(
        traveler.goto(`${validUrl}/${notValidUrlSegment}`)
      ).resolves.toEqual(defaultContents);
    });
  });

  afterAll(async () => {
    await traveler.close();
  });
});
